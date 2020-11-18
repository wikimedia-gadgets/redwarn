import RWUIElement, { RWUIElementProperties } from "./RWUIElement";
import { ComponentChild } from "tsx-dom";

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
    data: string;
    text?: string;
    action?: (this: RWUIDialogAction, event: MouseEvent) => void;
}

export type RWUIDialogID = string;

export interface RWUIDialogProperties extends RWUIElementProperties {
    /**
     * The title of the dialog.
     */
    title?: string;
    /**
     * The content of the dialog.
     */
    content?: ComponentChild[];
    /**
     * The actions of the dialog. These go at the bottom of the dialog.
     */
    actions?: RWUIDialogAction[];
    /**
     * The width of the dialog in whatever CSS unit specified.
     *
     * @default 30vw
     */
    width?: string;

    id?: RWUIDialogID;
}

/**
 * The RWUIDialog is a dialog that can be displayed as a modal onscreen. This
 * differs from normal elements, which are usually inserted using
 * {@link document.appendChild}, as the dialog is shown using {@link show} instead.
 */
export class RWUIDialog extends RWUIElement {
    public static elementName: "rwDialog" = "rwDialog";

    protected _result: any;
    /**
     * The result of the dialog.
     */
    get result(): any {
        return this._result;
    }

    public constructor(readonly properties: RWUIDialogProperties) {
        super(properties);
    }

    /**
     * Shows the dialog as a modal.
     */
    async show(): Promise<void> {
        throw new Error(
            "The base element cannot be used as a spawnable element."
        );
    }

    /**
     * Renders the dialog. This only creates the dialog body, and does not show
     * it as a modal.
     */
    render(): Element {
        throw new Error("Illegal attempt made to render the base element.");
    }
}
