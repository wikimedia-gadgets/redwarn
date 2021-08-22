import StyleManager from "rww/styles/StyleManager";
import { UserAccount } from "rww/mediawiki";
import { RWUIToast } from "./elements/RWUIToast";
import { RWUIDiffIcons } from "rww/ui/elements/RWUIDiffIcons";
import { RevertContext } from "rww/mediawiki/Revert";
import { RWUIPageIcons } from "rww/ui/elements/RWUIPageIcons";
import { RWUIAlertDialog } from "rww/ui/elements/RWUIAlertDialog";
import { RWUIInputDialog } from "rww/ui/elements/RWUIInputDialog";
import { RWUISelectionDialog } from "rww/ui/elements/RWUISelectionDialog";
import { RWUIIFrameDialog } from "rww/ui/elements/RWUIIFrameDialog";
import { RWUIWarnDialog } from "rww/ui/elements/RWUIWarnDialog";
import { RWUIExtendedOptions } from "rww/ui/elements/RWUIExtendedOptions";

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
    /** Alias of {@link StyleManager.activeStyle.classMap.rwPageIcons} */
    static get PageIcons(): typeof RWUIPageIcons {
        return StyleManager.activeStyle.classMap.rwPageIcons;
    }
    static get ExtendedOptions(): typeof RWUIExtendedOptions {
        return StyleManager.activeStyle.classMap.rwExtendedOptions;
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
    [RWUIPageIcons.elementName]: RWUIPageIcons,
    [RWUIExtendedOptions.elementName]: RWUIExtendedOptions
};
