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
        const dialog = upgradeMaterialDialog(this);

        return new Promise((resolve) => {
            dialog.listen(
                "MDCDialog:closed",
                async (event: Event & { detail: { action: string } }) => {
                    const actionSelected = this.props.items.find(
                        (item) => item.data === event.detail.action
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
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "style": `width: ${this.props.width ?? "30vw"};`,
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog",
                }}
                id={this.id}
            >
                <MaterialButton
                    dialogAction="close"
                    icon="close"
                    style={{ float: "right" }}
                />
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent>
                    {...this.props.items.flatMap((item) => [
                        <MaterialButton
                            dialogAction={item.data}
                            icon={item.icon}
                            iconColor={item.iconColor}
                            style={{ width: "100%", textAlign: "left" }}
                            contentStyle={
                                item.content.length > 40 && { fontSize: "12px" }
                            }
                        >
                            {item.content}
                        </MaterialButton>,
                        <hr />,
                    ])}
                </MaterialDialogContent>
            </MaterialDialog>
        ) as HTMLDialogElement;
        return this.element;
    }
}
