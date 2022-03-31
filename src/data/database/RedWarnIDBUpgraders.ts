import RedWarnIDB, {
    RedWarnIDBUpgradeHandler,
} from "app/data/database/RedWarnIDB";

/**
 * A set of functions responsible for setting up the RedWarn IndexedDB
 * database. This object is indexed by its old version, with `0` being
 * the initial creation of all database objects. This means the handler
 * with an index of `1` is responsible for upgrading the database from
 * version `1` to `2`, `2` upgrades to `3`, and so on.
 */
export default <{ [key: number]: RedWarnIDBUpgradeHandler }>{
    0: (openRequest) => {
        const database = openRequest.result;

        // Creates the dependency cache
        RedWarnIDB.createObjectStore(database, "cacheTracker", "id", [
            "timestamp",
        ]);
        RedWarnIDB.createObjectStore(database, "dependencyCache", "id", [
            "lastCache",
            "etag",
            "data",
        ]);
        RedWarnIDB.createObjectStore(database, "groupCache", "name", [
            "page",
            "displayName",
        ]);
        RedWarnIDB.createObjectStore(database, "watchedPages", "title", []);
        RedWarnIDB.createObjectStore(database, "recentPages", "title", []);

        // Logging
        RedWarnIDB.createObjectStore(database, "errorLog", "id", [
            "timestamp",
            "code",
            "data",
        ]);
    },
};
