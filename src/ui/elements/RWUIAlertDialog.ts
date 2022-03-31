import { ComponentChild } from "tsx-dom";
import {
    RWUIDialog,
    RWUIDialogAction,
    RWUIDialogProperties,
} from "app/ui/elements/RWUIDialog";

export interface RWUIAlertDialogProps extends RWUIDialogProperties {
    /**
     * The actions of the dialog. These go at the bottom of the dialog.
     */
    actions: RWUIDialogAction[];
    /**
     * The content of the dialog.
     */
    content?: ComponentChild;
    /**
     * Optional raw content, for errors etc. Will be wrapped in a <pre>
     */
    preformattedContent?: string;
}

export class RWUIAlertDialog extends RWUIDialog<string> {
    show(): Promise<string> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwAlertDialog";

    constructor(readonly props: RWUIAlertDialogProps) {
        super(props);
    }
}
