import redirect from "../util/redirect";
import Revision from "./Revision";
import RedWarnStore from "../data/RedWarnStore";
import { RW_LINK_SUMMARY, RW_WIKIS_TAGGABLE } from "../data/RedWarnConstants";
import WikipediaURL from "./URL";
import AjaxSettings = JQuery.AjaxSettings;
import Api = mw.Api;
import User from "./User";

export default class WikipediaAPI {
    static api: Api;

    static get(
        parameters: Record<string, any>,
        ajaxOptions?: AjaxSettings
    ): JQueryPromise<JQueryXHR> {
        return this.api.get(parameters, ajaxOptions);
    }

    static postWithEditToken(
        parameters: Record<string, any>,
        ajaxOptions?: AjaxSettings
    ): JQueryPromise<JQueryXHR> {
        return this.api.postWithEditToken(parameters, ajaxOptions);
    }

    /*
    static sendAPIRequest(
        query: string,
        method: "get" | "post" = "get",
        settings = {}
    ): Promise<any> {
        return new Promise((res, rej) => {
            $.ajax(
                RedWarnStore.wikiAPI + query,
                Object.assign(
                    {
                        dataType: "json",
                        method: method.toUpperCase(),
                    },
                    settings
                )
            )
                .done(res)
                .fail((_, __, error) => rej(error));
        });
    }
    */

    /*
    static async getRollbackToken(): Promise<string> {
        if (this.hasPermission("rollbacker")) {
            const token = await this.sendAPIRequest(
                "?action=query&meta=tokens&type=rollback&format=json"
            );
            RedWarnStore.APIStore.rollbackToken = token;
            return token;
        }
    }
    */

    /**
     * Edits a page.
     *
     * @throws {Error}
     * @param params {Object} Edit parameters.
     * @param params.page {string} The page to edit.
     * @param params.text {string} The new page content.
     * @param params.summary {string} The edit summary.
     */
    static async editPage(params: {
        page: string;
        text: string;
        summary?: string;
    }): Promise<void> {
        await WikipediaAPI.postWithEditToken({
            action: "edit",
            format: "json",
            title: params.page,
            summary: `${params.summary ?? ""} ${RW_LINK_SUMMARY}`,
            text: params.text,
            // Only add tags for supported wikis.
            tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
                ? "RedWarn"
                : null,
        });
    }

    /**
     * Gets the latest revision of a page.
     */
    static async getLatestRevision(page: string): Promise<string | null> {
        const revisionRequest = await WikipediaAPI.get({
            action: "query",
            prop: "revisions",
            titles: page,
            rvslots: "*",
            rvprop: ["content"],
        });

        if (!revisionRequest.query.pages[0].missing) {
            // If page isn't missing (i.e. it exists).
            return (
                revisionRequest.query.pages[0].revisions[0].slots.main
                    .content ??
                revisionRequest.query.pages[0].revisions[0].slots.main["*"] ??
                null // This would be __bad__.
            );
        }
        return null;
    }

    /**
     * Checks if the given revision ID is the latest revision of the page.
     * @returns The latest revision
     */
    static async isLatestRevision(
        revision: Revision,
        noRedirect = false
    ): Promise<Revision> {
        const revisions = await this.api.get({
            action: "query",
            prop: "revisions",
            titles: mw.util.wikiUrlencode(revision.page),
            rvslots: "*",
            rvprop: ["ids", "user"],
            rvlimit: 1,
            formatversion: 2,
        });

        console.log(revisions);

        const latestRevisionId = revisions.query.pages[0].revisions[0].revid;
        const parentRevisionId = revisions.query.pages[0].revisions[0].parentid;
        const latestUsername = revisions.query.pages[0].revisions[0].user;
        if (latestRevisionId === revision.revid) {
            return {
                user: new User(latestUsername),
                revid: latestRevisionId,
                parentid: parentRevisionId,
            };
        } else {
            if (noRedirect) {
                throw `Not latest revision! Latest revision (ID ${latestRevisionId}) by [[User:${latestUsername}]]`;
            }
            // TODO think about how to fix this later
            // if (RedWarnStore.dialogTracker.size > 0) {
            //     return; // Do not redirect if a dialog is open.
            // }

            // TODO: **config** (rw.config.rwLatestRevisionOption === "newtab")
            // TODO page load notices
            redirect(
                WikipediaURL.getDiffUrl(latestRevisionId, parentRevisionId)
            );
        }
    }

    static async goToLatestRevision(page: string): Promise<void> {
        const revisions = await this.api.get({
            action: "query",
            prop: "revisions",
            titles: mw.util.wikiUrlencode(page),
            rvslots: "*",
            rvprop: ["ids"],
            rvlimit: 1,
            formatversion: 2,
        });

        const latestRevisionId = revisions.query.pages[0].revisions[0].revid;
        const parentRevisionId = revisions.query.pages[0].revisions[0].parentid;

        redirect(WikipediaURL.getDiffUrl(latestRevisionId, parentRevisionId));
    }

    // TODO documentation for whatever this function is
    static async latestRevisionNotByUser(
        name: string,
        username: string
    ): Promise<Revision> {
        const revisions = await this.api.get({
            action: "query",
            prop: "revisions",
            titles: mw.util.wikiUrlencode(name),
            rvslots: "*",
            rvprop: ["ids", "user", "content", "comment"],
            rvexcludeuser: username,
            formatversion: 2,
        });

        const foundRevision = revisions?.query?.pages?.[0]?.revisions?.[0];
        if (foundRevision == null) {
            // Probably no other edits. Redirect to history page and show the notice
            // TODO page load notices
            redirect(WikipediaURL.getHistoryUrl(name));
            return;
        }

        const latestContent = foundRevision.slots.main.content;
        return {
            content: latestContent,
            summary: foundRevision.comment,
            revid: foundRevision.revid,
            parentid: foundRevision.parentid,
            user: new User(foundRevision.user),
        };
    }

    /**
     * Checks if the user has a given permission.
     * @param permission
     */
    static hasGroup(permission: string): boolean {
        const g = RedWarnStore.APIStore.groups;
        let hasGroup = g.includes(permission);

        // Administrators override all feature restrictions.
        if (!hasGroup) {
            hasGroup = g.includes("sysop");
        }

        // Due to 2 types of the `confirmed` group, `confirmed` and `autoconfirmed`,
        // we have to check both.
        if (permission === "confirmed" && !hasGroup) {
            hasGroup = g.includes("autoconfirmed");
        }

        return hasGroup;
    }

    /**
     * Gets the user's groups.
     */
    static async getGroups(): Promise<string[]> {
        if (!RedWarnStore.APIStore.groups) {
            RedWarnStore.APIStore.groups = await mw.user.getGroups();
        }
        return RedWarnStore.APIStore.groups;
    }

    /**
     * Initialize the MediaWiki API Manager.
     */
    static async init(): Promise<void> {
        this.api = new mw.Api();
        RedWarnStore.APIStore.username = mw.user.getName();
        await this.getGroups();
    }
}

export interface APIStore {
    rollbackToken: string;
    groups: string[];
    username: string;
}

export const EmptyAPIStore: APIStore = {
    rollbackToken: "",
    groups: [],
    username: "",
};
