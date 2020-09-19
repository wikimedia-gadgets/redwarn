import MaterialDialog from "../ui/MaterialDialog";
import Chance from "chance";
import {Dependency} from "../ui/Dependencies";

export interface RedWarnStorage {

    random: Chance.Chance;
    dialogTracker: Record<string, MaterialDialog>;
    dependencies: Dependency[];

}

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        RedWarn : RedWarnStorage;
    }
}

// Set the constants here.
// WARNING: SET ONLY THE CONSTANTS HERE.
window.RedWarn = {
    dialogTracker: {},
    random: new Chance(),
    dependencies: [
        {
            // Material Icons
            type: "style",
            id: "material-icons",
            // Original: "https://fonts.googleapis.com/icon?family=Material+Icons"
            src: "https://redwarn-lite.wmcloud.org/static/styles/Material-Icons.css"
        },
        {
            // Dialog Polyfill (styles) (GoogleChrome/dialog-polyfill)
            type: "style",
            id: "dialogPolyfillCss",
            // Original: "https://unpkg.com/dialog-polyfill@0.4.7/dialog-polyfill.css"
            src: "https://redwarn-lite.wmcloud.org/static/styles/dialog-polyfill.css"
        },
        {
            // Dialog Polyfill (script) (GoogleChrome/dialog-polyfill)
            type: "script",
            id: "dialogPolyfillJs",
            // Original: "https://unpkg.com/dialog-polyfill@0.4.7/dialog-polyfill.js"
            src: "https://redwarn-lite.wmcloud.org/static/scripts/dialog-polyfill.js"
        }
    ]
};

export default window.RedWarn;