// only enabled when debug mode is on
rw.debugMenu = {
    "init": () => {
        if (rw.config.debugMode != "enable") {
            // Only init if debug mode specifically enabled
            rw.debugMenu = undefined;
            rw.debugMode = false;
            return;
        }
        // Add debug icons
        rw.topIcons.icons.push({
            "title": "Debug Menu",
            "shortTitle": "Debug",
            "icon": "bug_report", // material icon
            "callback": () => {
                try {
                    rw.debugMenu.open();
                } catch (error) {
                    alert("The debug menu isn't available in production mode");
                }
            }, // when clicked
            "showsOnlyOnUserPages": false,
            "showsOnUneditablePages": true,
            "colorModifier": "red", // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
            "enabled": true // to show in main screen or more options screen
        },

            (
                mw.config.get("wgRelevantPageName") != "User_talk:Sandbox_for_user_warnings" ? // if we are not on the sandbox
                    {
                        "title": "Go to User Warning sandbox",
                        "shortTitle": "UWSB",
                        "icon": "person_outline", // material icon
                        "callback": () => {
                            redirect("https://en.wikipedia.org/wiki/User_talk:Sandbox_for_user_warnings");
                        }, // when clicked
                        "showsOnlyOnUserPages": false,
                        "showsOnUneditablePages": true,
                        "colorModifier": "blue", // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
                        "enabled": true // to show in main screen or more options screen
                    } :

                    // Clear user warning sandbox button if we are on it
                    {
                        "title": "Rollback my edits here (rollback perms needed)",
                        "shortTitle": "CLRSB",
                        "icon": "auto_delete", // material icon
                        "callback": () => {
                            rw.ui.loadDialog.show("Reverting your edits...");
                            $.post(rw.wikiAPI, {
                                "action": "rollback",
                                "format": "json",
                                "token": rw.info.rollbackToken,
                                "title": mw.config.get("wgRelevantPageName"),
                                "summary": "Reset Sandbox", // summary sign here
                                "user": rw.info.getUsername(), // rollback user
                                "tags": ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                            }).done(dt => {
                                // THESE CALLBACKS ARE NO INTERCHANGABLE!
                                // We done. Check for errors, then callback appropriately
                                if (!dt.rollback) {
                                    // Error occured or other issue
                                    console.error(dt);
                                    rw.ui.loadDialog.close();
                                    rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. Your rollback has not been applied.");
                                } else {
                                    // Success!
                                    window.location.reload();
                                }
                            });
                        }, // when clicked
                        "showsOnlyOnUserPages": false,
                        "showsOnUneditablePages": true,
                        "colorModifier": "orange", // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
                        "enabled": true // to show in main screen or more options screen
                    }
            )
        );

        const idbConnectionRequest = indexedDB.open("redwarnDebug", 1);

        idbConnectionRequest.onupgradeneeded = function (event) {
            const db = idbConnectionRequest.result;
            db.createObjectStore("xhrLogs", { keyPath: "id", autoIncrement: true });
        };

        new Promise((res, rej) => {
            idbConnectionRequest.onsuccess = res;
            idbConnectionRequest.onerror = rej;
        }).catch((error) => {
            console.error(`${lang.load_err} ${lang.load_err_report}`, error);
            mw.notify(load_err);
            return;
        }).then(() => {
            rw.debugMenu.db = idbConnectionRequest.result;
            rw.debugMenu.hookXHR();
        });

    },

    "dbLog": (obj) => {
        console.log(obj);
        const transaction = rw.debugMenu.db.transaction("xhrLogs", "readwrite");
        transaction.objectStore("xhrLogs").add(obj);
        transaction.onerror = console.error;
    },

    "open": () => {
        dialogEngine.create(`[[[[include debugMenu.html]]]]`).showModal();
    },

    "hookXHR": () => {
        $(document).ajaxSend((e, xhr, options) => {
            const logObject = {};
            logObject.options = JSON.parse(JSON.stringify(options));
            logObject.timestamp = e.timeStamp;
            const err = new Error();
            logObject.stacktrace = err.stack;
            rw.debugMenu.dbLog(logObject, e.timeStamp)
        });
    }
};