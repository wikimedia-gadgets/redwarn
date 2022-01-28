import i18next from "i18next";
import { h } from "tsx-dom";
import { upgradeMaterialDialog } from "rww/styles/material/Material";
import MaterialButton from "rww/styles/material/ui/components/MaterialButton";
import MaterialReportingDialogTarget from "rww/styles/material/ui/components//MaterialReportingDialogTarget";
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
import type { Page } from "rww/mediawiki";

export default class MaterialReportingDialog extends RWUIReportingDialog {
    target: Page;

    mrdTarget: ReturnType<typeof MaterialReportingDialogTarget>;

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
        return (this.mrdTarget = (
            <MaterialReportingDialogTarget
                reportingDialog={this}
                originalTarget={this.props.target}
            />
        ) as ReturnType<typeof MaterialReportingDialogTarget>);
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
                        {i18next.t<string>("ui:okCancel.cancel")}
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
