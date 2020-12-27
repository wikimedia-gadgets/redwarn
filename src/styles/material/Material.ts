import MaterialAlertDialog from "./ui/MaterialAlertDialog";
import Style from "../Style";
import MaterialPreInitializationHooks from "./hooks/MaterialPreInitializationHooks";
import { MaterialStyleStorage } from "./storage/MaterialStyleStorage";
import MaterialInputDialog from "./ui/MaterialInputDialog";
import MaterialSelectionDialog from "./ui/MaterialSelectionDialog";

const MaterialStyle: Style = {
    name: "material",
    version: "1.0.0",

    meta: {
        "en-US": {
            displayName: "Material",
            author: ["The RedWarn Contributors", "Google, Inc."],
            // \u2014 is an emdash
            description:
                "RedWarn's classic look-and-feel \u2014 an implementation of Google's Material Design.",

            homepage: "https://en.wikipedia.org/wiki/WP:RW",
            repository: "https://gitlab.com/redwarn/redwarn-web",
            issues: "https://gitlab.com/redwarn/redwarn-web/-/issues",
        },
    },
    dependencies: [
        {
            // Material Icons
            type: "style",
            id: "material-icons",
            // Original: "https://fonts.googleapis.com/icon?family=Material+Icons"
            src: "https://redwarn.toolforge.org/cdn/css/materialicons.css",
        },
        {
            type: "style",
            id: "mdc-styles",
            src:
                "https://redwarn-lite.wmcloud.org/static/styles/material-components-web@8.0.0.tooltip.min.css",
        },
        {
            type: "style",
            id: "mdc-tooltip-styles",
            src:
                "https://redwarn-lite.wmcloud.org/static/styles/material-components-web@8.0.0.min.css",
        },
        {
            type: "style",
            id: "roboto",
            src:
                "https://tools-static.wmflabs.org/fontcdn/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese",
        },
    ],

    storage: new MaterialStyleStorage(),

    classMap: {
        rwAlertDialog: MaterialAlertDialog,
        rwInputDialog: MaterialInputDialog,
        rwSelectionDialog: MaterialSelectionDialog,
    },

    hooks: {
        preinit: [MaterialPreInitializationHooks],
    },
};

export default MaterialStyle;
