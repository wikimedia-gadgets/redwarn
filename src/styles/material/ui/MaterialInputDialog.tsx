import { ComponentChild, h as TSX } from "tsx-dom";

import { RWUIInputDialog } from "../../../ui/RWUIDialog";

import { MDCRipple } from "@material/ripple";
import { MDCDialog } from "@material/dialog";
import { MDCTextField } from "@material/textfield";
import { MDCTextFieldCharacterCounter } from "@material/textfield/character-counter";
import { MDCTextFieldIcon } from "@material/textfield/icon";
import { MDCTextFieldHelperText } from "@material/textfield/helper-text";
import { getMaterialStorage } from "../storage/MaterialStyleStorage";
import MaterialButton from "./MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";
import i18next from "i18next";

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

    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    show(): Promise<any> {
        const styleStorage = getMaterialStorage();
        styleStorage.dialogTracker.set(this.id, this);

        document.body.appendChild(this.render());

        console.log(this.element);

        // Upgrade the newly-inserted MDC element.
        $(this.element)
            .find("button")
            .each((_, el) => void new MDCRipple(el));

        this.MDCComponents = {
            textField: new MDCTextField(
                this.element.querySelector(".mdc-text-field")
            ),
        };
        this.MDCComponents.characterCounter =
            this.props.maxCharacterCount &&
            new MDCTextFieldCharacterCounter(
                this.element.querySelector(".mdc-text-field-character-counter")
            );

        this.MDCComponents.leadingIcon =
            this.props.leadingIcon &&
            new MDCTextFieldIcon(
                this.element.querySelector(`#${this.id}_leadIcon`)
            );
        this.MDCComponents.trailingIcon =
            this.props.trailingIcon &&
            new MDCTextFieldIcon(
                this.element.querySelector(`#${this.id}_trailIcon`)
            );
        this.MDCComponents.helperText =
            this.props.helperText &&
            new MDCTextFieldHelperText(
                this.element.querySelector(".mdc-text-field-helper-text")
            );

        const dialog = new MDCDialog(this.element);
        dialog.open();

        return new Promise((resolve) => {
            dialog.listen(
                "MDCDialog:closed",
                async (event: Event & { detail: { action: string } }) => {
                    if (event.detail.action === "confirm") {
                        this._result = this.MDCComponents.textField.value;
                    } else if (event.detail.action === "cancel") {
                        this._result = null;
                    }

                    const res = styleStorage.dialogTracker.get(this.id).result;
                    styleStorage.dialogTracker.delete(this.id);
                    resolve(res);
                }
            );
        });
    }

    /**
     * Renders the MaterialInputDialog's actions (as buttons).
     * @return A collection of {@link HTMLButtonElement}s, all of which are MDC buttons.
     */
    private renderActions(): ComponentChild[] {
        return [
            <MaterialButton dialogAction="confirm">
                {this.props.actions?.ok ?? i18next.t<string>("ui:okCancel.ok")}
            </MaterialButton>,
            <MaterialButton dialogAction="cancel">
                {this.props.actions?.ok ??
                    i18next.t<string>("ui:okCancel.cancel")}
            </MaterialButton>,
        ];
    }

    /**
     * Renders a MaterialInputDialog.
     *
     * NOTE: Only use this when appending to body! Otherwise, use {@link MaterialInputDialog.element}.
     * @returns A {@link HTMLDialogElement}.
     */
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
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent>
                    <label
                        class={`mdc-text-field mdc-text-field--outlined${
                            this.props.leadingIcon &&
                            " mdc-text-field--with-leading-icon"
                        }${
                            this.props.trailingIcon &&
                            " mdc-text-field--with-trailing-icon"
                        }`}
                    >
                        <span class="mdc-notched-outline">
                            <span class="mdc-notched-outline__leading"></span>
                            <span class="mdc-notched-outline__notch">
                                <span
                                    class="mdc-floating-label"
                                    id={`${this.id}_label`}
                                >
                                    {this.props.label}
                                </span>
                            </span>
                            <span class="mdc-notched-outline__trailing"></span>
                        </span>
                        {this.props.prefix && (
                            <span class="mdc-text-field__affix mdc-text-field__affix--prefix">
                                {this.props.prefix}
                            </span>
                        )}
                        {this.props.leadingIcon && (
                            <i
                                class="material-icons mdc-text-field__icon mdc-text-field__icon--leading"
                                id={`${this.id}_leadIcon`}
                                {...(this.props.leadingIcon.action && {
                                    tabIndex: 0,
                                    role: "button",
                                    onClick: this.props.leadingIcon.action,
                                })}
                            >
                                {this.props.leadingIcon.icon}
                            </i>
                        )}
                        <input
                            type="text"
                            class="mdc-text-field__input"
                            aria-labelledby={`${this.id}_label`}
                            {...(this.props.helperText && {
                                "aria-controls": `${this.id}_helper`,
                                "aria-describedby": `${this.id}_helper`,
                            })}
                            {...(this.props.defaultText && {
                                value: this.props.defaultText,
                            })}
                            {...(this.props.maxCharacterCount && {
                                maxLength: this.props.maxCharacterCount,
                            })}
                        />
                        {this.props.trailingIcon && (
                            <i
                                class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
                                id={`${this.id}_trailIcon`}
                                {...(this.props.trailingIcon.action && {
                                    tabIndex: 0,
                                    role: "button",
                                    onClick: this.props.trailingIcon.action,
                                })}
                            >
                                {this.props.trailingIcon.icon}
                            </i>
                        )}
                        {this.props.suffix && (
                            <span class="mdc-text-field__affix mdc-text-field__affix--suffix">
                                {this.props.suffix}
                            </span>
                        )}
                    </label>
                    <div class="mdc-text-field-helper-line">
                        {this.props.helperText ? (
                            <div
                                id={`${this.id}_helper`}
                                class="mdc-text-field-helper-text"
                                aria-hidden="true"
                            >
                                {this.props.helperText}
                            </div>
                        ) : null}
                        {this.props.maxCharacterCount ? (
                            <div
                                id={`${this.id}_char`}
                                class="mdc-text-field-character-counter"
                            >
                                0 / {this.props.maxCharacterCount}
                            </div>
                        ) : null}
                    </div>
                </MaterialDialogContent>
                <MaterialDialogActions>
                    {...this.renderActions()}
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;

        return this.element;
    }
}
