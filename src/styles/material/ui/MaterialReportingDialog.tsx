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
import { isUserModeReportVenue } from "rww/mediawiki/report/ReportVenue";
import { Page, User } from "rww/mediawiki";

export default class MaterialReportingDialog extends RWUIReportingDialog {
    target: User | Page;

    mrdTarget:
        | ReturnType<typeof MaterialReportingDialogPage>
        | ReturnType<typeof MaterialReportingDialogUser>;

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

    refresh(): void {
        this.mrdTarget.MRDTarget.refresh();
    }

    render(): HTMLDialogElement {
        this.element = (
            <MaterialDialog
                id={this.id}
                surfaceProperties={{
                    style: toCSS({ width: "600px" })
                }}
            >
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent style={toCSS({ width: "100%" })}>
                    {this.renderTarget()}
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

export interface MaterialReportingDialogChildProps {
    reportingDialog: MaterialReportingDialog;
}
