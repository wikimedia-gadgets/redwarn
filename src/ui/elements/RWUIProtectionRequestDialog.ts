import { Page } from "app/mediawiki";
import { RWUIDialog, RWUIDialogProperties } from "app/ui/elements/RWUIDialog";
import ProtectionRequest from "app/mediawiki/protection/ProtectionRequest";

export interface RWUIProtectionRequestDialogProps extends RWUIDialogProperties {
    relatedPage?: Page;
}

export class RWUIProtectionRequestDialog extends RWUIDialog<ProtectionRequest> {
    show(): Promise<ProtectionRequest> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwProtectionRequestDialog";

    constructor(readonly props: RWUIProtectionRequestDialogProps = {}) {
        super(props);
    }
}
