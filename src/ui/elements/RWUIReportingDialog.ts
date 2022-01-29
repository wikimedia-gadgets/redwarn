import type { Page } from "rww/mediawiki";
import { User } from "rww/mediawiki";
import type { ReportVenue } from "rww/mediawiki/report/ReportVenue";
import { ReportVenueMode } from "rww/mediawiki/report/ReportVenue";
import { RWUIDialog, RWUIDialogProperties } from "rww/ui/elements/RWUIDialog";

export type RWUIReportingDialogTargetType<
    T extends ReportVenue
> = T["mode"] extends ReportVenueMode.User ? User : Page;
export interface RWUIReportingDialogProps extends RWUIDialogProperties {
    venue: ReportVenue;
    target?: User | Page;
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
