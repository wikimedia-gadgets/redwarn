import { ComponentChild, h as TSX } from "tsx-dom";

// import "../styles/mdl-dialog.css";
import {
    RWUIDialog,
    RWUIDialogActionType,
    RWUIDialogProperties,
} from "../../../ui/RWUIDialog";
import { getMaterialStorage } from "../Material";
import RedWarnStore from "../../../data/RedWarnStore";

import { MDCRipple } from "@material/ripple";
import { MDCDialog } from "@material/dialog";

const StyleStorage = getMaterialStorage();

/**
 * The MaterialDialog is a handling class used to show dialogs on the screen. This will
 * automatically handle dialog actions, content, etc.
 *
 * To show a dialog on the DOM, use {@link MaterialDialog.show}.
 */
export default class MaterialDialog extends RWUIDialog {
    get elementName(): typeof RWUIDialog.elementName {
        return RWUIDialog.elementName;
    }
    get prototype(): typeof MaterialDialog {
        return MaterialDialog;
    }

    /**
     * A unique identifier for this dialog, to allow multiple active dialogs.
     */
    id: string;
    /**
     * The properties of this MaterialDialog.
     */
    props: RWUIDialogProperties;
    /**
     * The HTMLDialogElement which contains the actual dialog.
     */
    element?: HTMLDialogElement;

    constructor(props: RWUIDialogProperties) {
        super(props);
        this.id = `dialog__${
            props.id ||
            RedWarnStore.random.string({
                length: 16,
                symbols: false,
                alpha: true,
            })
        }`;
        this.props = props;
    }

    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    async show(): Promise<any> {
        StyleStorage.dialogTracker.set(this.id, this);

        document.body.appendChild(this.render());

        // Upgrade the newly-inserted MDC element.
        new MDCRipple(this.element.querySelector("button"));
        const dialog = new MDCDialog(this.element);
        dialog.open();

        return new Promise((resolve) => {
            this.element.addEventListener("close", () => {
                const res = StyleStorage.dialogTracker.get(this.id).result;
                StyleStorage.dialogTracker.delete(this.id);
                resolve(res);
            });
        });
    }

    /**
     * Renders the MaterialDialog's actions (as buttons).
     * @return A collection of {@link HTMLButtonElement}s, all of which are MDL buttons.
     */
    private renderActions(): ComponentChild[] {
        const buttons = [];
        for (const action of this.props.actions) {
            const buttonClasses = [];
            switch (action.type) {
                case RWUIDialogActionType.Finish:
                    buttonClasses.push("mdc-button--raised");
                    break;
                case RWUIDialogActionType.Close:
                    buttonClasses.push("mdc-button");
                    break;
                case RWUIDialogActionType.Execute:
                    buttonClasses.push("mdc-button");
                    buttonClasses.push("mdc-button-outlined");
                    break;
            }

            const buttonElement = (
                <button class={buttonClasses.join(" ")}>
                    <div class="mdc-button__ripple" />
                    <span class="mdc-button__label">{action.text}</span>
                </button>
            );

            switch (action.type) {
                // Do the action before closing.
                case RWUIDialogActionType.Finish:
                    buttonElement.addEventListener("click", (event) => {
                        if (action.action)
                            this._result = action.action.call(this, event);
                        this.element.close();
                        setTimeout(() => {
                            this.element.remove();
                        }, 1000);
                    });
                    break;
                // Close and then do the action.
                case RWUIDialogActionType.Close:
                    buttonElement.addEventListener("click", (event) => {
                        this.element.close();
                        setTimeout(() => {
                            this.element.remove();
                        }, 1000);
                        if (action.action)
                            this._result = action.action.call(this, event);
                    });
                    break;
                // Do the action without closing.
                case RWUIDialogActionType.Execute:
                    buttonElement.addEventListener("click", (event) => {
                        if (action.action)
                            this._result = action.action.call(this, event);
                    });
                    break;
            }

            buttons.push(buttonElement);
        }

        return buttons;
    }

    /**
     * Renders a MaterialDialog.
     *
     * NOTE: Only use this when appending to body! Otherwise, use {@link MaterialDialog.element}.
     * @returns An {@link HTMLDialogElement}.
     */
    render(): Element {
        this.element = (
            <dialog
                id={this.id}
                class="mdc-dialog"
                style={`width: ${this.props.width ?? "30vw"};`}
            >
                <div class="mdc-dialog__container">
                    {this.props.title && (
                        <h2 class="mdc-dialog__title">{this.props.title}</h2>
                    )}
                    {this.props.content && (
                        <div class="mdc-dialog__content">
                            {...this.props.content}
                        </div>
                    )}
                    {this.props.actions && (
                        <div class="mdl-dialog__actions">
                            {this.renderActions()}
                        </div>
                    )}
                </div>
                <div class="mdc-dialog__scrim" />
            </dialog>
        ) as HTMLDialogElement;

        return this.element;
    }
}
