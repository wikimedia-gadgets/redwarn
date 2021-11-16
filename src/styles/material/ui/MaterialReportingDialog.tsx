import i18next from "i18next";
import { h } from "tsx-dom";
import { upgradeMaterialDialog } from "rww/styles/material/Material";
import MaterialButton from "rww/styles/material/ui/components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle
} from "rww/styles/material/ui/MaterialDialog";
import { RWUIReportingDialog } from "rww/ui/elements/RWUIReportingDialog";
import toCSS from "rww/styles/material/util/toCSS";

export default class MaterialReportingDialog extends RWUIReportingDialog {
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

    render(): HTMLDialogElement {
        return (
            <MaterialDialog id={this.id}>
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent
                    style={toCSS({ width: "100%" })}
                ></MaterialDialogContent>
                <MaterialDialogActions>
                    <MaterialButton dialogAction="cancel">
                        {i18next.t<string>("ui:okCancel.cancel")}
                    </MaterialButton>
                    <MaterialButton dialogAction="confirm">
                        {i18next.t<string>("ui:okCancel.ok")}
                    </MaterialButton>
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;
    }
}
