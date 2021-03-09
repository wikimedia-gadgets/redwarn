import { ComponentChild, h } from "tsx-dom";

import { RWUIDialog } from "rww/ui/elements/RWUIDialog";
import {
    registerMaterialDialog,
    upgradeMaterialDialog,
} from "rww/styles/material/Material";

import { getMaterialStorage } from "rww/styles/material/data/MaterialStyleStorage";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";

import "../css/warnDialog.css";

export default class MaterialWarnSearchDialog extends RWUIDialog {
    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    show(): Promise<any> {
        const styleStorage = getMaterialStorage();
        registerMaterialDialog(this);
        const dialog = upgradeMaterialDialog(this);

        return new Promise((resolve) => {
            dialog.listen("MDCDialog:closed", async () => {
                styleStorage.dialogTracker.delete(this.id);
                resolve(null);
            });
        });
    }

    /**
     * Renders the MaterialWarnSearchDialog's actions (as buttons).
     * @return A collection of {@link HTMLButtonElement}s, all of which are MDL buttons.
     */
    private static renderActions(): ComponentChild[] {
        return [
            <MaterialButton dialogAction={"cancel"}>Cancel</MaterialButton>,
            <MaterialButton dialogAction={"submit"} disabled={true}>
                Select
            </MaterialButton>,
        ];
    }

    /**
     * Renders a MaterialWarnSearchDialog.
     *
     * NOTE: Only use this when appending to body! Otherwise, use {@link MaterialWarnSearchDialog.element}.
     * @returns A {@link HTMLDialogElement}.
     */
    render(): HTMLDialogElement {
        return (this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "class": "mdc-dialog__surface rw-mdc-warnSearchDialog",
                    "style": `width:${this.props.width ?? "70vw"};height:90vh;`,
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog",
                }}
                id={this.id}
            >
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent>
                    {/* TODO actual search content here */}
                </MaterialDialogContent>
                <MaterialDialogActions>
                    {MaterialWarnSearchDialog.renderActions()}
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement);
    }
}
