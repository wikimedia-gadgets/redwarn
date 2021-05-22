import semanticDifference from "rww/util/semanticDifference";
import i18next from "i18next";

const mwChecks = {
    version: () => {
        return semanticDifference(mw.config.get("wgVersion"), "1.30.0") !== -1;
    },
    user: () => {
        return mw.user.getName() !== null;
    },
};

type MediaWikiCheck = keyof typeof mwChecks;

/**
 * The MediaWiki class is responsible for checks and actions against the MediaWiki
 * JavaScript interface, the primary interface allowing wiki-to-userscript interaction.
 */
export default class MediaWiki {
    /**
     * Run all MediaWiki checks and return whichever fails.
     */
    static runMWChecks(): MediaWikiCheck[] {
        const failedChecks: MediaWikiCheck[] = [];

        for (const check of Object.keys(mwChecks)) {
            if (!mwChecks[check as MediaWikiCheck]())
                failedChecks.push(check as MediaWikiCheck);
        }

        return failedChecks;
    }

    /**
     * Load in every MediaWiki dependency RedWarn needs.
     */
    static async loadDependencies() {
        await mw.loader.using("mediawiki.language.months");
    }

    /**
     * Run all MediaWiki checks and show notifications if checks are failed.
     * @returns Whether or not checks passed.
     */
    static mwCheck(): boolean {
        const checks = MediaWiki.runMWChecks();

        if (checks.length > 0) {
            const notification = document.createElement("div");
            notification.innerText = i18next.t("common:redwarn.init.error");

            const list = document.createElement("ul");
            for (const failedCheck of checks) {
                const listItem = document.createElement("li");
                listItem.innerText = i18next.t(
                    `common:redwarn.init.mwChecks.${failedCheck}`
                );
                list.appendChild(listItem);
            }
            notification.appendChild(list);

            mw.notify(notification);

            return false;
        } else return true;
    }
}

// To avoid circular imports, all imports MUST come explicitly from this
// index file and this index file alone.

export * from "./User";
export * from "./ClientUser";
export * from "./Gender";
export * from "./Page";
export * from "./Revision";
export * from "./Rollback";
export * from "./URL";
export * from "./WarningLevel";
export * from "./Warnings";
export * from "./Watch";
export * from "./API";
export * from "./RevertSpeedup";
