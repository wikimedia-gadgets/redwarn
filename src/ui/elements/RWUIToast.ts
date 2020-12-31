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

export abstract class RWUIToast extends RWUIElement {
    public static readonly elementName = "rwToast";

    /**
     * A unique identifier for this dialog, to allow multiple active toasts.
     */
    id: string;

    /**
     * The HTMLDivElement which contains the actual toast.
     */
    element?: HTMLDivElement;

    protected constructor(readonly props: RWUIToastProperties) {
        super();
        this.id = `toast__${props.id || generateId(16)}`;
        this.props.style ??= RWUIToastStyle.Normal;
    }

    /**
     * Shows the toast.
     */
    abstract show(): Promise<void>;

    /**
     * Renders the toast. This only creates the toast body, and does not show
     * it.
     */
    abstract render(): HTMLDivElement;
}
