import {
    OKCancelActions,
    RWIconButton,
    RWUIDialog,
    RWUIDialogProperties
} from "rww/ui/elements/RWUIDialog";

export interface RWUIInputDialogProps extends RWUIDialogProperties {
    label: string;
    defaultText?: string;
    leadingIcon?: RWIconButton;
    trailingIcon?: RWIconButton;
    helperText?: string;
    maxCharacterCount?: number;
    prefix?: string;
    suffix?: string;
    /**
     * The actions of the dialog. These go at the bottom of the dialog.
     */
    actions?: OKCancelActions;
}

export class RWUIInputDialog extends RWUIDialog {
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

    protected _result: string;
}
