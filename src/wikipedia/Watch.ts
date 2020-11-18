import WikipediaAPI from "./API";
import RedWarnStore from "../data/RedWarnStore";
import redirect from "../util/redirect";

/**
 * Responsible for watching page changes.
 *
 * This class is available in every loaded page of Wikipedia, therefore it can
 * simply be used as a static class.
 *
 * @deprecated Not yet usable as the watching interface is not yet developed.
 */
export default class Watch {
    static active = false;
    static timecheck: number;
    static lastRevID: number;

    static async toggle(): Promise<void> {
        if (!this.active) {
            if (Notification.permission !== "granted") {
                await Notification.requestPermission();
            }

            $("#rwSpyIcon").css("color", "green");
            // TODO: **toasts**
            // rw.toast.show("Alerts Enabled - please keep this tab open.");

            this.active = true;
            const r = await WikipediaAPI.api.get({
                action: "query",
                prop: "revisions",
                titles: mw.util.wikiUrlencode(
                    mw.config.get("wgRelevantPageName")
                ),
                rvslots: "*",
                rvprop: ["ids"],
            });

            this.lastRevID = r.query.pages[0].revisions[0].revid;
            this.timecheck = window.setInterval(() => {
                WikipediaAPI.api
                    .get({
                        action: "query",
                        prop: "revisions",
                        titles: mw.util.wikiUrlencode(
                            mw.config.get("wgRelevantPageName")
                        ),
                        rvslots: "*",
                        rvprop: ["ids"],
                    })
                    .then((r2: any) => {
                        if (
                            this.lastRevID !==
                            r2.query.pages[0].revisions[0].revid
                        ) {
                            // New Revision! Redirect.
                            clearInterval(this.timecheck); // clear updates
                            const latestRId =
                                r2.query.pages[0].revisions[0].revid;
                            const parentRId =
                                r2.query.pages[0].revisions[0].parentid;

                            if (RedWarnStore.windowFocused) {
                                // Redirect and don't do anything else
                                redirect(
                                    RedWarnStore.wikiIndex +
                                        "?title=" +
                                        encodeURIComponent(
                                            mw.config.get("wgRelevantPageName")
                                        ) +
                                        "&diff=" +
                                        latestRId +
                                        "&oldid=" +
                                        parentRId +
                                        "&diffmode=source#watchLatestRedirect"
                                );
                            } else {
                                // Push notification
                                document.title =
                                    "**New Edit!** " + document.title; // Add alert to title
                                if (Notification.permission !== "granted") {
                                    Notification.requestPermission();
                                } else {
                                    const notification = new Notification(
                                        "New Change to " +
                                            mw.config.get("wgRelevantPageName"),
                                        {
                                            icon:
                                                "https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png",
                                            body: "Click here to view",
                                        }
                                    );
                                    notification.onclick = function () {
                                        window.focus(); // When focused, we'll redirect anyways
                                        this.close(); // focus our tab and close notif
                                    };

                                    window.onfocus = function () {
                                        // Redirect on focus
                                        redirect(
                                            RedWarnStore.wikiIndex +
                                                "?title=" +
                                                encodeURIComponent(
                                                    mw.config.get(
                                                        "wgRelevantPageName"
                                                    )
                                                ) +
                                                "&diff=" +
                                                latestRId +
                                                "&oldid=" +
                                                parentRId +
                                                "&diffmode=source#watchLatestRedirect"
                                        );
                                    };
                                }
                            }
                        }
                    });
            }, 5000);
        } else {
            clearInterval(this.timecheck);
            $("#rwSpyIcon").css("color", "");
            // TODO: **toasts**
            // rw.toast.show("Alerts Disabled");
            this.active = false;
        }
    }
}
