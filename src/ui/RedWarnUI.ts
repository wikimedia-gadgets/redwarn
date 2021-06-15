import StyleManager from "rww/styles/StyleManager";
import { UserAccount } from "rww/mediawiki";
import {
    RWUIAlertDialog,
    RWUIIFrameDialog,
    RWUIInputDialog,
    RWUISelectionDialog,
    RWUIWarnDialog,
} from "./elements/RWUIDialog";
// import DiffViewerInjector from "rww/ui/injectors/DiffViewerInjector";
import { RWUIToast } from "./elements/RWUIToast";
import { RWUIDiffIcons } from "rww/ui/elements/RWUIDiffIcons";
import { RevertContext } from "rww/mediawiki/Revert";

/**
 * Redirect class for easy access. UI elements of RedWarn are also created here.
 */
export default class RedWarnUI {
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
    /** Alias of {@link StyleManager.activeStyle.classMap.rwDiffIcons} */
    static get DiffIcons(): typeof RWUIDiffIcons {
        return StyleManager.activeStyle.classMap.rwDiffIcons;
    }

    /**
     * Opens extended options that can be opened from any page (preferences, oversight and TAS reporting)
     */
    static openExtendedOptionsDialog(): // TODO: dev-rwTS-difficons
    // ctx: ExtendedOptionsContext
    Promise<any> {
        // const items: RWUISelectionDialogItem[] = [];
        // const rollbackIcons =
        //     (ctx.rollbackContext &&
        //         DiffViewerInjector.getDisabledOptions(ctx.rollbackContext)) ??
        //     [];
        // if (rollbackIcons.length > 0) {
        //     items.push(...rollbackIcons);
        // }
        //
        // // TODO topIcons
        //
        // const targetUser = ctx.user ?? ctx.rollbackContext?.targetRevision.user;
        //
        // if (targetUser) {
        //     // TODO AIV
        //     // TODO UAA
        // }
        //
        // if (ClientUser.i.emailEnabled) {
        //     // TODO oversight
        //     // TODO 911
        // }
        //
        // const dialog = new this.SelectionDialog({
        //     items,
        //     title: "More Options",
        // });
        //
        // return dialog.show();
        return null;
    }
}

export interface ExtendedOptionsContext {
    user?: UserAccount;
    rollbackContext?: RevertContext;
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
    [RWUIDiffIcons.elementName]: RWUIDiffIcons,
};
