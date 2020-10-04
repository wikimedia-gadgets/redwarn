import Chance from "chance";
import { Dependency } from "../ui/Dependencies";
import { APIStore, EmptyAPIStore } from "../wikipedia/API";

export abstract class StyleStorage {}

export class RedWarnStorage {

    // Initializations
    public dependencies: Dependency[] = [];

    // Worker objects
    public random: Chance.Chance = new Chance();

    // API
    public APIStore: APIStore = EmptyAPIStore;

    // Wiki automated config
    public wikiBase: string = mw.config.get("wgServer");
    public wikiIndex: string = mw.config.get("wgServer") + mw.config.get("wgScript");
    public wikiAPI = `${mw.config.get("wgServer") + mw.config.get("wgScriptPath")}/api.php`;
    public wikiID: string = mw.config.get("wgWikiID");

    public styleStorage : StyleStorage = null;
    public windowFocused = false;

    public registerDependency(dependency : Dependency) : void {
        this.dependencies.push(dependency);
    }

}

// We're exposing the RedWarn storage for the ones who want to tinker with
// RedWarn's global storage variables. In reality, we don't have to do this,
// but it's more of a courtesy to users who want to experiment a bit more.
declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        RedWarnStore: RedWarnStorage;
    }
}

window.addEventListener("blur", () => {
    window.RedWarnStore.windowFocused = false;
});

window.addEventListener("focus", () => {
    window.RedWarnStore.windowFocused = true;
});

export default window.RedWarnStore;