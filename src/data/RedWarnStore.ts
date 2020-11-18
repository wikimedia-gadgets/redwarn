import Chance from "chance";
import MessageHandler from "../event/MessageHandler";
import { Dependency } from "../ui/Dependencies";
import { APIStore, EmptyAPIStore } from "../wikipedia/API";

export abstract class StyleStorage {}

export default class RedWarnStore {
    // Initializations
    public static dependencies: Dependency[] = [];

    // Worker objects
    public static random: Chance.Chance = new Chance();

    // API
    public static APIStore: APIStore = EmptyAPIStore;

    // Wiki automated config

    public static messageHandler: MessageHandler = new MessageHandler();
    public static wikiBase: string = mw.config.get("wgServer");
    public static wikiIndex: string =
        mw.config.get("wgServer") + mw.config.get("wgScript");
    public static wikiAPI = `${
        mw.config.get("wgServer") + mw.config.get("wgScriptPath")
    }/api.php`;
    public static wikiID: string = mw.config.get("wgWikiID");

    public static styleStorage: StyleStorage = null;
    public static windowFocused = false;

    public static registerDependency(dependency: Dependency): void {
        this.dependencies.push(dependency);
    }

    public static initializeStore(): void {
        window.RedWarnStore = this;
    }
}

// We're exposing the RedWarn storage for the ones who want to tinker with
// RedWarn's global storage variables. In reality, we don't have to do this,
// but it's more of a courtesy to users who want to experiment a bit more.
declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        RedWarnStore: RedWarnStore;
    }
}

window.addEventListener("blur", () => {
    RedWarnStore.windowFocused = false;
});

window.addEventListener("focus", () => {
    RedWarnStore.windowFocused = true;
});
