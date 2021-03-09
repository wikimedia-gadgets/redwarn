export interface CachedDependency {
    id?: string;
    lastCache: number;
    etag: string;
    data: string;
}
