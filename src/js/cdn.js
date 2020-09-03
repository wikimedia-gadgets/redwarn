// Note to my fellow developers: JSDoc can save lives if TypeScript is not available.
//
// CDN code is bodge, but since RedWarn Lite is slated for deprecation, might as well
// not really put much effort into it.
//
// Why not use `IDB` on `unpkg` to make life easier? "Privacy concerns". Yeah.
// Privacy, my rear end. - CA

var rwCDNManager = {
    homepage: "https://redwarn-lite.wmcloud.org",
    stores: {
        html: "html_cache"
    }
};

/**
 * Creates an IndexedDB connection and assigns it to `rwCDNManager.database`
 * @param recurse {number} Executes everything if the number is less than 10. Otherwise, gives up.
 * @returns {Promise<boolean>} Whether the CDN manager was initialized or not.
 */
rwCDNManager.init = async (recurse = 0) => {
    if (!window.indexedDB) {
        rw.visuals.toast.show("Your browser does not support IndexedDB. Please use a more modern browser.");
        return false;
    }

    const db = await new Promise(async (resolve, reject) => {
        const request = indexedDB.open("rw_cdn_cache", 1);
        /** @param event {{oldVersion: number, target: IDBRequest}} **/
        request.onupgradeneeded = function (event) {
            if (event.oldVersion < 1) { // First run.
                const db = event.target.result;

                /* HTML Cache */
                const htmlCacheStore =
                    db.createObjectStore(rwCDNManager.stores.html, {keyPath: "filename"});
                htmlCacheStore.createIndex("content", "content", { unique: false });
            }
            // If we're going to make schema changes, we'll put them here as upgrades.
        };
        request.onerror = reject;
        request.onsuccess = () => {
            resolve(request.result);
        };
    })
        .catch((e) => {
            console.error(e);
            return false;
        });

    if (db == null || !db) {
        console.error("Failure to connect to IDB.");
        if (recurse < 10) {
            console.log(`Attempting to reconnect. Try ${recurse + 1} of 10.`);
            return await rwCDNManager.init(recurse + 1);
        } else {
            console.error("Failed to get an IDB connection after 10 tries. Giving up...");
            return false;
        }
    }

    console.log("Successful IndexedDB access.");
    rwCDNManager.database = {
        idb: db, // As much as possible, let's not use this.
        /**
         * Get an item on the database, on the given store.
         *
         * @param storeName {string} The name of the store. Get this from `rwCDNManager.stores`.
         * @param key {string} The key of the item to get.
         * @returns {Promise<any>} The requested object. Undefined if the key does not exist.
         **/
        get: (storeName, key) => {
            if (storeName == null || key == null) {
                console.log("Bad arguments when adding to IDB.");
                return (async () => false)();
            }

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], "readwrite");
                transaction.onerror = reject;
                const store = transaction.objectStore(storeName);

                /** @param event {{target: IDBRequest }} **/
                store.get(key).onsuccess = (event) => {
                    console.dir(event.target);
                    resolve(event.target.result);
                };
            });
        },
        /**
         * Add an item to the database, on the given store.
         *
         * @param storeName {string} The name of the store. Get this from `rwCDNManager.stores`.
         * @param items {Record<string, any>[]|Record<string, any>} The items to add.
         * @returns {Promise<boolean>} Whether the items were added.
         **/
        add: (storeName, items) => {
            if (storeName == null || items == null) {
                console.log("Bad arguments when adding to IDB.");
                return (async () => false)();
            }

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], "readwrite");

                transaction.oncomplete = () => resolve(true);
                transaction.onerror = reject;

                const store = transaction.objectStore(storeName);
                if (Array.isArray(items))
                    items.forEach(i => {
                        store.add(i);
                    })
                else {
                    store.add(items);
                }
            });
        },
        /**
         * Removes an item from the database, on the given store.
         *
         * @param storeName {string} The name of the store. Get this from `rwCDNManager.stores`.
         * @param keys {string[]|string} The keys of items to remove.
         * @returns {Promise<boolean>} Whether the items were removed.
         **/
        remove: (storeName, keys) => {
            if (storeName == null || keys == null) {
                console.log("Bad arguments when removing from IDB.");
                return (async () => false)();
            }

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], "readwrite");

                transaction.oncomplete = () => resolve(true);
                transaction.onerror = reject;

                const store = transaction.objectStore(storeName);
                if (Array.isArray(keys))
                    keys.forEach(i => {
                        store.delete(i);
                    })
                else {
                    store.delete(keys);
                }
            });
        },
        /**
         * Replaces an item on the database, on the given store.
         *
         * @param storeName {string} The name of the store. Get this from `rwCDNManager.stores`.
         * @param key {null|string} The key of the item to replace.
         * @param newObject {any} The new object.
         * @returns {Promise<boolean>}  Whether the items were replaced.
         **/
        put: async (storeName, key, newObject) => {
            // Why use IDB.put when you can just do this.
            // Efficiency, probably. But having to compare objects just to change
            // one value is inefficient. So we'll just take it the old-fashioned way.
            if (key != null && await rwCDNManager.database.get(storeName, key) !== undefined)
                await rwCDNManager.database.remove(storeName, key);
            return await rwCDNManager.database.add(storeName, newObject);
        }
    }

    return true;
}

/**
 * Parses the provided HTML and replaces the argument syntax with the given arguments.
 *
 * TL;DR: { foo: "bar" } on "<!-- rw-arg:foo -->" == "bar"
 * @param html {string} The HTML to be parsed.
 * @param arguments {Record<string, any>} The replacement values.
 * @returns {string} The parsed HTML.
 */
rwCDNManager.parseHTML = (html, arguments) => {
    if (arguments == null || Object.keys(arguments).length === 0) return html;

    let newHTML = html;
    for (var [i, v] of Object.entries(arguments)) {
        newHTML = newHTML.replace(
            new RegExp(`<!-- rw-arg:${i} -->`, "g"),
            v
        );
    }
    return newHTML;
}

/**
 * Gets a page from the CDN and stores it in cache.
 *
 * @param htmlName {string} The name of the HTML file to get from the backend.
 * @param arguments {undefined|any[]} The arguments to be used to fill up parts of the HTML file.
 * @param options {undefined|any} The options to be used in making the request.
 */
rwCDNManager.fetchHTML = async (htmlName, arguments, options) => {
    let htmlPull;
    do {
        try {
            htmlPull =
                await (await fetch(`${rwCDNManager.homepage}/static/html/${htmlName}.html`, options))
                    .text();

            await rwCDNManager.database.put(
                rwCDNManager.stores.html, htmlName,
                { filename: htmlName, content: htmlPull }
            );
        } catch (e) {
            console.error(e);
            // TODO Create a fallback dialog here eventually.
            return "<h2 color=\"red\">An error occurred while trying to get the HTML for the page.</h2>"
        }
    } while (htmlPull == null);

    return rwCDNManager.parseHTML(htmlPull, arguments);
}

/**
 * Gets a page from the cache. If the HTML is uncached, this will return undefined.
 *
 * @param htmlName {string} The name of the HTML file to get from the backend.
 * @param arguments {undefined|any[]} The arguments to be used to fill up parts of the HTML file.
 */
rwCDNManager.getHTML = async (htmlName, arguments) => {
    let htmlPull = null;
    do {
        try {
            htmlPull = (await rwCDNManager.database.get(
                rwCDNManager.stores.html,
                htmlName
            )).content;
        } catch (e) {
            // TODO Create a fallback dialog here eventually.
            return "<h2 color=\"red\">An error occurred while trying to get the HTML for the page.</h2>"
        }
    } while (htmlPull === null);

    return rwCDNManager.parseHTML(htmlPull, arguments);
}