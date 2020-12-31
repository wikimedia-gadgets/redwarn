import generateId from "rww/util/generateId";
import RWUIElement, { RWUIElementProperties } from "./RWUIElement";

export interface RWUIToastProperties extends RWUIElementProperties {
    content: string;
    action?: RWUIToastAction;
    /**
     * Used to track displayed dialogs.
     * @internal
     */
    id?: string;
    style?: RWUIToastStyle;
}

export interface RWUIToastAction {
    callback: () => any;
    text: string;
}

export enum RWUIToastStyle {
    /** The default. Centered on the bottom of the screen, one line only. */
    Normal = 0,
    /** On the leading edge of the screen (left in LTR, right in RTL) instead of centered. */
    Leading,
    /** Positions the button under the text */
    Stacked,
}

export class RWUIToast extends RWUIElement {
    public static readonly elementName = "rwToast";

    /**
     * A unique identifier for this dialog, to allow multiple active toasts.
     */
    id: string;

    /**
     * The HTMLDivElement which contains the actual toast.
     */
    element?: HTMLDivElement;

    constructor(readonly props: RWUIToastProperties) {
        super();
        this.id = `toast__${props.id || generateId(16)}`;
        this.props.style ??= RWUIToastStyle.Normal;
    }

    /**
     * Shows the toast.
     */
    show(): Promise<void> {
        throw new Error("Attempted to call abstract method");
    }

    /**
     * Renders the toast. This only creates the toast body, and does not show
     * it.
     */
    render(): HTMLDivElement {
        throw new Error("Attempted to call abstract method");
    }
}
