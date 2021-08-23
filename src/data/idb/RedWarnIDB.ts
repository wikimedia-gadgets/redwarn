import RedWarnIDBError from "rww/data/idb/RedWarnIDBError";
import RedWarnIDBObjectStore from "rww/data/idb/RedWarnIDBObjectStore";
import Log from "rww/data/RedWarnLog";
import RedWarn from "rww/RedWarn";
import RedWarnUI from "rww/ui/RedWarnUI";

// The `idb` directory is for the IndexedDB wrapper. You might be
// looking for `database` instead, which contains RedWarn-specialized
// objects.

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
        this.request = indexedDB.open(_databaseName, _version);
        this.request.addEventListener("upgradeneeded", async (event) => {
            Log.debug(
                `Upgrade needed. Going from version ${event.oldVersion} to ${event.newVersion}`
            );
            for (
                let currentVersion = event.oldVersion;
                currentVersion < event.newVersion;
                currentVersion++
            ) {
                _upgradeProcedures[event.oldVersion](this.request);
            }
        });
    }

    static createObjectStore(
        database: IDBDatabase,
        store: string,
        keyPath: string,
        columns: (string | RWIDBColumn)[]
    ) {
        const objectStore = database.createObjectStore(store, {
            keyPath: keyPath
        });

        for (const column of Object.values(columns)) {
            if (typeof column === "string")
                objectStore.createIndex(column, column);
            else objectStore.createIndex(column.name, column.name, column);
        }
    }

    async connect(): Promise<IDBDatabase> {
        // Just resolve already if the database has already been connected to.
        if (this.request.readyState !== "done")
            await new Promise((resolve, reject) => {
                this.request.addEventListener("success", resolve);
                this.request.addEventListener("error", reject);
                setInterval(() => {
                    if (this.request.readyState === "done") resolve(null);
                }, 5);
            });
        return (this.database = this.request.result);
    }

    async transaction(
        store: string | string[],
        mode: IDBTransactionMode,
        _database?: IDBDatabase
    ): Promise<IDBTransaction> {
        const database = _database ?? this.database;
        return database.transaction(store, mode);
    }

    /**
     * This is used for operations which involve lots of writing. This avoids
     * having to create more transactions that needed.
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

    async runRequest<T>(
        store: string,
        mode: IDBTransactionMode,
        callback: (objectStore: IDBObjectStore) => IDBRequest<T>
    ): Promise<T> {
        // Safari bug fix needed
        return new Promise(async (resolve, reject) => {
            const transaction = await this.transaction(store, mode);
            const objectStore = transaction.objectStore(store);

            try {
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
                Log.error(error);
                // Reject promise
                reject(
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
