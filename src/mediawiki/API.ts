import i18next from "i18next";
import { ClientUser } from "rww/mediawiki/MediaWiki";
import AjaxSettings = JQuery.AjaxSettings;
import Api = mw.Api;

export class MediaWikiAPI {
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

    /**
     * Initialize the MediaWiki API Manager.
     */
    static async init(): Promise<void> {
        // Create the API interface.
        this.api = new mw.Api({
            parameters: { formatversion: 2 },
            ajax: {
                headers: {
                    "Api-User-Agent": i18next.t("common:redwarn.userAgent"),
                },
            },
        });

        // Initialize the current user.
        await ClientUser.i.init();
    }
}
