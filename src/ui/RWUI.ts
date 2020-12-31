import RedWarnStore from "rww/data/RedWarnStore";
import StyleManager from "rww/styles/StyleManager";
import Rollback from "rww/wikipedia/Rollback";
import User from "rww/wikipedia/User";
import {
    RWUIAlertDialog,
    RWUIInputDialog,
    RWUISelectionDialog,
    RWUISelectionDialogItem,
} from "./elements/RWUIDialog";
import { RWUIToast } from "./elements/RWUIToast";

/**
 * Redirect class for easy access. UI elements of RedWarn are also created here.
 */
export default class RWUI {
    /** Alias of {@link StyleManager.activeStyle.classMap.rwAlertDialog} */
    static get Dialog(): typeof RWUIAlertDialog {
        return StyleManager.activeStyle.classMap.rwAlertDialog;
    }
    /** Alias of {@link StyleManager.activeStyle.classMap.rwInputDialog} */
    static get InputDialog(): typeof RWUIInputDialog {
        return StyleManager.activeStyle.classMap.rwInputDialog;
    }
    /** Alias of {@link StyleManager.activeStyle.classMap.rwSelectionDialog} */
    static get SelectionDialog(): typeof RWUISelectionDialog {
        return StyleManager.activeStyle.classMap.rwSelectionDialog;
    }
    /** Alias of {@link StyleManager.activeStyle.classMap.rwToast} */
    static get Toast(): typeof RWUIToast {
        return StyleManager.activeStyle.classMap.rwToast;
    }

    /**
     * Opens extended options that can be opened from any page (preferences, oversight and TAS reporting)
     */
    static openExtendedOptionsDialog(
        ctx: ExtendedOptionsContext
    ): Promise<any> {
        const items: RWUISelectionDialogItem[] = [];
        const rollbackIcons = ctx.rollback?.getDisabledOptions() ?? [];
        if (rollbackIcons.length > 0) {
            items.push(...rollbackIcons);
        }

        // TODO topIcons

        const targetUser = ctx.user ?? ctx.rollback?.rollbackRevision.user;

        if (targetUser) {
            // TODO AIV
            // TODO UAA
        }

        if (RedWarnStore.APIStore.emailEnabled) {
            // TODO oversight
            // TODO 911
        }

        const dialog = new this.SelectionDialog({
            items,
            title: "More Options",
        });

        return dialog.show();
    }
}

export interface ExtendedOptionsContext {
    user?: User;
    rollback?: Rollback;
}

/**
 * A complete list of all RWUIElements
 */
export const RWUIElements = {
    [RWUIAlertDialog.elementName]: RWUIAlertDialog,
    [RWUIInputDialog.elementName]: RWUIInputDialog,
    [RWUISelectionDialog.elementName]: RWUISelectionDialog,
    [RWUIToast.elementName]: RWUIToast,
};
