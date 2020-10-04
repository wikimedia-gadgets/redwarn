import RWUIElement from "./RWUIElement";
import {ComponentChild} from "tsx-dom";

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
    Execute
}

interface RWUIDialogFinishAction {
    type: RWUIDialogActionType.Finish;
    text?: string;
}
interface RWUIDialogCloseAction {
    type: RWUIDialogActionType.Close;
    text?: string;
}
interface RWUIDialogExecuteAction {
    type: RWUIDialogActionType.Execute;
    text: string;
}

/**
 * A MaterialDialogAction is an action that may be executed with a button inside of a MaterialDialog.
 */
export type RWUIDialogAction =
    (RWUIDialogFinishAction | RWUIDialogCloseAction | RWUIDialogExecuteAction) & {
    action?: (this: RWUIDialogAction, event : MouseEvent) => void
};

export type RWUIDialogID = string;

export interface RWUIDialogProperties {

    /**
     * The content of the MaterialDialog.
     */
    content?: ComponentChild[];
    /**
     * The actions of the MaterialDialog. These go at the bottom of the dialog.
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

export abstract class RWUIDialog extends RWUIElement<RWUIDialogProperties> {

    static elementName : "rwDialog" = "rwDialog";

    protected _result : any;
    get result() : any { return this._result; }

}