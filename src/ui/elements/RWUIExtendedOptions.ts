import { RWUIDialog, RWUIDialogProperties } from "rww/ui/elements/RWUIDialog";

export class RWUIExtendedOptions extends RWUIDialog {
    show(): Promise<string> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwExtendedOptions";

    constructor(readonly props: RWUIDialogProperties = {}) {
        super(props);
    }

    protected _result: string;
}
