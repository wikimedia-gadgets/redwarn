import i18next from "i18next";
import { RW_LINK_SUMMARY, RW_WIKIS_TAGGABLE } from "rww/data/RedWarnConstants";
import RedWarnStore from "rww/data/RedWarnStore";
import { getMaterialStorage } from "rww/styles/material/storage/MaterialStyleStorage";
import redirect from "rww/util/redirect";
import Revision from "./Revision";
import WikipediaURL from "./URL";
import AjaxSettings = JQuery.AjaxSettings;
import Api = mw.Api;

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

    static async goToLatestRevision(page: string): Promise<void> {
        const revisions = await this.api.get({
            action: "query",
            prop: "revisions",
            titles: mw.util.wikiUrlencode(page),
            rvslots: "*",
            rvprop: ["ids"],
            rvlimit: 1,
        });

        const latestRevisionId = revisions.query.pages[0].revisions[0].revid;
        const parentRevisionId = revisions.query.pages[0].revisions[0].parentid;

        redirect(WikipediaURL.getDiffUrl(latestRevisionId, parentRevisionId));
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
        this.api = new mw.Api({
            parameters: { formatversion: 2 },
            ajax: {
                headers: {
                    "Api-User-Agent": i18next.t("common:redwarn.userAgent"),
                },
            },
        });
        RedWarnStore.APIStore.username = mw.user.getName();
        await this.getGroups();
        RedWarnStore.APIStore.emailEnabled =
            (
                await this.get({
                    action: "query",
                    meta: "userinfo",
                    uiprop: "email",
                    format: "json",
                })
            ).query.userinfo.emailauthenticated != null;
    }
}

export interface APIStore {
    groups: string[];
    username: string;
    emailEnabled: boolean;
}

export const EmptyAPIStore: APIStore = {
    groups: [],
    username: "",
    emailEnabled: false,
};
