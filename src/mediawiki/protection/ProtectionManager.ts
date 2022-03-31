import ProtectionEntry from "app/mediawiki/protection/ProtectionEntry";
import RedWarnWikiConfiguration from "app/config/wiki/RedWarnWikiConfiguration";
import { MediaWikiAPI } from "../core/API";
import {
    isProtectionRequestTarget,
    Page,
    ProtectionRequestTarget,
} from "app/mediawiki";
import ProtectionRequest, {
    ProtectionDuration,
} from "app/mediawiki/protection/ProtectionRequest";
import i18next from "i18next";
import RedWarnUI from "app/ui/RedWarnUI";
import { capitalize } from "app/util";

export class ProtectionManager {
    private static protectionEntryCache: Map<
        Page & { flaggedRevs: boolean },
        ProtectionEntry[]
    > = new Map();

    /**
     * Get a page's protection information.
     *
     * @param page The page to check.
     * @param _flaggedRevs Whether or not to check for FlaggedRevs as well (makes an extra HTTP request)
     * @param fromCache Whether or not to get data from the cache instead.
     */
    static async getProtectionInformation(
        page: Page,
        _flaggedRevs?: boolean,
        fromCache = false
    ): Promise<ProtectionEntry[]> {
        const cacheKey = Object.assign(page, {
            flaggedRevs: _flaggedRevs !== false,
        });

        if (fromCache && ProtectionManager.protectionEntryCache.has(cacheKey))
            return ProtectionManager.protectionEntryCache.get(cacheKey);

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
                    inprop: "protection",
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
                        lelimit: 500,
                    });
            })(),
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
                                : new Date(entry.expiry),
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

                    if (expiry !== "infinity" && new Date(expiry) > new Date())
                        entries.push({
                            type: "_flaggedrevs",
                            level: level,
                            expiry:
                                expiry === "infinity"
                                    ? expiry
                                    : new Date(expiry),
                        });
                    break;
                } else if (event.action === "config") {
                    // `override` is `1` if the stable version is used as the display version.
                    const level =
                        event.params["autoreview"] ??
                        (<string>(
                            Object.values(event.params).find((v: string) =>
                                v.startsWith("autoreview=")
                            )
                        )).slice(11);
                    const expiry = (
                        event.params["expiry"] ??
                        (<string>(
                            Object.values(event.params).find((v: string) =>
                                v.startsWith("expiry=")
                            )
                        )).slice(7)
                    ).replace(
                        /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g,
                        "$1-$2-$3T$4:$5:$6Z"
                    );

                    if (expiry !== "infinity" && new Date(expiry) > new Date())
                        entries.push({
                            type: "_flaggedrevs",
                            level: level,
                            expiry:
                                expiry === "infinity"
                                    ? expiry
                                    : new Date(expiry),
                        });
                    break;
                }
                // Move to next log event if action === "move_stable" (page moved).
            }
        }

        ProtectionManager.protectionEntryCache.set(cacheKey, entries);

        return entries;
    }

    /**
     * Get the protection reasons for this wiki. This may come from the configuration
     * for this wiki or MediaWiki:Protect-dropdown, if unavailable.
     */
    static async getProtectionReasons(
        page?: Page
    ): Promise<Record<string, string[]>> {
        let configReasons =
            RedWarnWikiConfiguration.c.protection?.reasons ?? {};

        if (Array.isArray(configReasons))
            configReasons = { Uncategorized: configReasons };

        for (const [k, v] of Object.entries(configReasons)) {
            // Remove category if it has no contents.
            if (v.length === 0) delete configReasons[k];
        }

        if (Object.values(configReasons).length === 0) {
            // No reasons detected. Fallback to MediaWiki.
            const messageRequest = await MediaWikiAPI.getMessage(
                ["Protect-dropdown"],
                {
                    amenableparser: true,
                    amtitle: page?.title.getPrefixedText() ?? undefined,
                }
            );

            const message = messageRequest["Protect-dropdown"].trim();
            // Parse the message.
            let header = "Uncategorized";
            for (const line of message.split("\n")) {
                if (/^\*(?!\*)\s*/.test(line)) {
                    header = line.slice(1).trim();
                } else if (/^\*{2}\s*/.test(line)) {
                    // Only add it in if the bullet actual contains something.
                    const trimmed = line.slice(2).trim();
                    if (trimmed.length > 0) {
                        if (configReasons[header] == null)
                            configReasons[header] = [];

                        configReasons[header].push(trimmed);
                    }
                }
                // else, an unrecognizable line. Dispose.
            }
        }

        return configReasons;
    }

    static buildRequest(
        request: ProtectionRequest,
        target: ProtectionRequestTarget
    ) {
        // `!== "prepend"` in order to handle `null` cases.
        const durationText =
            request.duration === 0
                ? RedWarnWikiConfiguration.c.protection?.duration?.temporary
                : RedWarnWikiConfiguration.c.protection?.duration?.indefinite;
        return (
            (target.method !== "prepend"
                ? "\n".repeat((target.extraLines ?? 0) + 2)
                : "") +
            target.template
                .replace(/{{{title}}}/g, request.page.title.getPrefixedText())
                .replace(/{{{duration}}}/g, durationText)
                .replace(/{{{level}}}/g, request.level.name)
                // TODO i18n: RTL support
                .replace(
                    /{{{duration\+level}}}/g,
                    capitalize(
                        request.level.id == null
                            ? RedWarnWikiConfiguration.c.protection.unprotect
                                  .name
                            : capitalize(
                                  `${durationText} ${request.level.name}`
                              )
                    )
                )
                // TODO i18n: RTL support
                .replace(
                    /{{{reason}}}/g,
                    request.reason.length > 0
                        ? request.additionalInformation.length > 0
                            ? `${request.reason}. ${request.additionalInformation}`
                            : `${request.reason}.`
                        : request.additionalInformation
                ) +
            (target.method === "prepend"
                ? "\n".repeat((target.extraLines ?? 0) + 2)
                : "")
        );
    }

    /**
     * @returns {Promise<Page|false>} The page where the request was made. `false` if no protection requested.
     */
    static async requestProtection(
        request: ProtectionRequest
    ): Promise<Page | false> {
        if (request == null) return false;
        let targetPage: Page;
        if (
            isProtectionRequestTarget(
                RedWarnWikiConfiguration.c.protection?.requests
            )
        ) {
            // Single-target page.
            const target = RedWarnWikiConfiguration.c.protection.requests;
            targetPage = Page.fromTitle(target.page);
            targetPage.edit(ProtectionManager.buildRequest(request, target), {
                section: target.section ?? undefined,
                mode: target.method ?? "append",
                comment: i18next.t("mediawiki:summaries.protection", {
                    title: request.page.title.getPrefixedText(),
                }),
            });
        } else {
            // Identify if increase/decrease in level.
            let sourceKey: number, targetKey: number;
            let sourceDuration: ProtectionDuration;
            const currentLevel =
                await ProtectionManager.getProtectionInformation(
                    request.page,
                    true,
                    true
                );
            const currentEditLevel = currentLevel.filter(
                (v) =>
                    (v.type === "edit" && v.source == null) ||
                    v.type === "_flaggedrevs"
            );

            let isIncrease = null;
            if (currentEditLevel.length === 0) {
                // Likely unprotected
                isIncrease = true;
            } else if (request.level.id == null) {
                // Likely asking for unprotection
                isIncrease = false;
            } else {
                RedWarnWikiConfiguration.c.protection.levels.forEach(
                    (level, key) => {
                        for (const currentLevel of currentEditLevel) {
                            if (level.id === currentLevel.level) {
                                sourceKey = key;
                                sourceDuration =
                                    currentLevel.expiry === "infinity"
                                        ? ProtectionDuration.Indefinite
                                        : ProtectionDuration.Temporary;
                            }
                            if (level.id === request.level.id) {
                                targetKey = key;
                            }
                        }
                    }
                );

                if (sourceKey != null && targetKey != null) {
                    isIncrease =
                        sourceKey < targetKey ||
                        (sourceKey === targetKey &&
                            sourceDuration < request.duration);
                } else {
                    // Cannot determine if increase or decrease. Request user input.
                    const dialogResult = await new RedWarnUI.AlertDialog({
                        content: `${i18next.t(
                            "ui:protectionRequest.retarget.text"
                        )}`,
                        actions: [
                            {
                                data: "decrease",
                                text: i18next.t(
                                    "ui:protectionRequest.retarget.decrease"
                                ),
                            },
                            {
                                data: "increase",
                                text: i18next.t(
                                    "ui:protectionRequest.retarget.increase"
                                ),
                            },
                        ],
                    }).show();
                    if (dialogResult == null)
                        // Cancel.
                        return;
                    isIncrease = dialogResult === "increase";
                }
            }

            const target = isIncrease
                ? RedWarnWikiConfiguration.c.protection.requests.increase
                : RedWarnWikiConfiguration.c.protection.requests.decrease;
            targetPage = Page.fromTitle(target.page);

            targetPage.edit(ProtectionManager.buildRequest(request, target), {
                section: target.section ?? undefined,
                mode: target.method ?? "append",
                comment: i18next.t("mediawiki:summaries.protection", {
                    title: request.page.title.getPrefixedText(),
                }),
            });
        }
        return targetPage;
    }
}
