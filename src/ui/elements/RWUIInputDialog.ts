import {
    OKCancelActions,
    RWUIDialog,
    RWUIDialogProperties,
} from "rww/ui/elements/RWUIDialog";
import { RWUITextInputProperties } from "rww/ui/elements/RWUITextInput";

export interface RWUIInputDialogProps
    extends RWUIDialogProperties,
        RWUITextInputProperties {
    /**
     * The actions of the dialog. These go at the bottom of the dialog.
     */
    actions?: OKCancelActions;
    /**
     * Set to `true` if the OK button should be emphasized.
     */
    progressive?: boolean;
}

export class RWUIInputDialog extends RWUIDialog<string> {
    show(): Promise<string> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwInputDialog";

    constructor(readonly props: RWUIInputDialogProps) {
        super(props);
    }
}
