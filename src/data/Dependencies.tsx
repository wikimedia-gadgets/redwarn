import { h } from "tsx-dom";
import { generateId } from "rww/util";
import RedWarnLocalDB from "rww/data/database/RedWarnLocalDB";
import Log from "rww/data/RedWarnLog";
import RedWarnIDBObjectStore from "rww/data/database/RedWarnIDBObjectStore";
import { CachedDependency } from "rww/data/database/RWDBObjectStoreDefinitions";

/*
 * This file uses TSX only to quickly build <link> and <script>
 * tags. TSX not be used for any other purpose in this file.
 */

export interface DependencyCacheOptions {
    duration: number;
    /**
     * If set to `true`, the cached dependency will only be reloaded when the
     * cache expires. An ETag and Last-Modified header check will no longer be
     * performed.
     */
    expireOnly?: boolean;
    /**
     * This will no longer wait for the HEAD check to finish before serving
     * the dependency. Set this to `true` in the event that your dependency does
     * not need to be of the latest version.
     */
    delayedReload?: boolean;
}

export interface DependencyGlobals {
    async?: boolean;
    cache?: false | DependencyCacheOptions;
}

export interface Dependency extends DependencyGlobals {
    id: string;
    src: string;
    type: "style" | "script";
}

export default class Dependencies {
    /**
     * Resolves all dependencies from {@link RedWarnStore}.
     */
    static async resolve(dependencyLists: Dependency[][]): Promise<void> {
        const headElements = (
            await Promise.all(
                dependencyLists.map((list) =>
                    Dependencies.buildDependencyElements(list)
                )
            )
        ).reduce((p, n) => {
            return p.concat(...n);
        }, []);

        document.head.append(...headElements);
        await Promise.all(headElements.map((e) => e.promise));
    }

    /**
     * Loads a dependency dynamically.
     * @param dependency The dependency.
     * @returns A boolean Promise, whether the element loaded successfully or not.
     */
    static async loadDependency(dependency: Dependency): Promise<boolean> {
        const depElement = await Dependencies.buildDependency(dependency);
        let oldElement;
        if ((oldElement = document.getElementById(depElement.id)) == null)
            document.head.append(depElement);
        else {
            oldElement.parentElement.replaceChild(depElement, oldElement);
        }
        if (dependency.async) return;
        else return depElement.promise;
    }

    static async buildDependency(
        dependency: Dependency
    ): Promise<HTMLElement & { promise: Promise<boolean> }> {
        let resolver: (success: boolean) => void;
        const loadPromise = new Promise<boolean>((res) => {
            resolver = res;
        });

        let e;
        if (dependency.type === "script") {
            e = Object.assign(
                <script
                    id={`rw_dep-${dependency.id ?? generateId(8)}`}
                    type="application/javascript"
                    onLoad={() => {
                        resolver(true);
                    }}
                    src={await Dependencies.getDependencyURI(dependency)}
                />,
                { promise: loadPromise }
            ) as HTMLElement & { promise: Promise<boolean> };
        } else {
            e = Object.assign(
                <link
                    id={`rw_dep-${dependency.id ?? generateId(8)}`}
                    rel="stylesheet"
                    type="text/css"
                    onLoad={() => {
                        resolver(true);
                    }}
                    href={await Dependencies.getDependencyURI(dependency)}
                />,
                { promise: loadPromise }
            ) as HTMLElement & { promise: Promise<boolean> };
        }
        return e;
    }

    static async buildDependencyElements(
        depsList: Dependency[]
    ): Promise<(HTMLElement & { promise: Promise<boolean> })[]> {
        const buildPromises: Promise<
            HTMLElement & { promise: Promise<boolean> }
        >[] = [];
        for (const dependency of depsList) {
            Log.debug(
                `Loading ${dependency.type} dependency: ${dependency.src}`
            );

            buildPromises.push(Dependencies.buildDependency(dependency));
        }

        return await Promise.all(buildPromises);
    }

    static getDependencyElement(dependencyId: string): HTMLElement {
        return document.getElementById(`rw_dep-${dependencyId}`);
    }

    /**
     * Automatically handles a dependency's URI in case it is a cached
     * dependency.
     *
     * @param dependency The dependency to check
     * @returns A normal URL if uncached, a data URI if cached.
     */
    static async getDependencyURI(dependency: Dependency): Promise<string> {
        const cacheStore = RedWarnLocalDB.i.dependencyCache;

        if (dependency.cache) {
            let cachedDep = await cacheStore.get(dependency.id);
            let willRecacheNow: boolean;

            const recacheCheck = async () => {
                try {
                    const { headers } = await fetch(dependency.src, {
                        method: "HEAD",
                    });

                    if (headers.get("ETag") ?? "" !== cachedDep.etag ?? "")
                        // ETag is different. This indicates a file change.
                        return true;
                    else if (
                        new Date(headers.get("Last-Modified")).getTime() >
                        cachedDep.lastCache
                    )
                        // File was updated.
                        return true;
                } catch (e) {
                    // Something wrong happened during header retrieval. Just fallback to cached version.
                    return false;
                }
            };

            if (cachedDep == null)
                // Cache if there is no cached dependency.
                willRecacheNow = true;
            else if (
                Date.now() - cachedDep.lastCache >
                dependency.cache.duration
            )
                // Cache has already expired.
                willRecacheNow = true;
            else if (
                !dependency.cache.expireOnly &&
                !dependency.cache.delayedReload
            ) {
                // Cache if needed.
                willRecacheNow = await recacheCheck();
            }
            // Fall back to cache.
            else willRecacheNow = false;

            if (willRecacheNow) {
                Log.trace(
                    `Dependency needs caching: ${dependency.src}. Recaching immediately...`
                );
                try {
                    cachedDep = await Dependencies.recacheDependency(
                        cacheStore,
                        dependency
                    );
                } catch (e) {
                    // Something wrong happened during reload. If a cache exists, use it. Otherwise,
                    // we'll just use the src as the URI and hope that the browser resolves the situation.
                    if (cachedDep == null) {
                        Log.warn(
                            "Failed to load caching dependency. Falling back to browser...",
                            e
                        );
                    }
                }
            } else {
                // Keep inside else in order to prevent caching twice.

                if (
                    !dependency.cache.expireOnly &&
                    dependency.cache.delayedReload
                ) {
                    // If it's delayed, asynchronously recache.
                    recacheCheck().then(async (willRecache) => {
                        if (willRecache) {
                            await Dependencies.recacheDependency(
                                cacheStore,
                                dependency
                            );
                            Log.trace(
                                `Finished HEAD checking for dependency: ${dependency.src}`
                            );
                        }
                    });
                }
            }

            // At this point, cachedDep contains either the new data or the old one if
            // retrieval failed. There is, however, a "possibly null or undefined" linter
            // problem here, so the extra ternary operator is there to silence it.

            // Strip source maps.
            if (cachedDep != null && dependency.type === "style") {
                cachedDep.data = cachedDep.data.replace(
                    /\/\*\s*#\s*sourceMappingURL=.+?\s*\*\//g,
                    ""
                );
            }

            return cachedDep
                ? URL.createObjectURL(
                      new Blob([cachedDep.data], {
                          type:
                              dependency.type === "script"
                                  ? "application/javascript"
                                  : "text/css",
                      })
                  )
                : dependency.src;
        } else {
            return dependency.src;
        }
    }

    static async recacheDependency(
        cacheStore: RedWarnIDBObjectStore<CachedDependency>,
        dependency: Dependency
    ): Promise<CachedDependency> {
        Log.debug(`Recaching dependency: ${dependency.src}`);
        const data = await fetch(dependency.src);

        const cachedDep = {
            id: dependency.id,
            lastCache: Date.now(),
            etag: data.headers.get("ETag") ?? "",
            data: (await data.text()).toString(),
        };

        await cacheStore.put(cachedDep);
        Log.trace(`Redownloaded dependency: ${dependency.src}`);
        return cachedDep;
    }
}
