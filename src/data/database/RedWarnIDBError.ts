export default class RedWarnIDBError extends Error {
    constructor(
        message: string,
        public database?: IDBDatabase,
        public transaction?: IDBTransaction,
        public request?: IDBRequest
    ) {
        super(message);
    }
}
