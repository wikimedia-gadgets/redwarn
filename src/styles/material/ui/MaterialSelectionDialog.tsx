import { h } from "tsx-dom";
import { RWUISelectionDialog } from "app/ui/elements/RWUISelectionDialog";
import { upgradeMaterialDialog } from "app/styles/material/Material";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";

export default class MaterialSelectionDialog extends RWUISelectionDialog {
    show(): Promise<any> {
        return upgradeMaterialDialog(this, {
            onPostInit: (dialog) => {
                dialog.autoStackButtons = false;
            },
            onClose: async (event) => {
                const actionSelected = this.props.items.find(
                    (item) => item.data === event.detail?.action
                ).action;
                if (actionSelected != null) {
                    return (await actionSelected(event)) ?? event.detail.action;
                } else {
                    return event.detail.action;
                }
            },
        }).then((v) => v.wait());
    }
    render(): HTMLDialogElement {
        const buttons = this.props.items.flatMap((item) => [
            <MaterialButton
                dialogAction={item.data}
                icon={item.icon}
                iconColor={item.iconColor}
                style={{
                    width: "100%",
                    textAlign: "left",
                    display: "inline-block",
                }}
                contentStyle={{
                    ...(item.content.length > 40 && { fontSize: "12px" }),
                    marginLeft: "10px",
                }}
            >
                {item.content}
            </MaterialButton>,
            <hr style={{ margin: "0" }} />,
        ]);
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "style": {
                        width: this.props.width ?? "30vw",
                        height: "60vh",
                    },
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog",
                }}
                id={this.id}
            >
                <MaterialDialogTitle>
                    <span style={{ float: "left" }}>{this.props.title}</span>
                    <MaterialButton
                        dialogAction="close"
                        icon="close"
                        style={{ right: "0", position: "absolute" }}
                    />
                </MaterialDialogTitle>
                <MaterialDialogContent
                    style={{
                        height: "400px",
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    <hr style={{ margin: "0" }} />
                    {...buttons}
                </MaterialDialogContent>
            </MaterialDialog>
        ) as HTMLDialogElement;
        return this.element;
    }
}
