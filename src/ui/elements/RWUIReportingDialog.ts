import type { Page } from "app/mediawiki";
import { User } from "app/mediawiki";
import type { ReportVenue } from "app/mediawiki/report/ReportVenue";
import { ReportVenueMode } from "app/mediawiki/report/ReportVenue";
import { RWUIDialog, RWUIDialogProperties } from "app/ui/elements/RWUIDialog";
import { Report } from "app/mediawiki/report/Report";

export type RWUIReportingDialogTargetType<T extends ReportVenue> =
    T["mode"] extends ReportVenueMode.User ? User : Page;
export interface RWUIReportingDialogProps extends RWUIDialogProperties {
    venue: ReportVenue;
    notice?: string;
    target?: User | Page;
}

export class RWUIReportingDialog extends RWUIDialog<Report> {
    show(): Promise<Report> {
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
