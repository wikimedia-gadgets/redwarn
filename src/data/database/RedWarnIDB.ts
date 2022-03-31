import RedWarnIDBError from "app/data/database/RedWarnIDBError";
import RedWarnIDBObjectStore from "app/data/database/RedWarnIDBObjectStore";
import Log from "app/data/RedWarnLog";
import i18next from "i18next";

export type RedWarnIDBUpgradeHandler = (
    openRequest: IDBOpenDBRequest
) => Promise<void> | void;

interface RWIDBColumn {
    name: string;
    id?: boolean;
    multiEntry?: boolean;
    unique?: boolean;
}

/**
 * A simple wrapper around IDB to promisify everything and to make transactions
 * super easy and predictable.
 */
export default class RedWarnIDB {
    request: IDBOpenDBRequest;
    database: IDBDatabase;

    get databaseName(): string {
        return this._databaseName;
    }
    get version(): number {
        return this._version;
    }

    public constructor(
        private _databaseName: string,
        private _version: number,
        private _upgradeProcedures: { [key: number]: RedWarnIDBUpgradeHandler }
    ) {
        this.setup();
    }

    async setup(): Promise<void> {
        this.request = indexedDB.open(this._databaseName, this._version);
        this.request.addEventListener("upgradeneeded", async (event) => {
            Log.debug(
                `Upgrade needed. Going from version ${event.oldVersion} to ${event.newVersion}`
            );
            for (
                let currentVersion = event.oldVersion;
                currentVersion < event.newVersion;
                currentVersion++
            ) {
                this._upgradeProcedures[event.oldVersion](this.request);
            }
        });
        await this.connect();
    }

    async connect(): Promise<IDBDatabase> {
        // Just resolve already if the database has already been connected to.
        if (this.request.readyState !== "done")
            await new Promise((resolve, reject) => {
                this.request.addEventListener("success", resolve);
                this.request.addEventListener("error", () =>
                    reject(
                        new RedWarnIDBError(
                            "Failed to open database connection.",
                            this.database
                        )
                    )
                );
                setInterval(() => {
                    if (this.request.readyState === "done") resolve(null);
                }, 5);
            });
        return (this.database = this.request.result);
    }

    static createObjectStore(
        database: IDBDatabase,
        store: string,
        keyPath: string,
        columns: (string | RWIDBColumn)[]
    ) {
        const objectStore = database.createObjectStore(store, {
            keyPath: keyPath,
        });

        for (const column of Object.values(columns)) {
            if (typeof column === "string")
                objectStore.createIndex(column, column);
            else objectStore.createIndex(column.name, column.name, column);
        }
    }

    /**
     * Destroyes the IndexedDB database.
     *
     * <b>WARNING: This will delete caches and visited pages history!</b>
     */
    async deleteDatabase(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase(this._databaseName);
            deleteRequest.addEventListener("error", () => {
                reject();
            });
            deleteRequest.addEventListener("success", () => {
                resolve();
            });
            if (deleteRequest.readyState === "done") resolve();
        });
    }

    async transaction(
        store: string | string[],
        mode: IDBTransactionMode,
        _database?: IDBDatabase
    ): Promise<IDBTransaction> {
        try {
            const database = _database || this.database;
            return database.transaction(store, mode);
        } catch (error) {
            Log.error(error);
            return Promise.reject(error);
        }
    }

    /**
     * This is used for operations which involve lots of writing. This avoids
     * having to create more transactions than needed.
     */
    async runTransaction(
        store: string | string[],
        mode: IDBTransactionMode,
        callback: (transaction: IDBTransaction) => void | Promise<void>
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const transaction = await this.transaction(store, mode);
            await callback(transaction);

            transaction.addEventListener("complete", () => {
                resolve();
            });
            transaction.addEventListener("abort", () => {
                reject(
                    new RedWarnIDBError(
                        "Transaction aborted",
                        this.database,
                        transaction
                    )
                );
            });
            transaction.addEventListener("error", () => {
                reject(
                    new RedWarnIDBError(
                        "Transaction erred",
                        this.database,
                        transaction
                    )
                );
            });
        });
    }

    /**
     * Provides a {@link IDBRequest} object for a databsae transaction. This will
     * attempt to retry if `noRetry` is set to true.
     *
     * @param store The store to access.
     * @param mode The IDB transaction mode.
     * @param callback A callback containing the object store.
     * @param noRetry Whether to retry on errors.
     */
    async runRequest<T>(
        store: string,
        mode: IDBTransactionMode,
        callback: (objectStore: IDBObjectStore) => IDBRequest<T>,
        noRetry = false
    ): Promise<T> {
        // Safari bug fix needed
        return new Promise(async (resolve, reject) => {
            let transaction: IDBTransaction;
            try {
                transaction = await this.transaction(store, mode);
                const objectStore = transaction.objectStore(store);

                const request = callback(objectStore);
                request.addEventListener("success", () => {
                    resolve(request.result);
                });
                request.addEventListener("abort", () => {
                    reject(
                        new RedWarnIDBError(
                            "Transaction aborted",
                            this.database,
                            transaction,
                            request
                        )
                    );
                });
            } catch (error) {
                Log.error("Database error.", error);
                if (
                    error instanceof DOMException &&
                    error.name === "NotFoundError"
                ) {
                    Log.warn(
                        "Upgraded database might have been accessed on an old " +
                            "version of RedWarn, or database schema changes were made without " +
                            "deleting the browser IndexedDB. In either case, this database " +
                            "is likely no longer usable."
                    );
                    Log.warn("Deleting IndexedDB database for a fix...");
                    await this.deleteDatabase();
                    mw.notify(i18next.t<string>("misc:idb.forceDeleted"));

                    if (!noRetry) {
                        await this.setup();
                        // Set noRetry to true and avoid infinite loops.
                        return resolve(
                            await this.runRequest(store, mode, callback, true)
                        );
                    }
                }
                // Reject promise
                throw reject(
                    new RedWarnIDBError(
                        "A general error occured during IDB load",
                        this.database,
                        transaction,
                        null
                    )
                );
            }
        });
    }

    store<T>(storeName: string): RedWarnIDBObjectStore<T> {
        return new RedWarnIDBObjectStore<T>(this, storeName);
    }
}
