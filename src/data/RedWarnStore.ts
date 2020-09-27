import MaterialDialog from "../ui/MaterialDialog";
import Chance from "chance";
import { Dependency } from "../ui/Dependencies";
import { APIStore, EmptyAPIStore } from "../wikipedia/API";

export interface RedWarnStorage {
    // Initializations
    dependencies: Dependency[];

    // Worker objects
    random: Chance.Chance;

    // Caches
    dialogTracker: Map<string, MaterialDialog>;

    // API
    APIStore: APIStore;

    // Wiki automated config
    wikiBase: string;
    wikiIndex: string;
    wikiAPI: string;
    wikiID: string;

    windowFocused: boolean;
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

// Set the constants here.
// WARNING: SET ONLY THE CONSTANTS HERE.
window.RedWarnStore = {
    dialogTracker: new Map<string, MaterialDialog>(),
    random: new Chance(),
    dependencies: [
        {
            // Material Icons
            type: "style",
            id: "material-icons",
            // Original: "https://fonts.googleapis.com/icon?family=Material+Icons"
            src:
                "https://redwarn-lite.wmcloud.org/static/styles/Material-Icons.css",
        },
        {
            // Dialog Polyfill (styles) (GoogleChrome/dialog-polyfill)
            type: "style",
            id: "dialogPolyfillCss",
            // Original: "https://unpkg.com/dialog-polyfill@0.4.7/dialog-polyfill.css"
            src:
                "https://redwarn-lite.wmcloud.org/static/styles/dialog-polyfill.css",
        },
        {
            // Dialog Polyfill (script) (GoogleChrome/dialog-polyfill)
            type: "script",
            id: "dialogPolyfillJs",
            // Original: "https://unpkg.com/dialog-polyfill@0.4.7/dialog-polyfill.js"
            src:
                "https://redwarn-lite.wmcloud.org/static/scripts/dialog-polyfill.js",
        },
    ],
    APIStore: EmptyAPIStore,

    // Configuration based on MediaWiki data.

    /** MediaWiki base URL (i.e. `//en.wikipedia.org`) */
    wikiBase: mw.config.get("wgServer"),
    /** MediaWiki `index.php` (i.e. `//en.wikipedia.org/w/index.php`) */
    wikiIndex: mw.config.get("wgServer") + mw.config.get("wgScript"),
    /** MediaWiki API path  (i.e. `//en.wikipedia.org/w/api.php`) */
    wikiAPI: `${mw.config.get("wgServer") + mw.config.get("wgScriptPath")}/api.php`,
    /** MediaWiki Wiki ID  (i.e. `enwiki`) */
    wikiID: mw.config.get("wgWikiID"),

    windowFocused: false,
};

window.addEventListener("blur", () => {
    window.RedWarnStore.windowFocused = false;
});

window.addEventListener("focus", () => {
    window.RedWarnStore.windowFocused = true;
});

export default window.RedWarnStore;
