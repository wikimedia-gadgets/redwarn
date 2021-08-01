import MessageHandler from "rww/event/MessageHandler";
import { StyleStorage } from "rww/styles/Style";
import { Dependency } from "rww/data/Dependencies";

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
        RedWarnStore.dependencies.push(dependency);
    }

    public static initializeStore(): void {
        RedWarnStore.messageHandler = new MessageHandler();
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
