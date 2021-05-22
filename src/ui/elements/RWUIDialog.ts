import { ComponentChild } from "tsx-dom";
import generateId from "rww/util/generateId";
import RWUIElement, { RWUIElementProperties } from "./RWUIElement";
import { RollbackContext } from "rww/definitions/RollbackContext";
import { User } from "rww/mediawiki/User";
import { Warning, WarningOptions } from "rww/mediawiki/Warnings";
import { Dependency } from "rww/data/Dependencies";
import { Page } from "rww/mediawiki";

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
export abstract class RWUIDialog extends RWUIElement {
    /**
     * A unique identifier for this dialog, to allow multiple active dialogs.
     */
    id: string;

    /**
     * The HTMLDialogElement which contains the actual dialog.
     */
    element?: HTMLDialogElement;

    protected _result: any;
    /**
     * The result of the dialog.
     */
    get result() {
        return this._result;
    }

    protected constructor(readonly props: RWUIDialogProperties) {
        super();
        this.id = `dialog__${props.id || generateId(16)}`;
    }

    /**
     * Shows the dialog as a modal.
     */
    abstract show(): Promise<any>;

    /**
     * Renders the dialog. This only creates the dialog body, and does not show
     * it as a modal.
     */
    abstract render(): HTMLDialogElement;
}

export interface RWUIAlertDialogProps extends RWUIDialogProperties {
    /**
     * The actions of the dialog. These go at the bottom of the dialog.
     */
    actions: RWUIDialogAction[];
    /**
     * The content of the dialog.
     */
    content?: ComponentChild;
    /**
     * Optional raw content, for errors etc. Will be wrapped in a <pre>
     */
    preformattedContent?: string;
}

export class RWUIAlertDialog extends RWUIDialog {
    show(): Promise<string> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwAlertDialog";

    constructor(readonly props: RWUIAlertDialogProps) {
        super(props);
    }

    protected _result: string;
}

export interface RWIconButton {
    icon: string;
    action?: (this: HTMLElement, event: MouseEvent) => any;
}

export interface OKCancelActions {
    ok?: string;
    cancel?: string;
}

export interface RWUIInputDialogProps extends RWUIDialogProperties {
    label: string;
    defaultText?: string;
    leadingIcon?: RWIconButton;
    trailingIcon?: RWIconButton;
    helperText?: string;
    maxCharacterCount?: number;
    prefix?: string;
    suffix?: string;
    /**
     * The actions of the dialog. These go at the bottom of the dialog.
     */
    actions?: OKCancelActions;
}

export class RWUIInputDialog extends RWUIDialog {
    show(): Promise<string> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwInputDialog";

    constructor(readonly props: RWUIInputDialogProps) {
        super(props);
    }

    protected _result: string;
}

export interface RWUISelectionDialogItem {
    icon?: string;
    iconColor?: string;
    color?: string;
    content: string;
    data: string;
    action?: (event: Event) => any;
}

export interface RWUISelectionDialogProps extends RWUIDialogProperties {
    title: string;
    items: RWUISelectionDialogItem[];
}

export class RWUISelectionDialog extends RWUIDialog {
    show(): Promise<string> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwSelectionDialog";

    constructor(readonly props: RWUISelectionDialogProps) {
        super(props);
    }

    protected _result: string;
}

export interface RWUIWarnDialogProps extends RWUIDialogProperties {
    rollbackContext?: RollbackContext;
    targetUser?: User;
    defaultWarnReason?: Warning;
    defaultWarnLevel?: number;
    relatedPage?: Page;
}

export class RWUIWarnDialog extends RWUIDialog {
    show(): Promise<WarningOptions> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwWarnDialog";

    constructor(readonly props: RWUIWarnDialogProps) {
        super(props);
    }

    protected _result: WarningOptions;
}

export interface RWUIIFrameDialogProps extends RWUIDialogProperties {
    /**
     * The height of the dialog in whatever CSS unit specified.
     */
    height?: string;
    src: string;
    fragment?: string;
    dependencies?: Dependency[];
    customStyle?: string | string[];
    customScripts?: string | string[];
    actions?: RWUIDialogAction[];

    /**
     * Whether or not to disable RedWarn in the IFrame. This is intended
     * for events where a MediaWiki page of the same wiki is loaded, causing
     * the RedWarn userscript to load as well.
     *
     * This should always append the `rw-disable` class onto the body.
     */
    disableRedWarn?: boolean;
}

export class RWUIIFrameDialog extends RWUIDialog {
    show(): Promise<any> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwIFrameDialog";

    constructor(readonly props: RWUIIFrameDialogProps) {
        super(props);
    }
}
