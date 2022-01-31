import { Page, User } from "rww/mediawiki";
import { MaterialReportingDialogUserController } from "rww/styles/material/ui/components/MaterialReportingDialogUser";
import { MaterialReportingDialogPageController } from "rww/styles/material/ui/components/MaterialReportingDialogPage";
import MaterialReportingDialog from "rww/styles/material/ui/MaterialReportingDialog";

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
    valid: () => boolean;
}
