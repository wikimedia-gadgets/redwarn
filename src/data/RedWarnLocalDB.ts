import RedWarnIDB, { RedWarnIDBUpgradeHandler } from "rww/data/idb/RedWarnIDB";
import { RW_DATABASE_VERSION } from "rww/data/RedWarnConstants";
import RedWarnIDBObjectStore from "rww/data/idb/RedWarnIDBObjectStore";
import { CachedDependency } from "rww/data/database/RWDBObjectStoreDefinitions";

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
        RedWarnIDB.createObjectStore(database, "dependencyCache", "id", [
            "lastCache",
            "etag",
            "data",
        ]);
    },
};

export default class RedWarnLocalDB {
    public static i = new RedWarnLocalDB();

    // Object stores go below.
    dependencyCache: RedWarnIDBObjectStore<CachedDependency>;
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
            "redwarnLiteDB",
            RW_DATABASE_VERSION,
            databaseUpdaters
        );
    }

    async connect(): Promise<IDBDatabase> {
        const connect = await this.idb.connect();

        // Handle _open
        this._open = true;
        connect.addEventListener("close", () => {
            this._open = false;
        });

        // Apply all database definitions
        this.dependencyCache = this.idb.store<CachedDependency>(
            "dependencyCache"
        );

        return connect;
    }
}
