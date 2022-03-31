import { RWUIDialog, RWUIDialogProperties } from "app/ui/elements/RWUIDialog";

export interface RWUIExtendedOptionsProperties extends RWUIDialogProperties {
    showDiffIcons?: boolean;
}

export class RWUIExtendedOptions extends RWUIDialog<void> {
    show(): Promise<void> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwExtendedOptions";

    constructor(readonly props: RWUIExtendedOptionsProperties = {}) {
        super(props);
    }
}
