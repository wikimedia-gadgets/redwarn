import { RWUIDialog, RWUIDialogProperties } from "app/ui/elements/RWUIDialog";

export interface RWUISelectionDialogItem {
    icon?: string;
    iconColor?: string;
    color?: string;
    content: string;
    data: string;
    action?: (event: Event) => any;
}

export interface RWUISelectionDialogProps extends RWUIDialogProperties {
    title: string;
    items: RWUISelectionDialogItem[];
}

export class RWUISelectionDialog extends RWUIDialog<string> {
    show(): Promise<string> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwSelectionDialog";

    constructor(readonly props: RWUISelectionDialogProps) {
        super(props);
    }
}
