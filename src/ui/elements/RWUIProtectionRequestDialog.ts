import { Page } from "rww/mediawiki";
import { RWUIDialog, RWUIDialogProperties } from "rww/ui/elements/RWUIDialog";
import ProtectionRequest from "rww/mediawiki/protection/ProtectionRequest";

export interface RWUIProtectionRequestDialogProps extends RWUIDialogProperties {
    relatedPage?: Page;
    /** Whether or not the request will be made directly after the dialog closes. */
    autoRequest?: boolean;
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
