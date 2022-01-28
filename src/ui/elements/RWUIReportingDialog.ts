import type { Page, User } from "rww/mediawiki";
import type { ReportVenue } from "rww/mediawiki/report/ReportVenue";
import { RWUIDialog, RWUIDialogProperties } from "rww/ui/elements/RWUIDialog";

export interface RWUIReportingDialogProps extends RWUIDialogProperties {
    target?: User | Page;
    venue: ReportVenue;
}

export class RWUIReportingDialog extends RWUIDialog<null> {
    show(): Promise<null> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwReportingDialog";

    constructor(readonly props: RWUIReportingDialogProps) {
        super(props);
    }
}
