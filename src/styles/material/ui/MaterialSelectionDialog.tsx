import { h } from "tsx-dom";
import { RWUISelectionDialog } from "../../../ui/elements/RWUIDialog";
import { registerMaterialDialog, upgradeMaterialDialog } from "../Material";
import { getMaterialStorage } from "../storage/MaterialStyleStorage";
import MaterialButton from "./MaterialButton";
import MaterialDialog, {
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";

export default class MaterialSelectionDialog extends RWUISelectionDialog {
    show(): Promise<any> {
        const styleStorage = getMaterialStorage();
        registerMaterialDialog(this);
        const dialog = upgradeMaterialDialog(
            this,
            new Map([["autoStackButtons", false]])
        );

        return new Promise((resolve) => {
            dialog.listen(
                "MDCDialog:closed",
                async (event: Event & { detail: { action: string } }) => {
                    const actionSelected = this.props.items.find(
                        (item) => item.data === event.detail?.action
                    ).action;
                    if (actionSelected != null) {
                        this._result =
                            (await actionSelected(event)) ??
                            event.detail.action;
                    } else {
                        this._result = event.detail.action;
                    }

                    const res = styleStorage.dialogTracker.get(this.id).result;
                    styleStorage.dialogTracker.delete(this.id);
                    resolve(res);
                }
            );
        });
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
        console.log(buttons);
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
                <MaterialDialogTitle
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "200",
                        fontSize: "45px",
                        lineHeight: "48px",
                        borderStyle: "none",
                        marginTop: "4vh",
                    }}
                >
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
