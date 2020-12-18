import { ComponentChild, h as TSX } from "tsx-dom";

// import "../styles/mdl-dialog.css";
import { RWUIDialog, RWUIDialogProperties } from "../../../ui/RWUIDialog";
import RedWarnStore from "../../../data/RedWarnStore";

import { MDCRipple } from "@material/ripple";
import { MDCDialog } from "@material/dialog";
import { getMaterialStorage } from "../storage/MaterialStyleStorage";
import MaterialButton from "./MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";

/* TODO: Create a handling MaterialDialog which will create a specialized dialog based on
                             the input type. */
/**
 * The MaterialAlertDialog is a handling class used to show dialogs on the screen. This will
 * automatically handle dialog actions, content, etc.
 *
 * To show a dialog on the DOM, use {@link MaterialAlertDialog.show}.
 */
export default class MaterialAlertDialog extends RWUIDialog {
    /**
     * A unique identifier for this dialog, to allow multiple active dialogs.
     */
    id: string;
    /**
     * The properties of this MaterialAlertDialog.
     */
    props: RWUIDialogProperties;
    /**
     * The HTMLDialogElement which contains the actual dialog.
     */
    element?: HTMLDialogElement;

    public constructor(props: RWUIDialogProperties) {
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
        const styleStorage = getMaterialStorage();
        styleStorage.dialogTracker.set(this.id, this);

        document.body.appendChild(this.render());

        console.log(this.element);

        // Upgrade the newly-inserted MDC element.
        new MDCRipple(this.element.querySelector("button"));
        const dialog = new MDCDialog(this.element);
        dialog.open();

        return new Promise((resolve) => {
            dialog.listen(
                "MDCDialog:closed",
                async (event: Event & { detail: { action: string } }) => {
                    const actionSelected = this.props.actions.find(
                        (action) => action.data === event.detail.action
                    );
                    if (actionSelected != null) {
                        this._result =
                            (await actionSelected.action(event)) ??
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

    /**
     * Renders the MaterialAlertDialog's actions (as buttons).
     * @return A collection of {@link HTMLButtonElement}s, all of which are MDL buttons.
     */
    private renderActions(): ComponentChild[] {
        const buttons: ComponentChild[] = [];
        for (const action of this.props.actions) {
            buttons.push(
                <MaterialButton
                    dialogAction={
                        action.text == null
                            ? action.data
                            : {
                                  data: action.data,
                                  text: action.text,
                              }
                    }
                >
                    {action.text ?? action.data}
                </MaterialButton>
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
    render(): Element {
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "style": `width: ${this.props.width ?? "30vw"};`,
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog",
                }}
            >
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                {this.props.content && (
                    <MaterialDialogContent>
                        {...this.props.content}
                    </MaterialDialogContent>
                )}
                <MaterialDialogActions>
                    {this.renderActions()}
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;

        return this.element;
    }
}
