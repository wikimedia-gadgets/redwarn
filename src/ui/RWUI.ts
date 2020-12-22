import StyleManager from "../styles/StyleManager";
import {
    RWUIAlertDialog,
    RWUIInputDialog,
    RWUISelectionDialog,
} from "./RWUIDialog";

/**
 * Redirect class for easy access.
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
}

/**
 * A complete list of all RWUIElements
 */
export const RWUIElements = {
    [RWUIAlertDialog.elementName]: RWUIAlertDialog,
    [RWUIInputDialog.elementName]: RWUIInputDialog,
    [RWUISelectionDialog.elementName]: RWUISelectionDialog,
};
