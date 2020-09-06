// Note to my fellow developers: JSDoc can save lives if TypeScript is not available.
//
// CDN code is bodge, but since RedWarn Lite is slated for deprecation, might as well
// not really put much effort into it.
//
// Why not use `IDB` on `unpkg` to make life easier? "Privacy concerns". Yeah.
// Privacy, my rear end. - CA

var rwStaticHTMLManager = {
    homepage: "https://redwarn.chlod.local",
    stores: {
        html: "html_cache"
    },
    html: {
        // Place all required HTML files here.
        "adminReport": null,
        "adminReportSelector": null,
        "confirmDialog": null,
        "hanUI": null,
        "loadingSpinner": null,
        "multipleAction": null,
        "newMsg": null,
        "pageIcons": null,
        "pendingReviewReason": null,
        "preferences": null,
        "quickTemplateEditTemplate": null,
        "quickTemplateNewPack": null,
        "quickTemplateSelectPack": null,
        "quickTemplateSelectTemplate": null,
        "quickTemplateSelectTemplateEdit": null,
        "quickTemplateSubmit": null,
        "recentChanges": null,
        "recentPageSelect": null,
        "requestPageProtect": null,
        "rollbackCurrentRevFormatting": null,
        "rollbackReason": null,
        "sendFeedback": null,
        "speedyDeletionp1": null,
        "uaaReport": null,
        "warnUserDialog": null
    }
};

/**
 * Creates an IndexedDB connection and assigns it to `rwStaticHTMLManager.database`
 * @param recurse {number} Executes everything if the number is less than 10. Otherwise, gives up.
 * @returns {Promise<boolean>} Whether the CDN manager was initialized or not.
 */
rwStaticHTMLManager.init = async (recurse = 0) => {
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
                    db.createObjectStore(rwStaticHTMLManager.stores.html, {keyPath: "filename"});
                htmlCacheStore.createIndex("content", "content", { unique: false });
                htmlCacheStore.createIndex("time", "time", { unique: false });
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
            return await rwStaticHTMLManager.init(recurse + 1);
        } else {
            console.error("Failed to get an IDB connection after 10 tries. Giving up...");
            return false;
        }
    }

    console.log("Successful IndexedDB access.");
    rwStaticHTMLManager.database = {
        idb: db, // As much as possible, let's not use this.
        /**
         * Get an item on the database, on the given store.
         *
         * @param storeName {string} The name of the store. Get this from `rwStaticHTMLManager.stores`.
         * @param key {string} The key of the item to get.
         * @returns {Promise<any>} The requested object. Undefined if the key does not exist.
         **/
        get: (storeName, key) => {
            if (storeName == null || key == null) {
                console.log("Bad arguments when getting from IDB.");
                return (async () => false)();
            }

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], "readonly");
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
         * Gets all items on the given store.
         *
         * @param storeName {string} The name of the store. Get this from `rwStaticHTMLManager.stores`.
         * @returns {Promise<any>} All items in the store.
         **/
        getAll: (storeName) => {
            if (storeName == null) {
                console.log("Bad arguments when getting all from IDB.");
                return (async () => false)();
            }

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], "readonly");
                transaction.onerror = reject;
                const store = transaction.objectStore(storeName);

                /** @param event {{target: IDBRequest }} **/
                store.getAll().onsuccess = (event) => {
                    console.dir(event.target);
                    resolve(event.target.result);
                };
            });
        },
        /**
         * Add an item to the database, on the given store.
         *
         * @param storeName {string} The name of the store. Get this from `rwStaticHTMLManager.stores`.
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
         * @param storeName {string} The name of the store. Get this from `rwStaticHTMLManager.stores`.
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
         * @param storeName {string} The name of the store. Get this from `rwStaticHTMLManager.stores`.
         * @param key {null|string} The key of the item to replace.
         * @param newObject {any} The new object.
         * @returns {Promise<boolean>}  Whether the items were replaced.
         **/
        put: async (storeName, key, newObject) => {
            // Why use IDB.put when you can just do this.
            // Efficiency, probably. But having to compare objects just to change
            // one value is inefficient. So we'll just take it the old-fashioned way.
            if (key != null && await rwStaticHTMLManager.database.get(storeName, key) !== undefined)
                await rwStaticHTMLManager.database.remove(storeName, key);
            return await rwStaticHTMLManager.database.add(storeName, newObject);
        }
    }

    if (!await rwStaticHTMLManager.getAllHTML())
        return false;

    // more things here in the future.

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
rwStaticHTMLManager.parseHTML = (html, arguments) => {
    if (arguments == null || Object.keys(arguments).length === 0) return html;

    let newHTML = html;
    for (var [i, v] of Object.entries(arguments)) {
        newHTML = newHTML.replace(
            new RegExp(`(<!--|/\\*) rw-arg:${i} (-->|\\*/)`, "g"),
            v
        );
    }
    return newHTML;
}

/**
 * Gets a page from the CDN and stores it in cache.
 *
 * @param htmlName {string} The name of the HTML file to get from the backend.
 * @param arguments {Record<string, any>} The arguments to be used to fill up parts of the HTML file.
 * @param options {any} The options to be used in making the request.
 */
rwStaticHTMLManager.fetchHTML = async (htmlName, arguments = {}, options = {}) => {
    console.log("Grabbing " + htmlName);
    let htmlPull;
    do {
        try {
            htmlPull =
                await (await fetch(`${rwStaticHTMLManager.homepage}/static/html/${htmlName}.html`, options))
                    .text();

            await rwStaticHTMLManager.database.put(
                rwStaticHTMLManager.stores.html, htmlName,
                { filename: htmlName, content: htmlPull, time: Date.now() }
            );
        } catch (e) {
            console.error(e);
            // TODO Create a fallback dialog here eventually.
            return "<h2 color=\"red\">An error occurred while trying to get the HTML for the page.</h2>"
        }
    } while (htmlPull == null);

    return rwStaticHTMLManager.parseHTML(htmlPull, arguments);
}

/**
 * Called at initialization. This grabs all HTML files in the HTML store and loads it
 * into the `rwCDNManger.html` object. If a file is unavailable, it will grab the file
 * from the RedWarn CDN.
 *
 * @returns {Promise<boolean>} Whether all HTML files were account for or not.
 */
rwStaticHTMLManager.getAllHTML = async() => {
    try {
        const idbCache = await rwStaticHTMLManager.database.getAll(rwStaticHTMLManager.stores.html);

        const idbHTMLFiles = {};
        for (const cachedHTML of idbCache) {
            idbHTMLFiles[cachedHTML.filename] = cachedHTML;
        }

        // Why the promises? Simple. This loads EVERY HTML FILE at the same time.
        // Files that need to be redownloaded are redownloaded, and files that remain
        // the same get loaded within the same time. Even the header checks happen
        // at the same time.
        //
        // This drastically cut down load time from 3.1 seconds to 0.2 seconds.
        const htmlFiles = Object.keys(rwStaticHTMLManager.html);
        const requests = [];
        for (const filename of htmlFiles) {
            requests.push(new Promise(async (resolve, reject) => {
                if (idbHTMLFiles[filename] === undefined) {
                    rwStaticHTMLManager.html[filename] = await rwStaticHTMLManager.fetchHTML(filename);
                } else {
                    // Check HTML age.
                    const lastModHeader =
                        (await fetch(`${rwStaticHTMLManager.homepage}/static/html/${filename}.html`,
                            {method: 'HEAD'})).headers.get("Last-Modified");

                    if (idbHTMLFiles[filename].time < (new Date(lastModHeader)).getTime())
                        rwStaticHTMLManager.html[filename] = await rwStaticHTMLManager.fetchHTML(filename);
                    else
                        rwStaticHTMLManager.html[filename] = idbHTMLFiles[filename].content;
                }
                resolve();
            }));
        }
        await Promise.all(requests);

        return Object.values(rwStaticHTMLManager.html).reduce((p, n) => p && n != null, true);
    } catch (e) {
        mw.notify("Failed to get required HTML files from the RedWarn CDN.");
        return false;
    }
}

/**
 * Gets a page from the cache. If the HTML is uncached, this will return undefined.
 *
 * @param htmlName {string} The name of the HTML file to get from the backend.
 * @param arguments {Record<string, any>} The arguments to be used to fill up parts of the HTML file.
 */
rwStaticHTMLManager.getHTML = (htmlName, arguments = {}) => {
    return rwStaticHTMLManager.parseHTML(rwStaticHTMLManager.html[htmlName], arguments);
}