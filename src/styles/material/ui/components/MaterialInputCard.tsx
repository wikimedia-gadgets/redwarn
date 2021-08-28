import { BaseProps, h } from "tsx-dom";
import classMix from "rww/styles/material/util/classMix";
import i18next from "i18next";
import MaterialTextInput, {
    MaterialTextInputComponents,
    MaterialTextInputUpgrade
} from "rww/styles/material/ui/components/MaterialTextInput";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";

import "../../css/materialInputCard.css";
import RedWarnUI from "rww/ui/RedWarnUI";
import Log from "rww/data/RedWarnLog";

export enum MaterialInputCardState {
    Blank,
    Input,
    Loading,
    Ready,
}

export interface MaterialInputCardProps extends BaseProps {
    label: string;
    value?: string;
    class?: string;
    outlined?: boolean;

    submitIcon?: string;
    cancelIcon?: string;

    i18n?: {
        loadingText?: string;
        inputSubmit?: string;
        inputCancel?: string;
        apiError?: string;
    };
}

/**
 * The MaterialInputCard is an abstract class used to create cards whose
 * values may be modified at any point.
 */
export default abstract class MaterialInputCard {
    value: string;
    readonly defaultValue: string;
    readonly props: MaterialInputCardProps;

    private _state: MaterialInputCardState = MaterialInputCardState.Blank;
    get state(): MaterialInputCardState {
        return this._state;
    }
    set state(value: MaterialInputCardState) {
        this._state = value;
        if (!!this.elementSet.root) {
            this.elementSet.root.setAttribute(
                "data-state",
                MaterialInputCardState[value].toLowerCase()
            );
        }
    }

    private elementSet: Partial<{
        root: JSX.Element;
        input: JSX.Element;
        inputBox: {
            element: JSX.Element;
            components: MaterialTextInputComponents;
        };
        inputSubmit: JSX.Element;
        inputCancel: JSX.Element;
        loading: JSX.Element;
        loadingText: JSX.Element;
        main: JSX.Element;
    }> = {};

    protected constructor(props: MaterialInputCardProps) {
        this.props = props;
        this.defaultValue = props.value;
    }

    /**
     * Only called once: when the element is being appended to the document.
     */
    renderInput(): JSX.Element {
        let inputElement;
        const el = (
            <div class={"rw-mdc-inputCard-input"}>
                {
                    (inputElement = (
                        <MaterialTextInput
                            width={"400px"}
                            label={this.props.label}
                        />
                    ))
                }
                {
                    (this.elementSet.inputSubmit = (
                        <MaterialIconButton
                            icon={this.props.submitIcon ?? "send"}
                            onClick={() => {
                                this.change(
                                    this.elementSet.inputBox.components
                                        .textField.value
                                );
                            }}
                            disabled
                            data-rw-mdc-tooltip={this.props.i18n?.inputSubmit}
                        />
                    ))
                }
                {
                    (this.elementSet.inputCancel = (
                        <MaterialIconButton
                            icon={this.props.cancelIcon ?? "cancel"}
                            onClick={() => {
                                this.cancelInput();
                            }}
                            data-rw-mdc-tooltip={this.props.i18n?.inputCancel}
                        />
                    ))
                }
            </div>
        );

        this.elementSet.inputBox = {
            element: inputElement,
            components: MaterialTextInputUpgrade(inputElement)
        };

        this.elementSet.inputBox.components.textField.listen(
            "keypress",
            (e) => {
                const value = this.elementSet.inputBox.components.textField
                    .value;
                const empty = value.length === 0;
                if (!empty && e.key === "Enter") {
                    this.change(value);
                }

                this.elementSet.inputSubmit.toggleAttribute("disabled", empty);
            }
        );

        return el;
    }

    /**
     * Called whenever the content of the input card has been modified or when
     * the card is loading the default value.
     */
    renderLoading(): JSX.Element {
        return (
            <div class={"rw-mdc-inputCard-loading"}>
                {
                    (this.elementSet.loadingText = (
                        <div class={"rw-mdc-inputCard-loading__title"}>
                            {this.value}
                        </div>
                    ))
                }
                <div class={"rw-mdc-inputCard-loading__subtitle"}>
                    {this.props.i18n?.loadingText ??
                        `${i18next.t("common:load")}`}
                </div>
            </div>
        );
    }

    /**
     * Only called once: when the element is being appended to the document.
     */
    render(): JSX.Element {
        this.elementSet.root = (
            <div
                class={classMix(
                    "rw-mdc-inputCard",
                    "mdc-card",
                    this.props.outlined ? "mdc-card--outlined" : false,
                    ...(this.props.class ?? [])
                )}
            >
                {(this.elementSet.main = <div class="rw-mdc-inputCard-main" />)}
                {(this.elementSet.input = this.renderInput())}
                {(this.elementSet.loading = this.renderLoading())}
            </div>
        );

        if (!!this.defaultValue) {
            // Default value given, load it in first.
            this.change(this.defaultValue);
        } else {
            // Need to present options.
            this.beginInput();
        }

        return this.elementSet.root;
    }

    replaceMain(newMain: JSX.Element): void {
        if (this.elementSet.main == null) return;
        this.elementSet.main.parentElement.replaceChild(
            newMain,
            this.elementSet.main
        );
        newMain.classList.toggle("rw-mdc-inputCard-main", true);
        this.elementSet.main = newMain;
    }

    /**
     * Hoists the input screen.
     */
    beginInput(): void {
        if (this.value) {
            this.elementSet.inputSubmit.toggleAttribute("disabled", false);
            this.elementSet.inputCancel.style.display = "";
            this.elementSet.inputBox.components.textField.value = this.value;
        } else this.elementSet.inputCancel.style.display = "none";
        this.state = MaterialInputCardState.Input;
        this.elementSet.inputBox.components.textField.focus();
    }

    /**
     * Cancels input and immediately returns to the main screen.
     */
    cancelInput(): void {
        this.state = MaterialInputCardState.Ready;
    }

    /**
     * Changes the current value and hoists the loading screen if a blocking
     * task is being done.
     *
     * @param newValue The new value of the card.
     */
    change(newValue: string): void {
        if (newValue === this.value) {
            this.state = MaterialInputCardState.Ready;
            return;
        }

        this.value = newValue;
        this.elementSet.inputCancel.toggleAttribute("disabled", false);

        const newMain = this.renderMain(newValue);
        if (newMain instanceof Promise) {
            this.state = MaterialInputCardState.Loading;
            this.elementSet.loadingText.innerText = newValue;
            newMain
                .then((element: JSX.Element) => {
                    this.replaceMain(element);
                    this.state = MaterialInputCardState.Ready;
                })
                .catch((e) => {
                    this.beginInput();
                    RedWarnUI.Toast.quickShow({
                        content: i18next.t("mediawiki:error.apiError")
                    });
                    Log.error("Failed to run `renderMain`.", e);
                });
        } else {
            this.replaceMain(newMain);
            this.state = MaterialInputCardState.Ready;
        }
    }

    /**
     * Called whenever the content of the input card has been modified. If the
     * returned value is a promise, a loading screen will be shown first before
     * the main content is rendered to the dom. If the card was created without
     * a default value, this is not called when the card is rendered.
     *
     * The returned value of this function should be disposable; they are not
     * supposed to be stored or kept as they will be deleted after re-render.
     */
    abstract renderMain(value: string): PromiseOrNot<HTMLDivElement>;
}
