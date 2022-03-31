import { Page, User } from "app/mediawiki";
import { MaterialReportingDialogUserController } from "app/styles/material/ui/components/MaterialReportingDialogUser";
import { MaterialReportingDialogPageController } from "app/styles/material/ui/components/MaterialReportingDialogPage";
import MaterialReportingDialog from "app/styles/material/ui/MaterialReportingDialog";

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
