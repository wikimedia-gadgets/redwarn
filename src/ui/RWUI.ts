import StyleManager from "../styles/StyleManager";
import { RWUIDialog } from "./RWUIDialog";

/**
 * Redirect class for easy access.
 */
export default class RWUI {
    /** Alias of {@link StyleManager.activeStyle.classMap.rwDialog} */
    static get Dialog() {
        return StyleManager.activeStyle.classMap.rwDialog;
    }
}

/**
 * A complete list of all RWUIElements
 */
export const RWUIElements = {
    [RWUIDialog.elementName]: RWUIDialog,
};
