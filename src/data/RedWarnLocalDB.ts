import Dexie from "dexie";

export interface CachedDependency {
    id?: string;
    lastCache: number;
    etag: string;
    data: string;
}

export default class RedWarnLocalDB {
    public static i = new RedWarnLocalDB();
    private dexie: Dexie;

    dependencyCache: Dexie.Table<CachedDependency, string>;

    constructor() {
        if (RedWarnLocalDB.i != null)
            throw new Error(
                "RedWarnLocalDB already exists! (as `RedWarnLocalDB.i`)"
            );

        this.dexie = new Dexie("redwarnLiteDB");
        this.dexie.version(1).stores({
            dependencyCache: "++id,lastCache,etag,data",
        });

        this.dependencyCache = this.dexie.table("dependencyCache");
    }

    async open(): Promise<Dexie> {
        return this.dexie.open();
    }
}
