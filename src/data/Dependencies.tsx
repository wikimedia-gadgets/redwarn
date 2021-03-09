import { h } from "tsx-dom";
import { generateId, toBase64URL } from "rww/util";
import RedWarnLocalDB from "rww/data/RedWarnLocalDB";

export interface DependencyCacheOptions {
    duration: number;
    /**
     * If set to `true`, the cached dependency will only be reloaded when the
     * cache expires. An ETag and Last-Modified header check will no longer be
     * performed.
     */
    expireOnly?: boolean;
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
        const depElement = await this.buildDependency(dependency);
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
                    src={await this.getDependencyURI(dependency)}
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
                    href={await this.getDependencyURI(dependency)}
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
            console.log(
                `Loading ${dependency.type} dependency: ${dependency.src}`
            );

            buildPromises.push(this.buildDependency(dependency));
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

            let willRecache = false;

            if (cachedDep == null) willRecache = true;
            else if (
                Date.now() - cachedDep.lastCache >
                dependency.cache.duration
            )
                // Cache has already expired.
                willRecache = true;
            else if (!dependency.cache.expireOnly) {
                try {
                    const { headers } = await fetch(dependency.src, {
                        method: "HEAD",
                    });

                    if (headers.get("ETag") ?? "" !== cachedDep.etag ?? "")
                        // ETag is different. This indicates a file change.
                        willRecache = true;
                    else if (
                        new Date(headers.get("Last-Modified")).getTime() >
                        cachedDep.lastCache
                    )
                        // File was updated.
                        willRecache = true;
                } catch (e) {
                    // Something wrong happened during header retrieval. Just fallback to cached version.
                }
            }

            if (willRecache)
                try {
                    const data = await fetch(dependency.src);

                    cachedDep = {
                        id: dependency.id,
                        lastCache: Date.now(),
                        etag: data.headers.get("ETag") ?? "",
                        data: (await data.text()).toString(),
                    };

                    console.log(cachedDep);

                    await cacheStore.put(cachedDep);
                } catch (e) {
                    // Something wrong happened during reload. If a cache exists, use it. Otherwise,
                    // we'll just use the src as the URI and hope that the browser resolves the situation.
                    if (cachedDep == null) {
                        console.warn(
                            "Failed to load caching dependency. Falling back to browser..."
                        );
                        return dependency.src;
                    }
                }

            // At this point, cachedDep contains either the new data or the old one if
            // retrieval failed. There is, however, a "possibly null or undefined" linter
            // problem here, so the extra ternary operator is there to silence it.

            return cachedDep
                ? toBase64URL(
                      cachedDep.data,
                      dependency.type === "script"
                          ? "application/javascript"
                          : "text/css"
                  )
                : dependency.src;
        } else {
            return dependency.src;
        }
    }
}
