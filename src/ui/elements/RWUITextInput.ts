import { RWIconButton } from "app/ui/elements/RWUIDialog";
import { RWUIElementProperties } from "app/ui/elements/RWUIElement";

export interface RWUITextInputProperties extends RWUIElementProperties {
    /**
     * The label of this input field.
     */
    label: string;
    /**
     * The ID for this input field.
     */
    id?: string;
    /**
     * Extra classes for this input field.
     */
    class?: string;
    /**
     * Default text for the input field.
     */
    defaultText?: string;
    /**
     * The type of the input box.
     */
    type?: string;
    /**
     * Leading icon for the input field. Can also have an action.
     */
    leadingIcon?: RWIconButton;
    /**
     * Trailing icon for the input field. Can also have an action.
     */
    trailingIcon?: RWIconButton;
    /**
     * Text shown below the input field when active.
     */
    helperText?: string;
    /**
     * Maximum number of characters.
     */
    maxCharacterCount?: number;
    /**
     * Required text prefix.
     */
    prefix?: string;
    /**
     * Required text suffix.
     */
    suffix?: string;
    /**
     * Width of the input field.
     */
    width?: string;
    /**
     * Height of the input field.
     */
    height?: string;
    /**
     * Extra style data.
     */
    style?: Record<string, any>;
    /**
     * Use the outlined style of box.
     */
    outlined?: boolean;
    /**
     * Use a multiline textarea instead of an input.
     */
    area?: boolean;
    /**
     * Whether to focus upon DOM insertion.
     */
    autofocus?: boolean;
    /**
     * Whether the contents of this input is required.
     */
    required?: boolean;
    /**
     * Action to perform on click.
     */
    onInput?: (text: string, event: Event) => void;
}
