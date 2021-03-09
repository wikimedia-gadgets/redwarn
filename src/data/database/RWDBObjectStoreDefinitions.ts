export interface CacheTracker {
    id?: string;
    timestamp: number;
}

export interface CachedDependency {
    id?: string;
    lastCache: number;
    etag: string;
    data: string;
}
