import ProtectionEntry from "rww/mediawiki/protection/ProtectionEntry";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import { MediaWikiAPI } from "../core/API";
import type { Page } from "rww/mediawiki";

export class ProtectionManager {
    static async getProtectionInformation(
        page: Page,
        _flaggedRevs?: boolean
    ): Promise<ProtectionEntry[]> {
        const entries: ProtectionEntry[] = [];
        const preload: {
            protection?: Record<string, any>;
            flaggedrevs?: Record<string, any>;
        } = {};

        // Run requests in parallel.
        await Promise.all([
            (async () => {
                preload["protection"] = await MediaWikiAPI.get({
                    action: "query",
                    prop: "info",
                    ...page.getAPIIdentifier(),
                    inprop: "protection"
                });
            })(),
            (async () => {
                if (
                    (RedWarnWikiConfiguration.c?.protection?.flaggedrevs ??
                        false) &&
                    _flaggedRevs !== false
                )
                    preload["flaggedrevs"] = await MediaWikiAPI.get({
                        action: "query",
                        list: "logevents",
                        letype: "stable",
                        letitle: page.title.getPrefixedText(),
                        // Get as much stable config changes in case this page has magically been
                        // moved 500 times.
                        lelimit: 500
                    });
            })()
        ]);

        // Get page protection information from MediaWiki.
        const protectionInfoRequest = preload["protection"];

        const pageInfo = <Record<string, any>>(
            Object.values(protectionInfoRequest["query"]["pages"])[0]
        );

        // Fill in missing data if unavailable.
        if (page.title == null) page.title = new mw.Title(pageInfo["title"]);
        if (page.pageID == null) page.pageID = pageInfo["pageid"];

        if (
            pageInfo["protection"] != null &&
            pageInfo["protection"].length > 0
        ) {
            for (const entry of pageInfo["protection"]) {
                entries.push(
                    Object.assign(entry, {
                        expiry:
                            entry.expiry === "infinity"
                                ? entry.expiry
                                : new Date(entry.expiry)
                    })
                );
            }
        }

        if (
            (RedWarnWikiConfiguration.c?.protection?.flaggedrevs ?? false) &&
            _flaggedRevs !== false
        ) {
            // Get FlaggedRevs log entries (only if FlaggedRevs enabled and not explicitly turned off).
            // Latest log entry always determines current state.

            const stableLogRequest = preload["flaggedrevs"];

            const stableInfo = <Record<string, any>>(
                stableLogRequest["query"]["logevents"]
            );
            // In chronological order.
            for (const event of Object.values(stableInfo)) {
                if (event.action === "reset") {
                    // No more FlaggedRevs protection.
                    break;
                } else if (event.action === "modify") {
                    // FlaggedRevs config changed. Assume this is latest.
                    const level = event.params["autoreview"];
                    // Expiry comes in format "YYYMMDDHHMMSS", need to convert to ISO-8601.
                    const expiry = event.params["expiry"].replace(
                        /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g,
                        "$1-$2-$3T$4:$5:$6Z"
                    );

                    entries.push({
                        type: "_flaggedrevs",
                        level: level,
                        expiry:
                            expiry === "infinity" ? expiry : new Date(expiry)
                    });
                    break;
                } else if (event.action === "config") {
                    // `override` is `1` if the stable version is used as the display version.
                    const level = (<string>(
                        Object.values(event.params).find((v: string) =>
                            v.startsWith("autoreview=")
                        )
                    )).slice(11);
                    const expiry = (<string>(
                        Object.values(event.params).find((v: string) =>
                            v.startsWith("expiry=")
                        )
                    )).slice(7);
                    entries.push({
                        type: "_flaggedrevs",
                        level: level,
                        expiry:
                            expiry === "infinity" ? expiry : new Date(expiry)
                    });
                    break;
                }
                // Move to next log event if action === "move_stable" (page moved).
            }
        }

        return entries;
    }
}
