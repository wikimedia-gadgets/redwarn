import { ComponentChild, h as TSX } from "tsx-dom";
import RedWarnStore from "../data/RedWarnStore";
import dialogPolyfill from "dialog-polyfill";

import "../styles/mdl-dialog.css";

export enum MaterialDialogActionType {
    /**
     * The task is finished and the dialog will close after button press.
     */
    Finish,
    /**
     * The dialog will close after button press, then the optional task will be executed.
     */
    Close,
    /**
     * A task will execute synchronously and will not close the dialog.
     */
    Execute
}

interface MaterialDialogFinishAction {
    type: MaterialDialogActionType.Finish;
    text?: string;
}
interface MaterialDialogCloseAction {
    type: MaterialDialogActionType.Close;
    text?: string;
}
interface MaterialDialogExecuteAction {
    type: MaterialDialogActionType.Execute;
    text: string;
}

/**
 * A MaterialDialogAction is an action that may be executed with a button inside of a MaterialDialog.
 */
export type MaterialDialogAction =
    (MaterialDialogFinishAction | MaterialDialogCloseAction | MaterialDialogExecuteAction) & {
    action?: (this: MaterialDialog, event : MouseEvent) => void,
    style?: "flat" /* default */ | "raised" | "colored" | "accent" | "flatcolored" | "flataccent"
};

export interface MaterialDialogProperties {

    /**
     * The content of the MaterialDialog.
     */
    content?: ComponentChild[];
    /**
     * The actions of the MaterialDialog. These go at the bottom of the dialog.
     */
    actions?: MaterialDialogAction[];
    /**
     * The width of the dialog in whatever CSS unit specified.
     *
     * @default 30vw
     */
    width?: string;

    id?: string;

}

/**
 * The MaterialDialog is a handling class used to show dialogs on the screen. This will
 * automatically handle dialog actions, content, etc.
 *
 * To show a dialog on the DOM, use {@link MaterialDialog.show}.
 */
export default class MaterialDialog {

    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @param dialog The {@link MaterialDialog} to show.
     * @returns The result - the value returned by the selected button in {@link MaterialDialogProperties.actions}.
     */
    static async show(dialog : MaterialDialog) : Promise<any> {
        RedWarnStore.dialogTracker.set(dialog.id, dialog);

        document.body.appendChild(dialog.render());

        // Polyfill
        if (dialogPolyfill != null && !(dialog.element as HTMLDialogElement).showModal) {
            dialogPolyfill.registerDialog(dialog.element);
        }

        // Upgrade the newly-inserted MDL element.
        componentHandler.upgradeDom();

        // Show!
        dialog.element.showModal();

        return new Promise((resolve) => {
            dialog.element.addEventListener("close", () => {
                const res = RedWarnStore.dialogTracker.get(dialog.id).result;
                RedWarnStore.dialogTracker.delete(dialog.id);
                resolve(res);
            });
        });
    }

    /**
     * A unique identifier for this dialog, to allow multiple active dialogs.
     */
    id : string;
    /**
     * The properties of this MaterialDialog.
     */
    props : MaterialDialogProperties;
    /**
     * The HTMLDialogElement which contains the actual dialog.
     */
    element? : HTMLDialogElement;

    private _result : any;
    /**
     * The result of this dialog. This is the result of the action call.
     */
    get result() : any { return this._result; }

    constructor(props : MaterialDialogProperties) {
        this.id = `dialog__${props.id || RedWarnStore.random.string({length: 16, symbols: false, alpha: true})}`;
        this.props = props;
    }

    /**
     * Renders the MaterialDialog's actions (as buttons).
     * @return A collection of {@link HTMLButtonElement}s, all of which are MDL buttons.
     */
    private renderActions() : ComponentChild[] {
        const buttons = [];
        for (const action of this.props.actions) {
            const buttonClasses = ["mdl-button", "mdl-js-button", "mdl-js-ripple-effect"];
            switch (action.style) {
                case "colored":
                    buttonClasses.push("mdl-button--raised");
                    buttonClasses.push("mdl-button--colored");
                    break;
                case "accent":
                    buttonClasses.push("mdl-button--raised");
                    buttonClasses.push("mdl-button--accent");
                    break;
                case "flatcolored":
                    buttonClasses.push("mdl-button--colored");
                    break;
                case "flataccent":
                    buttonClasses.push("mdl-button--accent");
                    break;
                case "raised":
                    buttonClasses.push("mdl-button--raised");
            }
            let text;
            if (action.text)
                text = action.text;
            else
                switch (action.type) {
                    case MaterialDialogActionType.Close:
                        text = action.text ?? "Close"; break;
                    case MaterialDialogActionType.Finish:
                        text = action.text ?? "Finish"; break;
                }

            const buttonElement = <button class={buttonClasses.join(" ")}>
                {text}
            </button>;

            switch (action.type) {
                // Do the action before closing.
                case MaterialDialogActionType.Finish:
                    buttonElement.addEventListener("click", (event) => {
                        if (action.action)
                            this._result = action.action.call(this, event);
                        this.element.close();
                        setTimeout(() => { this.element.remove(); }, 1000);
                    });
                    break;
                // Close and then do the action.
                case MaterialDialogActionType.Close:
                    buttonElement.addEventListener("click", (event) => {
                        this.element.close();
                        setTimeout(() => { this.element.remove(); }, 1000);
                        if (action.action)
                            this._result = action.action.call(this, event);
                    });
                    break;
                // Do the action without closing.
                case MaterialDialogActionType.Execute:
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
    render() : Element {
        this.element = <dialog
            id={this.id}
            class="mdl-dialog"
            style={`width: ${this.props.width ?? "30vw"};`}>
            {
                this.props.content && <div class="mdl-dialog__content">
                    {...this.props.content}
                </div>
            }
            {
                this.props.actions && <div class="mdl-dialog__actions">
                    {this.renderActions()}
                </div>
            }
        </dialog> as HTMLDialogElement;

        return this.element;
    }

}