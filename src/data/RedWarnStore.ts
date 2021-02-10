// noinspection JSDeprecatedSymbols
import MessageHandler from "rww/event/MessageHandler";
import { StyleStorage } from "rww/styles/Style";
import { Dependency } from "rww/ui/Dependencies";

// noinspection JSDeprecatedSymbols
export default class RedWarnStore {
    // Initializations
    public static dependencies: Dependency[] = [];

    // Wiki automated config

    /**
     * @deprecated Only for backwards compatibility
     * !!! DO NOT USE FOR NEW FEATURES !!!
     */
    public static messageHandler: MessageHandler;

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

    public static styleStorage: StyleStorage = null;
    public static windowFocused = false;

    public static registerDependency(dependency: Dependency): void {
        this.dependencies.push(dependency);
    }

    public static initializeStore(): void {
        this.messageHandler = new MessageHandler();
        this.wikiArticlePath = mw.config.get("wgArticlePath");
        this.wikiBase = mw.config.get("wgServer");
        this.wikiIndex = mw.config.get("wgServer") + mw.config.get("wgScript");
        this.wikiAPI = `${
            mw.config.get("wgServer") + mw.config.get("wgScriptPath")
        }/api.php`;
        this.wikiID = mw.config.get("wgWikiID");

        window.RedWarnStore = this;
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
