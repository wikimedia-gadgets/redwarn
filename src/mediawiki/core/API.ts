import i18next from "i18next";
import Group from "rww/mediawiki/core/Group";
import { ClientUser, Page } from "rww/mediawiki";
import RedWarnLocalDB from "rww/data/database/RedWarnLocalDB";
import Log from "rww/data/RedWarnLog";
import {
    GenericAPIError,
    GenericAPIErrorData,
    PageMissingError,
    SpecializedMediaWikiErrors
} from "rww/errors/MediaWikiErrors";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import { ApiQueryAllMessagesParams } from "types-mediawiki/api_params";
import { RWAggregateError } from "rww/errors/RWError";
import AjaxSettings = JQuery.AjaxSettings;
import Api = mw.Api;

export class MediaWikiAPI {
    static groups: Map<string, Group>;
    static api: Api;

    static async get(
        parameters: Record<string, any>,
        ajaxOptions?: AjaxSettings
    ): Promise<JQueryXHR> {
        const finalParameters = Object.assign(
            {
                format: "json",
                formatversion: 2
            },
            parameters
        );
        for (const key of Object.keys(finalParameters)) {
            if (Array.isArray(finalParameters[key]))
                finalParameters[key] = finalParameters[key].join("|");
        }

        return MediaWikiAPI.api
            .get(finalParameters, ajaxOptions)
            .catch((code, result) => {
                Log.warn(
                    `Error occured while running MediaWiki API get call. Make sure this is handled!`,
                    code
                );
                throw result;
            });
    }

    static async post(
        parameters: Record<string, any>,
        ajaxOptions?: AjaxSettings
    ): Promise<JQueryXHR> {
        const finalParameters = Object.assign({}, parameters);
        for (const key of Object.keys(finalParameters)) {
            if (Array.isArray(finalParameters[key]))
                finalParameters[key] = finalParameters[key].join("|");
        }

        return MediaWikiAPI.api
            .post(finalParameters, ajaxOptions)
            .catch((code, result) => {
                Log.warn(
                    `Error occured while running MediaWiki API get call. Make sure this is handled!`,
                    code
                );
                throw result;
            });
    }

    static async postWithEditToken(
        parameters: Record<string, any>,
        ajaxOptions?: AjaxSettings
    ): Promise<JQueryXHR> {
        return MediaWikiAPI.api
            .postWithEditToken(parameters, ajaxOptions)
            .catch((code, result) => {
                Log.warn(
                    `Error occured while running MediaWiki API get call. Make sure this is handled!`,
                    code
                );
                throw result;
            });
    }

    static async getMessage(
        messages: string[],
        ajaxOptions?: ApiQueryAllMessagesParams
    ): Promise<Record<string, any>> {
        try {
            return await MediaWikiAPI.api.getMessages(messages, ajaxOptions);
        } catch (error) {
            Log.warn(
                `Error occured while running MediaWiki API getMessage call. Make sure this is handled!`,
                error
            );
            throw error;
        }
    }

    /**
     * Initialize the MediaWiki API Manager.
     */
    static async init(): Promise<void> {
        // Create the API interface.
        MediaWikiAPI.api = new mw.Api({
            parameters: {
                // Always serve JSON-format responses.
                // https://www.mediawiki.org/wiki/API:Data_formats#Output
                format: "json",
                // Use the latest MediaWiki formatversion available (and supported by us).
                // https://www.mediawiki.org/wiki/API:Data_formats#JSON_parameters
                formatversion: 2,
                // The format of the "errors" field.
                // https://www.mediawiki.org/wiki/API:Errors_and_warnings#Error_formats
                errorformat: "plaintext"
            },
            ajax: {
                headers: {
                    // Set a RedWarn user agent for RedWarn requests.
                    // https://www.mediawiki.org/wiki/API:Etiquette#The_User-Agent_header
                    "Api-User-Agent": i18next.t("common:redwarn.userAgent")
                }
            }
        });

        // Preload configurations
        await Promise.all([
            ClientUser.i.redwarnConfigPage
                .getLatestRevision({
                    forceRefresh: false
                })
                .catch((e) => {
                    if (!(e instanceof PageMissingError)) throw e;
                    return null;
                }),
            RedWarnWikiConfiguration.preloadWikiConfiguration()
        ]);

        await Promise.all([
            // Initialize the current user.
            ClientUser.i.init(),
            RedWarnWikiConfiguration.loadWikiConfiguration(),
            MediaWikiAPI.loadGroupNames()
        ]);
    }

    static async loadGroupNames(): Promise<Map<string, Group>> {
        const loadGroups = async () => {
            const userGroupMemberTitles = await MediaWikiAPI.get({
                action: "query",
                format: "json",
                meta: "allmessages",
                amenableparser: 1,
                amincludelocal: 1,
                amfilter: "-member",
                amprefix: "group-"
            });
            const userGroupPages = await MediaWikiAPI.get({
                action: "query",
                format: "json",
                meta: "allmessages",
                amenableparser: 1,
                amincludelocal: 1,
                amprefix: "grouppage-"
            });

            const groups = new Map<string, Group>();
            for (const message of userGroupMemberTitles["query"][
                "allmessages"
            ]) {
                const groupNameExec = /^group-(.+)-member$/g.exec(
                    message["name"]
                );
                if (groupNameExec == null) continue;
                const groupName = groupNameExec[1];
                if (!groups.has(groupName))
                    groups.set(groupName, {
                        name: groupName,
                        displayName: message["content"]
                    });
                else groups.get(groupName).displayName = message["content"];
            }

            for (const message of userGroupPages["query"]["allmessages"]) {
                const groupNameExec = /^grouppage-(.+)$/g.exec(message["name"]);
                if (groupNameExec == null) continue;
                const groupName = groupNameExec[1];
                if (!groups.has(groupName))
                    groups.set(groupName, {
                        name: groupName,
                        page: Page.fromTitle(
                            message["content"].replace(/{{ns:(.+?)}}/gi, "$1:")
                        )
                    });
                else
                    groups.get(groupName).page = Page.fromTitle(
                        message["content"].replace(/{{ns:(.+?)}}/gi, "$1:")
                    );
            }

            try {
                await RedWarnLocalDB.i.groupCache.runTransaction(
                    "readwrite",
                    (transaction) => {
                        Log.trace("Saving groups to internal cache...");
                        const store = transaction.objectStore("groupCache");
                        for (const group of groups.values()) store.put(group);
                    }
                );
                RedWarnLocalDB.i.cacheTracker.put({
                    id: "groupCache",
                    timestamp: Date.now()
                });
            } catch (e) {
                Log.error("Failed to save to group cache. Skipping...", e);
            }

            return groups;
        };

        if (!MediaWikiAPI.groups) {
            const groupCacheTimestamp = await RedWarnLocalDB.i.cacheTracker.get(
                "groupCache"
            );
            const groups = (await RedWarnLocalDB.i.groupCache.getAll()).reduce(
                (p, n) => {
                    p[n.name] = n;
                    return p;
                },
                <{ [key: string]: Group }>{}
            );

            if (
                groupCacheTimestamp == null ||
                groupCacheTimestamp.timestamp < Date.now() - 604800000
            ) {
                return (MediaWikiAPI.groups = await loadGroups());
            } else {
                return (MediaWikiAPI.groups = new Map<string, Group>(
                    Object.entries(groups)
                ));
            }
        } else {
            return MediaWikiAPI.groups;
        }
    }

    /**
     * Get errors from a MediaWiki response.
     *
     * @param apiResponse The response from the MediaWiki Action API.
     * @param data Additional data for the error.
     */
    public static error(
        apiResponse: Record<string, any>,
        data?: GenericAPIErrorData
    ): GenericAPIError | RWAggregateError {
        if (!apiResponse["errors"] && !!apiResponse["error"]) {
            // Legacy format. This should be avoided.
            return new GenericAPIError(apiResponse["error"]);
        } else if (!!apiResponse["errors"]) {
            // New error format.
            const errors = [];

            for (const error of apiResponse["errors"]) {
                errors.push(
                    SpecializedMediaWikiErrors[error["code"]] != null
                        ? new SpecializedMediaWikiErrors[error["code"]](data)
                        : new GenericAPIError(error)
                );
            }

            if (errors.length === 1) return errors[0];

            return new RWAggregateError(errors);
        } else {
            // No error occurred???
            return new GenericAPIError("Unknown MediaWiki API error.");
        }
    }
}
