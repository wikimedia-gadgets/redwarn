import { MDCTextField } from "@material/textfield";
import { MDCTextFieldCharacterCounter } from "@material/textfield/character-counter";
import { MDCTextFieldHelperText } from "@material/textfield/helper-text";
import { MDCTextFieldIcon } from "@material/textfield/icon";
import i18next from "i18next";
import { h } from "tsx-dom";

import { RWUIInputDialog } from "rww/ui/elements/RWUIDialog";
import {
    registerMaterialDialog,
    upgradeMaterialDialog
} from "rww/styles/material/Material";
import { getMaterialStorage } from "rww/styles/material/data/MaterialStyleStorage";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle
} from "./MaterialDialog";
import MaterialTextInput, {
    MaterialTextInputUpgrade
} from "rww/styles/material/ui/components/MaterialTextInput";

/**
 * The MaterialInputDialog is a handling class used to get input from users on the screen. This will
 * automatically handle dialog actions, content, etc.
 *
 * To show a dialog on the DOM, use {@link MaterialInputDialog.show}.
 */
export default class MaterialInputDialog extends RWUIInputDialog {
    /**
     * The upgraded MDC components
     */
    MDCComponents: {
        textField: MDCTextField;
        characterCounter?: MDCTextFieldCharacterCounter;
        leadingIcon?: MDCTextFieldIcon;
        trailingIcon?: MDCTextFieldIcon;
        helperText?: MDCTextFieldHelperText;
    };
    textFieldElement: JSX.Element;

    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    show(): Promise<any> {
        const styleStorage = getMaterialStorage();
        registerMaterialDialog(this);

        this.MDCComponents = MaterialTextInputUpgrade(this.textFieldElement);

        const dialog = upgradeMaterialDialog(this);

        return new Promise((resolve) => {
            dialog.listen(
                "MDCDialog:closed",
                async (event: Event & { detail: { action: string } }) => {
                    if (event.detail.action === "confirm") {
                        this._result = this.MDCComponents.textField.value;
                    } else if (event.detail.action === "cancel") {
                        this._result = null;
                    }

                    styleStorage.dialogTracker.delete(this.id);
                    resolve(this._result);
                }
            );
        });
    }

    /**
     * Renders the MaterialInputDialog's actions (as buttons).
     * @return A MaterialDialogActions element
     */
    private renderActions(): ReturnType<typeof MaterialDialogActions> {
        return (
            <MaterialDialogActions>
                <MaterialButton dialogAction="cancel">
                    {this.props.actions?.cancel ??
                        i18next.t<string>("ui:okCancel.cancel")}
                </MaterialButton>
                <MaterialButton dialogAction="confirm">
                    {this.props.actions?.ok ??
                        i18next.t<string>("ui:okCancel.ok")}
                </MaterialButton>
            </MaterialDialogActions>
        );
    }

    /**
     * Renders a MaterialInputDialog.
     *
     * NOTE: Only use this when appending to body! Otherwise, use {@link MaterialInputDialog.element}.
     * @returns A {@link HTMLDialogElement}.
     */
    render(): HTMLDialogElement {
        this.textFieldElement = (
            <MaterialTextInput id={this.id} {...this.props} />
        );
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "style": `width: ${this.props.width ?? "30vw"};`,
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog"
                }}
                id={this.id}
            >
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent style={{ width: "100%" }}>
                    {this.textFieldElement}
                </MaterialDialogContent>
                {this.renderActions()}
            </MaterialDialog>
        ) as HTMLDialogElement;

        return this.element;
    }
}
