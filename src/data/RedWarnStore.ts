import { StyleStorage } from "rww/styles/Style";
import { Dependency } from "rww/data/Dependencies";
import { NamedPage, Page } from "rww/mediawiki";

/**
 * <b>RedWarnStore</b> is for live, in-memory data that does not require persistence
 * or is rebuilt on every page load.
 *
 * If you wish to persistently save data,
 * use {@link RedWarnLocalDB} instead. If you wish to create or access a
 * constant value that can be loaded at any point, consider using {@link RedWarnConstants}
 * instead. If you want to generate data for debugging, use {@link Log}
 * instead.
 */
export default class RedWarnStore {
    public static readonly startTime = new Date();

    // Initializations
    public static dependencies: Dependency[] = [
        {
            // Material Icons
            type: "style",
            id: "material-icons",
            // Original: "https://fonts.googleapis.com/icon?family=Material+Icons"
            src: "https://redwarn.toolforge.org/cdn/css/materialicons.css",
            cache: {
                delayedReload: true,
                duration: 1209600000 // 14 days
            }
        }
    ];

    // //en.wikipedia.org
    public static wikiBase: string;
    // /wiki/$1
    public static wikiArticlePath: string;
    // //en.wikipedia.org/w/index.php
    public static wikiIndex: string;
    // //en.wikipedia.org/w/api.php
    public static wikiAPI: string;
    // "enwiki"
    public static wikiID: string;
    // URL: "https//en.wikipedia.org/static/images/project-logos/enwiki.png"
    // WARNING: Not calculated on page load. Must be assigned to be `Watch.ts`
    public static wikiLogo: URL;

    public static styleStorage: StyleStorage = null;
    public static windowFocused = false;

    public static currentPage: Page & NamedPage;

    public static registerDependency(dependency: Dependency): void {
        RedWarnStore.dependencies.push(dependency);
    }

    public static initializeStore(): void {
        RedWarnStore.wikiArticlePath = mw.config.get("wgArticlePath") as string;
        RedWarnStore.wikiBase = mw.config.get("wgServer") as string;
        RedWarnStore.wikiIndex =
            (mw.config.get("wgServer") as string) +
            (mw.config.get("wgScript") as string);
        RedWarnStore.wikiAPI = `${
            (mw.config.get("wgServer") as string) +
            (mw.config.get("wgScriptPath") as string)
        }/api.php`;
        RedWarnStore.wikiID = mw.config.get("wgWikiID") as string;
        RedWarnStore.currentPage = Page.fromIDAndTitle(
            mw.config.get("wgArticleId"),
            mw.config.get("wgPageName")
        );

        window.RedWarnStore = RedWarnStore;
    }

    static articlePath(target: string): string {
        return RedWarnStore.wikiArticlePath.replace(
            /\$1/g,
            mw.util.wikiUrlencode(target)
        );
    }
}

// We're exposing the RedWarn storage for the ones who want to tinker with
// RedWarn's global storage variables. In reality, we don't have to do this,
// but it's more of a courtesy to users who want to experiment a bit more.
declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        RedWarnStore: typeof RedWarnStore;
    }
}

window.addEventListener("blur", () => {
    RedWarnStore.windowFocused = false;
});

window.addEventListener("focus", () => {
    RedWarnStore.windowFocused = true;
});
