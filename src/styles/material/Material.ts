import { MDCDialog } from "@material/dialog";
import { MDCRipple } from "@material/ripple";
import { RWUIDialog } from "app/ui/elements/RWUIDialog";
import Style from "app/styles/Style";
import MaterialPreInitializationHooks from "./hooks/MaterialPreInitializationHooks";
import {
    getMaterialStorage,
    MaterialStyleStorage,
} from "./data/MaterialStyleStorage";
import MaterialAlertDialog from "./ui/MaterialAlertDialog";
import MaterialInputDialog from "./ui/MaterialInputDialog";
import MaterialSelectionDialog from "./ui/MaterialSelectionDialog";
import MaterialWarnDialog from "app/styles/material/ui/MaterialWarnDialog";
import MaterialToast from "./ui/MaterialToast";
import MaterialDiffIcons from "./ui/MaterialDiffIcons";
import MaterialIFrameDialog from "app/styles/material/ui/MaterialIFrameDialog";

import "./css/globals.css";
import MaterialPageIcons from "app/styles/material/ui/MaterialPageIcons";
import MaterialExtendedOptions from "app/styles/material/ui/MaterialExtendedOptions";
import MaterialProtectionRequestDialog from "app/styles/material/ui/MaterialProtectionRequestDialog";
import MaterialReportingDialog from "app/styles/material/ui/MaterialReportingDialog";
import promiseSplit from "app/util/promiseSplit";
import MaterialPreferences from "./ui/MaterialPreferences";
import MaterialPreferencesTab from "./ui/MaterialPreferencesTab";
import MaterialPreferencesItem from "./ui/MaterialPreferencesItem";

const MaterialStyle: Style = {
    name: "material",
    version: "1.0.0",

    meta: {
        "en-US": {
            displayName: "Material",
            author: ["The Ultraviolet Development Team (10nm)", "Google, Inc."],
            // \u2014 is an emdash
            description:
                // TODO: change this to something like "classic but improved/better"
                "Ultraviolet's default theme \u2014 the classic look-and-feel of RedWarn with several improvements. This is an implementation of Google's Material Design.",

            homepage: "https://en.wikipedia.org/wiki/WP:UV",
            repository: "https://gitlab.com/redwarn/redwarn-web",
            issues: "https://gitlab.com/redwarn/redwarn-web/-/issues",
        },
    },
    dependencies: [
        {
            type: "style",
            id: "mdc-styles",
            src: "https://tools-static.wmflabs.org/cdnjs/ajax/libs/material-components-web/12.0.0/material-components-web.min.css",
            cache: {
                delayedReload: true,
                duration: 1209600000, // 14 days
            },
        },
        {
            type: "style",
            id: "roboto",
            src: "https://tools-static.wmflabs.org/fontcdn/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese",
            cache: {
                delayedReload: true,
                duration: 1209600000, // 14 days
            },
        },
    ],

    storage: new MaterialStyleStorage(),

    classMap: {
        rwAlertDialog: MaterialAlertDialog,
        rwInputDialog: MaterialInputDialog,
        rwSelectionDialog: MaterialSelectionDialog,
        apparnDialog: MaterialWarnDialog,
        rwProtectionRequestDialog: MaterialProtectionRequestDialog,
        rwIFrameDialog: MaterialIFrameDialog,
        rwToast: MaterialToast,
        rwDiffIcons: MaterialDiffIcons,
        rwPageIcons: MaterialPageIcons,
        rwExtendedOptions: MaterialExtendedOptions,
        rwReportingDialog: MaterialReportingDialog,
        rwPreferences: MaterialPreferences,
        rwPreferencesTab: MaterialPreferencesTab,
        rwPreferencesItem: MaterialPreferencesItem,
    },

    hooks: {
        preInit: [MaterialPreInitializationHooks],
    },
};

export default MaterialStyle;

export function upgradeMaterialDialogButtons(dialog: RWUIDialog<any>): void {
    dialog.element
        .querySelectorAll("button")
        .forEach((el) => new MDCRipple(el).initialize());
}

export interface MaterialDialogInitializationOptions<T> {
    onPostInit?: (mdcDialog: MDCDialog) => PromiseOrNot<void>;
    onClose?: (
        event: Event & { detail: { action: string } }
    ) => PromiseOrNot<T>;
}

export type UpgradedMaterialDialog<T> = MDCDialog & {
    wait: () => Promise<T>;
};

export async function upgradeMaterialDialog<T>(
    dialog: RWUIDialog<any>,
    options?: MaterialDialogInitializationOptions<T>
): Promise<UpgradedMaterialDialog<T>> {
    const styleStorage = getMaterialStorage();
    registerMaterialDialog(dialog);

    upgradeMaterialDialogButtons(dialog);

    const mdcDialog = new MDCDialog(dialog.element);

    const [closePromise, closePromiseResolver] =
        promiseSplit<typeof dialog.result>();
    mdcDialog.listen(
        "MDCDialog:closed",
        async (event: Event & { detail: { action: string } }) => {
            if (options?.onClose) dialog.result = await options.onClose(event);

            styleStorage.dialogTracker.delete(dialog.id);
            closePromiseResolver(dialog.result ?? null);
        }
    );

    mdcDialog.initialize();
    mdcDialog.open();

    if (options?.onPostInit) await options.onPostInit(mdcDialog);

    dialog.dialog = Object.assign(mdcDialog, {
        wait: () => closePromise,
    });
    return dialog.dialog;
}

export function registerMaterialDialog(dialog: RWUIDialog<any>): void {
    getMaterialStorage().dialogTracker.set(dialog.id, dialog);
    document.body.appendChild(dialog.render());
}
