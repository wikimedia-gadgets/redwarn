import {ComponentChild, h as TSX} from "tsx-dom";

// import "../styles/mdl-dialog.css";
import {RWUIDialog, RWUIDialogProperties} from "../../../ui/RWUIDialog";
import RedWarnStore from "../../../data/RedWarnStore";

import {MDCRipple} from "@material/ripple";
import {MDCDialog} from "@material/dialog";
import {getMaterialStorage} from "../storage/MaterialStyleStorage";

/* TODO: Create a handling MaterialDialog which will create a specialized dialog based on
         the input type. */
/**
 * The MaterialAlertDialog is a handling class used to show dialogs on the screen. This will
 * automatically handle dialog actions, content, etc.
 *
 * To show a dialog on the DOM, use {@link MaterialAlertDialog.show}.
 */
export default class MaterialAlertDialog extends RWUIDialog {

    get elementName() : typeof RWUIDialog.elementName { return RWUIDialog.elementName; }
    get prototype() : typeof MaterialAlertDialog { return MaterialAlertDialog; }

    /**
     * A unique identifier for this dialog, to allow multiple active dialogs.
     */
    id : string;
    /**
     * The properties of this MaterialAlertDialog.
     */
    props : RWUIDialogProperties;
    /**
     * The HTMLDialogElement which contains the actual dialog.
     */
    element? : HTMLDialogElement;

    public constructor(props : RWUIDialogProperties) {
        super(props);
        this.id = `dialog__${props.id || RedWarnStore.random.string({length: 16, symbols: false, alpha: true})}`;
        this.props = props;
    }

    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    async show() : Promise<any> {
        const styleStorage = getMaterialStorage();
        styleStorage.dialogTracker.set(this.id, this);

        document.body.appendChild(this.render());

        console.log(this.element);

        // Upgrade the newly-inserted MDC element.
        new MDCRipple(this.element.querySelector("button"));
        const dialog = new MDCDialog(this.element);
        dialog.open();

        return new Promise((resolve) => {
            dialog.listen("MDCDialog:closed", (event : Event & { detail: { action: string; }}) => {
                this._result = event.detail.action;
                const res = styleStorage.dialogTracker.get(this.id).result;
                styleStorage.dialogTracker.delete(this.id);
                resolve(res);
            });
        });
    }

    /**
     * Renders the MaterialAlertDialog's actions (as buttons).
     * @return A collection of {@link HTMLButtonElement}s, all of which are MDL buttons.
     */
    private renderActions() : ComponentChild[] {
        const buttons : ComponentChild[] = [];
        for (const action of this.props.actions) {
            buttons.push(
                <button
                    type="button"
                    class="mdc-button mdc-dialog__button"
                    data-mdc-dialog-action={action.data}>
                    <div class="mdc-button__ripple"/>
                    <span class="mdc-button__label">{action.text ?? action.data}</span>
                </button>
            );
        }

        return buttons;
    }

    /**
     * Renders a MaterialAlertDialog.
     *
     * NOTE: Only use this when appending to body! Otherwise, use {@link MaterialAlertDialog.element}.
     * @returns An {@link HTMLDialogElement}.
     */
    render() : Element {
        this.element = <div
            id={this.id}
            class="mdc-dialog">
            <div class="mdc-dialog__container">
                <div class="mdc-dialog__surface"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby={this.props.title ?? "RedWarn dialog"}
                    style={`width: ${this.props.width ?? "30vw"};`}>
                    {
                        this.props.title && <h2 class="mdc-dialog__title">
                            {this.props.title}
                        </h2>
                    }
                    {
                        this.props.content && <div class="mdc-dialog__content">
                            {...this.props.content}
                        </div>
                    }
                    {
                        this.props.actions && <div class="mdl-dialog__actions">
                            {this.renderActions()}
                        </div>
                    }
                </div>
            </div>
            <div class="mdc-dialog__scrim"/>
        </div> as HTMLDialogElement;

        return this.element;
    }

}