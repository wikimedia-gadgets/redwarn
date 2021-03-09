import RedWarnIDB from "rww/data/idb/RedWarnIDB";

type IDBStoreKeyType =
    | number
    | string
    | Date
    | ArrayBufferView
    | ArrayBuffer
    | IDBArrayKey;

export default class RedWarnIDBObjectStore<T> {
    constructor(private database: RedWarnIDB, private storeName: string) {}

    /**
     * @see {@link IDBObjectStore.add}
     */
    async add(value: T, key?: IDBStoreKeyType): Promise<IDBValidKey> {
        return this.database.runRequest(
            this.storeName,
            "readwrite",
            (store) => {
                return store.add(value, key);
            }
        );
    }

    /**
     * @see {@link IDBObjectStore.clear}
     */
    async clear(): Promise<void> {
        return this.database.runRequest(
            this.storeName,
            "readwrite",
            (store) => {
                return store.clear();
            }
        );
    }

    /**
     * @see {@link IDBObjectStore.count}
     */
    async count(key?: IDBValidKey | IDBKeyRange): Promise<number> {
        return this.database.runRequest(this.storeName, "readonly", (store) => {
            return store.count(key);
        });
    }

    /**
     * @see {@link IDBObjectStore.delete}
     */
    async delete(key?: IDBValidKey | IDBKeyRange): Promise<number> {
        return this.database.runRequest(
            this.storeName,
            "readwrite",
            (store) => {
                return store.count(key);
            }
        );
    }

    /**
     * @see {@link IDBObjectStore.get}
     */
    async get(query?: IDBValidKey | IDBKeyRange): Promise<T> {
        return this.database.runRequest(this.storeName, "readonly", (store) => {
            return store.get(query);
        });
    }

    /**
     * @see {@link IDBObjectStore.getKey}
     */
    async getKey(
        query?: IDBValidKey | IDBKeyRange
    ): Promise<IDBValidKey | undefined> {
        return this.database.runRequest(this.storeName, "readonly", (store) => {
            return store.getKey(query);
        });
    }

    /**
     * @see {@link IDBObjectStore.getAll}
     */
    async getAll(
        query?: IDBValidKey | IDBKeyRange | null,
        count?: number
    ): Promise<T[]> {
        return this.database.runRequest(this.storeName, "readonly", (store) => {
            return store.getAll(query, count);
        });
    }

    /**
     * @see {@link IDBObjectStore.getAllKeys}
     */
    async getAllKeys(
        query?: IDBValidKey | IDBKeyRange | null,
        count?: number
    ): Promise<IDBValidKey[]> {
        return this.database.runRequest(this.storeName, "readonly", (store) => {
            return store.getAllKeys(query, count);
        });
    }

    /**
     * @see {@link IDBObjectStore.openCursor}
     */
    async openCursor(
        query?: IDBValidKey | IDBKeyRange | null,
        direction?: IDBCursorDirection
    ): Promise<IDBCursorWithValue | null> {
        return this.database.runRequest(this.storeName, "readonly", (store) => {
            return store.openCursor(query, direction);
        });
    }

    /**
     * @see {@link IDBObjectStore.openKeyCursor}
     */
    async openKeyCursor(
        query?: IDBValidKey | IDBKeyRange | null,
        direction?: IDBCursorDirection
    ): Promise<IDBCursor | null> {
        return this.database.runRequest(this.storeName, "readonly", (store) => {
            return store.openKeyCursor(query, direction);
        });
    }

    /**
     * @see {@link IDBObjectStore.put}
     */
    async put(value: T, key?: IDBValidKey): Promise<IDBValidKey> {
        return this.database.runRequest(
            this.storeName,
            "readwrite",
            (store) => {
                return store.put(value, key);
            }
        );
    }
}
