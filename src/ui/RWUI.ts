import StyleManager from "rww/styles/StyleManager";
import { ClientUser, UserAccount } from "rww/mediawiki/MediaWiki";
import {
    RWUIAlertDialog,
    RWUIIFrameDialog,
    RWUIInputDialog,
    RWUISelectionDialog,
    RWUISelectionDialogItem,
    RWUIWarnDialog,
} from "./elements/RWUIDialog";
import DiffViewerInjector from "rww/ui/injectors/DiffViewerInjector";
import { RollbackContext } from "rww/definitions/RollbackContext";
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
    /** Alias of {@link StyleManager.activeStyle.classMap.rwWarnDialog} */
    static get WarnDialog(): typeof RWUIWarnDialog {
        return StyleManager.activeStyle.classMap.rwWarnDialog;
    }
    /** Alias of {@link StyleManager.activeStyle.classMap.rwIFrameDialog} */
    static get IFrameDialog(): typeof RWUIIFrameDialog {
        return StyleManager.activeStyle.classMap.rwIFrameDialog;
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
        const rollbackIcons =
            (ctx.rollbackContext &&
                DiffViewerInjector.getDisabledOptions(ctx.rollbackContext)) ??
            [];
        if (rollbackIcons.length > 0) {
            items.push(...rollbackIcons);
        }

        // TODO topIcons

        const targetUser = ctx.user ?? ctx.rollbackContext?.targetRevision.user;

        if (targetUser) {
            // TODO AIV
            // TODO UAA
        }

        if (ClientUser.i.emailEnabled) {
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
    static async inject(): Promise<any> {
        return Promise.all([DiffViewerInjector.init()]);
    }
}

export interface ExtendedOptionsContext {
    user?: UserAccount;
    rollbackContext?: RollbackContext;
}

/**
 * A complete list of all RWUIElements
 */
export const RWUIElements = {
    [RWUIAlertDialog.elementName]: RWUIAlertDialog,
    [RWUIInputDialog.elementName]: RWUIInputDialog,
    [RWUISelectionDialog.elementName]: RWUISelectionDialog,
    [RWUIWarnDialog.elementName]: RWUIWarnDialog,
    [RWUIIFrameDialog.elementName]: RWUIIFrameDialog,
    [RWUIToast.elementName]: RWUIToast,
};
