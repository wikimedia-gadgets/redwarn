import RedWarnIDB from "app/data/database/RedWarnIDB";
import {
    RW_DATABASE_NAME,
    RW_DATABASE_VERSION,
} from "app/data/RedWarnConstants";
import RedWarnIDBObjectStore from "app/data/database/RedWarnIDBObjectStore";
import {
    CachedDependency,
    CacheTracker,
    LogItem,
    RecentPage,
    WatchedPage,
} from "app/data/database/RWDBObjectStoreDefinitions";
import Group from "app/mediawiki/core/Group";
import Log from "app/data/RedWarnLog";
import RedWarnIDBUpgraders from "app/data/database/RedWarnIDBUpgraders";

export default class RedWarnLocalDB {
    public static i = new RedWarnLocalDB();

    // Object stores go below.
    cacheTracker: RedWarnIDBObjectStore<CacheTracker>;
    dependencyCache: RedWarnIDBObjectStore<CachedDependency>;
    groupCache: RedWarnIDBObjectStore<Group>;
    watchedPages: RedWarnIDBObjectStore<WatchedPage>;
    recentPages: RedWarnIDBObjectStore<RecentPage>;
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
            RedWarnIDBUpgraders
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
        this.recentPages = this.idb.store<RecentPage>("recentPages");

        this.errorLog = this.idb.store<LogItem>("errorLog");
        // TODO only on debug mode
        //this.combinedLog = this.idb.store<LogItem>("combinedLog");

        return connect;
    }
}
