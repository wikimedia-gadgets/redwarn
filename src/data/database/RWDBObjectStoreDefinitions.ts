import {RWErrors} from "rww/errors/RWError";

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

export interface LogItem {
    id?: string;
    /**
     * Unix epoch
     */
    timestamp: number;
    code?: RWErrors;
    data: Record<string, any>;
}

export interface WatchedPage {
    title?: string;
}

export interface RecentPage {
    title?: string;
    lastVisit: number;
}
