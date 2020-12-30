import RedWarnStore from "../data/RedWarnStore";
import StyleManager from "../styles/StyleManager";
import Rollback from "../wikipedia/Rollback";
import User from "../wikipedia/User";
import {RWUIAlertDialog, RWUIInputDialog, RWUISelectionDialog, RWUISelectionDialogItem,} from "./elements/RWUIDialog";
import DiffViewerInjector from "./injectors/DiffViewerInjector";

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

    /**
     * Run all injectors.
     *
     * Injectors are responsible for modifying existing MediaWiki DOM. This allows
     * for non-invasive DOM procedures, and allows a separation between UI and DOM-
     * modifying code from actual API functionality.
     */
    static async inject() : Promise<any> {

        return Promise.all([
            DiffViewerInjector.init()
        ]);

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
};