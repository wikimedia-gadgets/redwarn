import random from "rww/util/random";
import RWUIElement, { RWUIElementProperties } from "./RWUIElement";

export enum RWUIDialogActionType {
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
    Execute,
}

/**
 * A MaterialDialogAction is an action that may be executed with a button inside of a MaterialAlertDialog.
 */
export interface RWUIDialogAction {
    /**
     * The action data, returned to MDC when an action is pressed. This
     * should be a simple string for ease of use. If an action is not
     * specified, this will be returned as the dialog result.
     */
    data: string;
    /**
     * The text to use for the button. If unspecified, the button data
     * will be used instead.
     */
    text?: string;
    /**
     * The action that the button runs. This function will be run when
     * a button has been selected, and if it returns a value, that value
     * will be used as the result of the dialog. If not, the button data
     * is used instead.
     * @param event
     */
    action?: (this: RWUIDialogAction, event: Event) => Promise<any> | any;
}

export type RWUIDialogID = string;

export interface RWUIDialogProperties extends RWUIElementProperties {
    /**
     * The title of the dialog.
     */
    title?: string;
    /**
     * The width of the dialog in whatever CSS unit specified.
     */
    width?: string;
    /**
     * Used to track displayed dialogs.
     * @internal
     */
    id?: RWUIDialogID;
}

/**
 * The RWUIDialog is a dialog that can be displayed as a modal onscreen. This
 * differs from normal elements, which are usually inserted using
 * {@link document.appendChild}, as the dialog is shown using {@link show} instead.
 */
export abstract class RWUIDialog<T> extends RWUIElement {
    /**
     * A unique identifier for this dialog, to allow multiple active dialogs.
     */
    id: string;

    /**
     * The HTMLDialogElement which contains the actual dialog.
     */
    element?: HTMLDialogElement;

    protected _result: T;
    /**
     * The result of the dialog.
     */
    get result(): T {
        return this._result;
    }

    protected constructor(readonly props: RWUIDialogProperties = {}) {
        super();
        this.id = `dialog__${props.id ?? random(16)}`;
        this.props = props;
    }

    /**
     * Shows the dialog as a modal.
     */
    abstract show(): Promise<T>;

    /**
     * Renders the dialog. This only creates the dialog body, and does not show
     * it as a modal.
     */
    abstract render(): HTMLDialogElement;
}

export interface RWIconButton {
    icon: string;
    action?: (this: HTMLElement, event: MouseEvent) => any;
}

export interface OKCancelActions {
    ok?: string;
    cancel?: string;
}
