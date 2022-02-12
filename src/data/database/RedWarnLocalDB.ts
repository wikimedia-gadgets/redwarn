import RedWarnIDB, {
    RedWarnIDBUpgradeHandler,
} from "rww/data/database/RedWarnIDB";
import {
    RW_DATABASE_NAME,
    RW_DATABASE_VERSION,
} from "rww/data/RedWarnConstants";
import RedWarnIDBObjectStore from "rww/data/database/RedWarnIDBObjectStore";
import {
    CachedDependency,
    CacheTracker,
    LogItem,
    WatchedPage,
} from "rww/data/database/RWDBObjectStoreDefinitions";
import Group from "rww/mediawiki/core/Group";
import Log from "rww/data/RedWarnLog";

/**
 * A set of functions responsible for setting up the RedWarn IndexedDB
 * database. This object is indexed by its old version, with `0` being
 * the initial creation of all database objects. This means the handler
 * with an index of `1` is responsible for upgrading the database from
 * version `1` to `2`, `2` upgrades to `3`, and so on.
 */
const databaseUpdaters: { [key: number]: RedWarnIDBUpgradeHandler } = {
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

        // Logging
        RedWarnIDB.createObjectStore(database, "errorLog", "id", [
            "timestamp",
            "code",
            "data",
        ]);
        // TODO only on debug mode
        /* RedWarnIDB.createObjectStore(database, "combinedLog", "id", [
            "timestamp",
            "code",
            "data",
        ]); */
    },
};

export default class RedWarnLocalDB {
    public static i = new RedWarnLocalDB();

    // Object stores go below.
    cacheTracker: RedWarnIDBObjectStore<CacheTracker>;
    dependencyCache: RedWarnIDBObjectStore<CachedDependency>;
    groupCache: RedWarnIDBObjectStore<Group>;
    watchedPages: RedWarnIDBObjectStore<WatchedPage>;
    errorLog: RedWarnIDBObjectStore<LogItem>;
    combinedLog?: RedWarnIDBObjectStore<LogItem>;
    // Object stores go above.

    private _open: boolean;
    private idb: RedWarnIDB;

    public get open(): boolean {
        return this._open;
    }

    private constructor() {
        if (RedWarnLocalDB.i != null)
            throw new Error(
                "RedWarnLocalDB already exists! (as `RedWarnLocalDB.i`)"
            );

        this.idb = new RedWarnIDB(
            RW_DATABASE_NAME,
            RW_DATABASE_VERSION,
            databaseUpdaters
        );
    }

    async connect(): Promise<IDBDatabase> {
        Log.trace("Connecting to RedWarn IDB...");
        const connect = await this.idb.connect();
        Log.trace("Connected to IDB.");

        // Handle _open
        this._open = true;
        connect.addEventListener("close", () => {
            this._open = false;
        });

        // Apply all database definitions
        this.cacheTracker = this.idb.store<CacheTracker>("cacheTracker");
        this.dependencyCache =
            this.idb.store<CachedDependency>("dependencyCache");
        this.groupCache = this.idb.store<Group>("groupCache");
        this.watchedPages = this.idb.store<WatchedPage>("watchedPages");

        this.errorLog = this.idb.store<LogItem>("errorLog");
        // TODO only on debug mode
        //this.combinedLog = this.idb.store<LogItem>("combinedLog");

        return connect;
    }
}
