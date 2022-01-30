import i18next from "i18next";
import { h } from "tsx-dom";
import { upgradeMaterialDialog } from "rww/styles/material/Material";
import MaterialButton from "rww/styles/material/ui/components/MaterialButton";
import MaterialReportingDialogPage from "rww/styles/material/ui/components//MaterialReportingDialogPage";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle
} from "rww/styles/material/ui/MaterialDialog";
import {
    RWUIReportingDialog,
    RWUIReportingDialogProps
} from "rww/ui/elements/RWUIReportingDialog";
import toCSS from "rww/styles/material/util/toCSS";
import MaterialReportingDialogUser from "./components/MaterialReportingDialogUser";
import {
    isUserModeReportVenue,
    ReportVenue
} from "rww/mediawiki/report/ReportVenue";
import { Page, User } from "rww/mediawiki";
import MaterialReportingDialogInfo from "rww/styles/material/ui/components/MaterialReportingDialogInfo";
import "../css/reportingDialog.css";

export default class MaterialReportingDialog extends RWUIReportingDialog {
    target: User | Page;
    reason?: string;
    comments?: string;

    mrdTarget:
        | ReturnType<typeof MaterialReportingDialogPage>
        | ReturnType<typeof MaterialReportingDialogUser>;
    mrdInfo: ReturnType<typeof MaterialReportingDialogInfo>;

    get venue(): ReportVenue {
        return this.props.venue;
    }

    constructor(props: RWUIReportingDialogProps) {
        super(props);

        if (!this.props.title)
            this.props.title = i18next.t("ui:reporting.title", {
                venue: props.venue.name
            });
    }

    show(): Promise<any> {
        return upgradeMaterialDialog(this, {
            onClose: (event) => {
                if (event.detail.action === "confirm") {
                    return "Confirmed!";
                } else if (event.detail.action === "cancel") {
                    return null;
                }
            }
        }).then((v) => v.wait());
    }

    renderTarget(): JSX.Element {
        if (isUserModeReportVenue(this.props.venue)) {
            return (this.mrdTarget = (
                <MaterialReportingDialogUser
                    reportingDialog={this}
                    originalTarget={this.props.target as User}
                />
            ) as ReturnType<typeof MaterialReportingDialogUser>);
        } else {
            return (this.mrdTarget = (
                <MaterialReportingDialogPage
                    reportingDialog={this}
                    originalTarget={this.props.target as Page}
                />
            ) as ReturnType<typeof MaterialReportingDialogPage>);
        }
    }

    renderInfo(): JSX.Element {
        return (this.mrdInfo = (
            <MaterialReportingDialogInfo reportingDialog={this} />
        ) as ReturnType<typeof MaterialReportingDialogInfo>);
    }

    refresh(): void {
        this.mrdTarget.MRDTarget.refresh();
    }

    render(): HTMLDialogElement {
        this.element = (
            <MaterialDialog
                id={this.id}
                surfaceProperties={{
                    class: "rw-mdc-reportingDialog",
                    style: toCSS({ minWidth: "700px" })
                }}
            >
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent style={toCSS({ width: "100%" })}>
                    {this.renderTarget()}
                    {this.renderInfo()}
                </MaterialDialogContent>
                <MaterialDialogActions>
                    <MaterialButton dialogAction="cancel">
                        {i18next.t<string>("ui:cancel")}
                    </MaterialButton>
                    <MaterialButton dialogAction="confirm" raised>
                        {i18next.t<string>("ui:reporting.ok")}
                    </MaterialButton>
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;

        if (this.props.target) {
        }

        return this.element;
    }
}
