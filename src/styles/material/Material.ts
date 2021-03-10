import { MDCDialog } from "@material/dialog";
import { MDCRipple } from "@material/ripple";
import { RWUIDialog } from "rww/ui/elements/RWUIDialog";
import Style from "rww/styles/Style";
import MaterialPreInitializationHooks from "./hooks/MaterialPreInitializationHooks";
import {
    getMaterialStorage,
    MaterialStyleStorage,
} from "./data/MaterialStyleStorage";
import MaterialAlertDialog from "./ui/MaterialAlertDialog";
import MaterialInputDialog from "./ui/MaterialInputDialog";
import MaterialSelectionDialog from "./ui/MaterialSelectionDialog";
import MaterialWarnDialog from "rww/styles/material/ui/MaterialWarnDialog";
import MaterialToast from "./ui/MaterialToast";

import "./css/globals.css";
import MaterialIFrameDialog from "rww/styles/material/ui/MaterialIFrameDialog";

const MaterialStyle: Style = {
    name: "material",
    version: "1.0.0",

    meta: {
        "en-US": {
            displayName: "Material",
            author: ["The RedWarn Development Team", "Google, Inc."],
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
            cache: {
                duration: 1209600000, // 14 days
            },
        },
        {
            type: "style",
            id: "mdc-styles",
            src:
                "https://redwarn-lite.wmcloud.org/static/styles/material-components-web@10.0.0.min.css",
            cache: {
                duration: 1209600000, // 14 days
            },
        },
        {
            type: "style",
            id: "mdc-tooltip-styles",
            src:
                "https://redwarn-lite.wmcloud.org/static/styles/material-components-web@10.0.0.tooltip.min.css",
            cache: {
                duration: 1209600000, // 14 days
            },
        },
        {
            type: "style",
            id: "roboto",
            src:
                "https://tools-static.wmflabs.org/fontcdn/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese",
            cache: {
                duration: 1209600000, // 14 days
            },
        },
    ],

    storage: new MaterialStyleStorage(),

    classMap: {
        rwAlertDialog: MaterialAlertDialog,
        rwInputDialog: MaterialInputDialog,
        rwSelectionDialog: MaterialSelectionDialog,
        rwWarnDialog: MaterialWarnDialog,
        rwIFrameDialog: MaterialIFrameDialog,
        rwToast: MaterialToast,
    },

    hooks: {
        preInit: [MaterialPreInitializationHooks],
        postInit: [
            () => {
                new MaterialWarnDialog({}).show();
            },
        ],
    },
};

export default MaterialStyle;

export function upgradeMaterialDialogButtons(dialog: RWUIDialog): void {
    $(dialog.element)
        .find("button")
        .each((_, el) => new MDCRipple(el).initialize());
}

type WritableKeys<T> = {
    [P in keyof T]-?: (<U>() => U extends { [Q in P]: T[P] } ? 1 : 2) extends <
        U
    >() => U extends { -readonly [Q in P]: T[P] } ? 1 : 2
        ? P
        : never;
}[keyof T]; // https://stackoverflow.com/a/49579497/12573645

export function upgradeMaterialDialog(
    dialog: RWUIDialog,
    options?: Map<WritableKeys<MDCDialog>, any>
): MDCDialog {
    upgradeMaterialDialogButtons(dialog);

    const mdcDialog = new MDCDialog(dialog.element);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    options?.forEach((v, k) => (mdcDialog[k] = v));

    mdcDialog.initialize();
    mdcDialog.open();

    return mdcDialog;
}

export function registerMaterialDialog(dialog: RWUIDialog): void {
    getMaterialStorage().dialogTracker.set(dialog.id, dialog);
    document.body.appendChild(dialog.render());
}
