import {ComponentChild, h as TSX} from "tsx-dom";
import dialogPolyfill from "dialog-polyfill";

import "../styles/mdl-dialog.css";
import {RWUIDialog, RWUIDialogActionType, RWUIDialogProperties} from "../../../ui/RWUIDialog";
import {getMaterialStorage} from "../Material";
import RedWarnStore from "../../../data/RedWarnStore";

const StyleStorage = getMaterialStorage();

/**
 * The MaterialDialog is a handling class used to show dialogs on the screen. This will
 * automatically handle dialog actions, content, etc.
 *
 * To show a dialog on the DOM, use {@link MaterialDialog.show}.
 */
export default class MaterialDialog extends RWUIDialog {

    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @param dialog The {@link MaterialDialog} to show.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    static async show(dialog : MaterialDialog) : Promise<any> {
        StyleStorage.dialogTracker.set(dialog.id, dialog);

        document.body.appendChild(dialog.render());

        // Polyfill (required for all skins).
        if (dialogPolyfill != null && !(dialog.element as HTMLDialogElement).showModal) {
            dialogPolyfill.registerDialog(dialog.element);
        }

        // Upgrade the newly-inserted MDL element.
        componentHandler.upgradeDom();

        // Show!
        dialog.element.showModal();

        return new Promise((resolve) => {
            dialog.element.addEventListener("close", () => {
                const res = StyleStorage.dialogTracker.get(dialog.id).result;
                StyleStorage.dialogTracker.delete(dialog.id);
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
    props : RWUIDialogProperties;
    /**
     * The HTMLDialogElement which contains the actual dialog.
     */
    element? : HTMLDialogElement;

    constructor(props : RWUIDialogProperties) {
        super(props);
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
            switch (action.type) {
                case RWUIDialogActionType.Close:
                    break;
                case RWUIDialogActionType.Execute:
                case RWUIDialogActionType.Finish:
                    buttonClasses.push("mdl-button--raised");
                    buttonClasses.push("mdl-button--colored");
                    break;
            }
            let text;
            if (action.text)
                text = action.text;
            else
                switch (action.type) {
                    case RWUIDialogActionType.Close:
                        text = action.text ?? "Close"; break;
                    case RWUIDialogActionType.Finish:
                        text = action.text ?? "Finish"; break;
                }

            const buttonElement = <button class={buttonClasses.join(" ")}>
                {text}
            </button>;

            switch (action.type) {
                // Do the action before closing.
                case RWUIDialogActionType.Finish:
                    buttonElement.addEventListener("click", (event) => {
                        if (action.action)
                            this._result = action.action.call(this, event);
                        this.element.close();
                        setTimeout(() => { this.element.remove(); }, 1000);
                    });
                    break;
                // Close and then do the action.
                case RWUIDialogActionType.Close:
                    buttonElement.addEventListener("click", (event) => {
                        this.element.close();
                        setTimeout(() => { this.element.remove(); }, 1000);
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