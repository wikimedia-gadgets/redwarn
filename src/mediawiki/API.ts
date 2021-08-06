import i18next from "i18next";
import Group from "rww/mediawiki/Group";
import { ClientUser } from "rww/mediawiki";
import RedWarnLocalDB from "rww/data/RedWarnLocalDB";
import Log from "rww/data/RedWarnLog";
import {
    GenericAPIError,
    SpecializedMediaWikiErrors,
} from "rww/errors/MediaWikiErrors";
import RedWarnWikiConfiguration from "rww/data/RedWarnWikiConfiguration";
import AjaxSettings = JQuery.AjaxSettings;
import Api = mw.Api;

export class MediaWikiAPI {
    static groups: Map<string, Group>;
    static api: Api;

    static async get(
        parameters: Record<string, any>,
        ajaxOptions?: AjaxSettings
    ): Promise<JQueryXHR> {
        try {
            const finalParameters = Object.assign({}, parameters);
            for (const key of Object.keys(finalParameters)) {
                if (Array.isArray(finalParameters[key]))
                    finalParameters[key] = finalParameters[key].join("|");
            }

            return await MediaWikiAPI.api.get(finalParameters, ajaxOptions);
        } catch (error) {
            Log.error(
                `Error occured while running MediaWiki API get call.`,
                error
            );
            throw error;
        }
    }

    static async post(
        parameters: Record<string, any>,
        ajaxOptions?: AjaxSettings
    ): Promise<JQueryXHR> {
        try {
            const finalParameters = Object.assign({}, parameters);
            for (const key of Object.keys(finalParameters)) {
                if (Array.isArray(finalParameters[key]))
                    finalParameters[key] = finalParameters[key].join("|");
            }

            return await MediaWikiAPI.api.post(finalParameters, ajaxOptions);
        } catch (error) {
            Log.error(
                `Error occured while running MediaWiki API get call.`,
                error
            );
            throw error;
        }
    }

    static async postWithEditToken(
        parameters: Record<string, any>,
        ajaxOptions?: AjaxSettings
    ): Promise<JQueryXHR> {
        try {
            return await MediaWikiAPI.api.postWithEditToken(
                parameters,
                ajaxOptions
            );
        } catch (error) {
            Log.error(
                `Error occured while running MediaWiki API postWithEditToken call.`,
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
                errorformat: "plaintext",
            },
            ajax: {
                headers: {
                    // Set a RedWarn user agent for RedWarn requests.
                    // https://www.mediawiki.org/wiki/API:Etiquette#The_User-Agent_header
                    "Api-User-Agent": i18next.t("common:redwarn.userAgent"),
                },
            },
        });

        // Preload configurations
        await Promise.all([
            ClientUser.i.redwarnConfigPage.getLatestRevision({
                forceRefresh: false,
            }),
            RedWarnWikiConfiguration.preloadWikiConfiguration(),
        ]);

        await Promise.all([
            // Initialize the current user.
            ClientUser.i.init(),
            RedWarnWikiConfiguration.loadWikiConfiguration(),
            MediaWikiAPI.loadGroupNames(),
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
                amprefix: "group-",
            });
            const userGroupPages = await MediaWikiAPI.get({
                action: "query",
                format: "json",
                meta: "allmessages",
                amenableparser: 1,
                amincludelocal: 1,
                amprefix: "grouppage-",
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
                        displayName: message["content"],
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
                        page: message["content"].replace(
                            /{{ns:project}}/gi,
                            "Project:"
                        ),
                    });
                else
                    groups.get(groupName).page = message["content"].replace(
                        /{{ns:project}}/gi,
                        "Project:"
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
                    timestamp: Date.now(),
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
     */
    public static error(
        apiResponse: Record<string, any>
    ): GenericAPIError | AggregateError {
        if (!apiResponse["errors"] && !!apiResponse["error"]) {
            // Legacy format. This should be avoided.
            return new GenericAPIError(apiResponse["error"]);
        } else if (!!apiResponse["errors"]) {
            // New error format.
            const errors = [];

            for (const error of apiResponse["errors"]) {
                errors.push(
                    SpecializedMediaWikiErrors[error["code"]] != null
                        ? new SpecializedMediaWikiErrors[error["code"]](error)
                        : new GenericAPIError(error)
                );
            }

            if (errors.length === 1) return errors[0];
            else return new AggregateError(errors);
        } else {
            // No error occurred???
            return new GenericAPIError("Unknown MediaWiki API error.");
        }
    }
}
