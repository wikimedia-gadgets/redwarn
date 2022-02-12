import { BaseProps, h } from "tsx-dom";
import { RWIconButton } from "rww/ui/elements/RWUIDialog";
import { generateId } from "rww/util";
import { MDCTextField } from "@material/textfield";
import { MDCTextFieldCharacterCounter } from "@material/textfield/character-counter";
import { MDCTextFieldIcon } from "@material/textfield/icon";
import { MDCTextFieldHelperText } from "@material/textfield/helper-text";
import toCSS from "rww/styles/material/util/toCSS";
import classMix from "rww/styles/material/util/classMix";

interface MaterialTextInputProps extends BaseProps {
    id?: string;
    class?: string;
    label: string;
    defaultText?: string;
    leadingIcon?: RWIconButton;
    trailingIcon?: RWIconButton;
    helperText?: string;
    maxCharacterCount?: number;
    prefix?: string;
    suffix?: string;
    width?: string;
    outlined?: boolean;
    area?: boolean;
    autofocus?: boolean;
    required?: boolean;
}

// Private storage variable. No need to put it into {@link MaterialStyleStorage}.
const MaterialTextInputTrack = new Map<
    string,
    {
        element: JSX.Element;
        props: MaterialTextInputProps;
        components: MaterialTextInputComponents | null;
    }
>();

/**
 * Creates an MDC TextInput field. This field is not upgraded on its own. To
 * upgrade the text field, pass the text field as properties to
 * {@link MaterialTextInputUpgrade}
 *
 * @param props Properties for the TextInput box.
 */
export default function (props: MaterialTextInputProps): JSX.Element {
    const id = props.id ?? generateId(8);
    const element = (
        <span data-mdc-textinput={id} class={props.class}>
            <label
                style={toCSS({
                    width: props.width ?? "100%",
                })}
                class={classMix(
                    "rw-mdc-full-width",
                    "mdc-text-field",
                    props.outlined
                        ? "mdc-text-field--outlined"
                        : "mdc-text-field--filled",
                    props.leadingIcon && "mdc-text-field--with-leading-icon",
                    props.trailingIcon && "mdc-text-field--with-trailing-icon",
                    props.area && "mdc-text-field--textarea"
                )}
            >
                {props.outlined ? (
                    <span class="mdc-notched-outline">
                        <span class="mdc-notched-outline__leading" />
                        <span class="mdc-notched-outline__notch">
                            <span
                                class="mdc-floating-label"
                                htmlFor={`${id}_input`}
                            >
                                {props.label}
                            </span>
                        </span>
                        <span class="mdc-notched-outline__trailing" />
                    </span>
                ) : (
                    <span class="mdc-floating-label">{props.label}</span>
                )}
                {!props.outlined && <span class="mdc-text-field__ripple" />}
                {props.prefix && (
                    <span class="mdc-text-field__affix mdc-text-field__affix--prefix">
                        {props.prefix}
                    </span>
                )}
                {props.leadingIcon && (
                    <i
                        class="material-icons mdc-text-field__icon mdc-text-field__icon--leading"
                        id={`${id}_leadIcon`}
                        {...(props.leadingIcon.action && {
                            tabIndex: 0,
                            role: "button",
                            onClick: props.leadingIcon.action,
                        })}
                    >
                        {props.leadingIcon.icon}
                    </i>
                )}
                {!!props.area ? (
                    <textarea
                        class="mdc-text-field__input"
                        id={`${id}_input`}
                        {...(props.helperText && {
                            "aria-controls": `${id}_helper`,
                            "aria-describedby": `${id}_helper`,
                        })}
                        {...(props.defaultText && {
                            value: props.defaultText,
                        })}
                        {...(props.maxCharacterCount && {
                            maxLength: props.maxCharacterCount,
                        })}
                        {...(props.autofocus && {
                            autofocus: true,
                        })}
                        {...(props.required && {
                            required: true,
                        })}
                    />
                ) : (
                    <input
                        type="text"
                        class="mdc-text-field__input"
                        id={`${id}_input`}
                        {...(props.helperText && {
                            "aria-controls": `${id}_helper`,
                            "aria-describedby": `${id}_helper`,
                        })}
                        {...(props.defaultText && {
                            value: props.defaultText,
                        })}
                        {...(props.maxCharacterCount && {
                            maxLength: props.maxCharacterCount,
                        })}
                        {...(props.autofocus && {
                            autofocus: true,
                        })}
                        {...(props.required && {
                            required: true,
                        })}
                    />
                )}
                {props.trailingIcon && (
                    <i
                        class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
                        id={`${id}_trailIcon`}
                        {...(props.trailingIcon.action && {
                            tabIndex: 0,
                            role: "button",
                            onClick: props.trailingIcon.action,
                        })}
                    >
                        {props.trailingIcon.icon}
                    </i>
                )}
                {props.suffix && (
                    <span class="mdc-text-field__affix mdc-text-field__affix--suffix">
                        {props.suffix}
                    </span>
                )}
                {!props.outlined && <span class="mdc-line-ripple" />}
            </label>
            <div class="mdc-text-field-helper-line">
                {props.helperText ? (
                    <div
                        id={`${id}_helper`}
                        class="mdc-text-field-helper-text"
                        aria-hidden="true"
                    >
                        {props.helperText}
                    </div>
                ) : null}
                {props.maxCharacterCount ? (
                    <div
                        id={`${id}_char`}
                        class="mdc-text-field-character-counter"
                    >
                        0 / {props.maxCharacterCount}
                    </div>
                ) : null}
            </div>
        </span>
    );
    MaterialTextInputTrack.set(id, {
        element: element,
        props: props,
        components: null,
    });
    return element;
}

export interface MaterialTextInputComponents {
    element: JSX.Element;
    textField: MDCTextField;
    characterCounter?: MDCTextFieldCharacterCounter;
    leadingIcon?: MDCTextFieldIcon;
    trailingIcon?: MDCTextFieldIcon;
    helperText?: MDCTextFieldHelperText;
}

/**
 * Upgrades an existing MaterialTextInput and returns related MDC components.
 * @param element
 */
export function MaterialTextInputUpgrade(
    element: JSX.Element
): MaterialTextInputComponents {
    if (!element.hasAttribute("data-mdc-textinput"))
        throw new Error("Not a valid MaterialTextInput");

    const trackingObject = MaterialTextInputTrack.get(
        element.getAttribute("data-mdc-textinput")
    );
    const { props } = trackingObject;
    const components: MaterialTextInputComponents = {
        element,
        textField: new MDCTextField(element.querySelector(".mdc-text-field")),
    };
    components.textField.initialize();

    const textInputId = element.getAttribute("data-mdc-textinput");

    components.characterCounter =
        props.maxCharacterCount &&
        new MDCTextFieldCharacterCounter(
            element.querySelector(".mdc-text-field-character-counter")
        );
    components.characterCounter?.initialize();

    components.leadingIcon =
        props.leadingIcon &&
        new MDCTextFieldIcon(element.querySelector(`#${textInputId}_leadIcon`));
    components.leadingIcon?.initialize();

    components.trailingIcon =
        props.trailingIcon &&
        new MDCTextFieldIcon(
            element.querySelector(`#${textInputId}_trailIcon`)
        );
    components.trailingIcon?.initialize();

    components.helperText =
        props.helperText &&
        new MDCTextFieldHelperText(
            element.querySelector(".mdc-text-field-helper-text")
        );
    components.helperText?.initialize();

    trackingObject["components"] = components;

    element.classList.add("rw-mdc--upgraded");

    return components;
}
