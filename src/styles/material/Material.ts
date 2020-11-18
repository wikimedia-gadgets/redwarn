import MaterialAlertDialog from "./ui/MaterialAlertDialog";
import Style from "../Style";
import MaterialPreInitializationHooks from "./hooks/MaterialPreInitializationHooks";
import { MaterialStyleStorage } from "./storage/MaterialStyleStorage";

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
            repository: "https://gitlab.com/redwarn/redwarn-dev",
            issues: "https://gitlab.com/redwarn/redwarn-dev/-/issues",
        },
    },
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
            type: "style",
            id: "mdc-styles",
            src:
                "https://unpkg.com/material-components-web@7.0.0/dist/material-components-web.min.css",
        },
    ],

    storage: new MaterialStyleStorage(),

    classMap: {
        rwDialog: MaterialAlertDialog,
    },

    hooks: {
        preinit: [MaterialPreInitializationHooks],
    },
};

export default MaterialStyle;
