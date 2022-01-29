import RWUIElement from "rww/ui/elements/RWUIElement";
import { Page, User } from "rww/mediawiki";
import { MaterialReportingDialogUserController } from "rww/styles/material/ui/components/MaterialReportingDialogUser";
import { MaterialReportingDialogPageController } from "rww/styles/material/ui/components/MaterialReportingDialogPage";
import MaterialReportingDialog from "rww/styles/material/ui/MaterialReportingDialog";
import { MaterialReportingDialogReasonController } from "rww/styles/material/ui/components/MaterialReportingDialogReason";

export abstract class MaterialReportingDialogChild extends RWUIElement {
    /**
     * Refresh the contents of this child without changing the root.
     */
    abstract refresh(): void;
}

export interface MaterialReportingDialogChildProps {
    reportingDialog: MaterialReportingDialog;
}

export interface MaterialReportingDialogTargetProps<T extends Page | User>
    extends MaterialReportingDialogChildProps {
    originalTarget?: T;
}

export interface MaterialReportingDialogTarget extends JSX.Element {
    MRDTarget:
        | MaterialReportingDialogUserController
        | MaterialReportingDialogPageController;
}

export interface MaterialReportingDialogInfo extends JSX.Element {
    MRDInfo: MaterialReportingDialogReasonController;
}
