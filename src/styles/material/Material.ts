import MaterialDialog from "./ui/MaterialDialog";
import {RWUIDialog, RWUIDialogID} from "../../ui/RWUIDialog";
import Style from "../Style";
import RedWarnStore from "../../data/RedWarnStore";
import MaterialPreInitializationHooks from "./hooks/MaterialPreInitializationHooks";

export class MaterialStyleStorage {

    // Caches
    dialogTracker : Map<RWUIDialogID, RWUIDialog> = new Map<RWUIDialogID, RWUIDialog>();

}

const MaterialStyle : Style = {
    name: "material",
    version: "1.0.0",

    meta: {
        "en-US": {
            displayName: "Material",
            author: ["The RedWarn Contributors", "Google, Inc."],
            description: "RedWarn's classic look-and-feel \u2014 an implementation of Google's Material Design.",

            homepage: "https://en.wikipedia.org/wiki/WP:RW",
            repository: "https://gitlab.com/redwarn/redwarn-dev",
            issues: "https://gitlab.com/redwarn/redwarn-dev/-/issues"
        }
    },
    dependencies: [
        {
            // Material Icons
            type: "style",
            id: "material-icons",
            // Original: "https://fonts.googleapis.com/icon?family=Material+Icons"
            src:
                "https://redwarn-lite.wmcloud.org/static/styles/Material-Icons.css",
        }
    ],

    storage: new MaterialStyleStorage(),

    classMap: {
        rwDialog: MaterialDialog.constructor
    },

    hooks: {
        "preinit": [
            MaterialPreInitializationHooks
        ]
    }
};

export function getMaterialStorage() : MaterialStyleStorage {
    return (RedWarnStore.styleStorage as MaterialStyleStorage);
}

export default MaterialStyle;