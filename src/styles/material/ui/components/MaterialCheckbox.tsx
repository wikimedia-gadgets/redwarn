import { BaseProps, h } from "tsx-dom";
import { generateId } from "rww/util";
import { MDCCheckbox } from "@material/checkbox";
import i18next from "i18next";
import classMix from "rww/styles/material/util/classMix";
import Log from "rww/data/RedWarnLog";

interface MaterialCheckboxProps extends BaseProps {
    id?: string;
    class?: string;
    disabled?: boolean;
    default?: boolean;
    onChange?: (value: boolean, event: Event) => void;
}

export const MaterialCheckboxTrack = new Map<
    string,
    {
        element: JSX.Element;
        props: MaterialCheckboxProps;
        component: MDCCheckbox | null;
    }
>();

/**
 * Creates an MDC Checkbox field. This field is not upgraded on its own. To
 * upgrade the text field, pass the text field as properties to
 * {@link MaterialCheckboxUpgrade}
 *
 * @param props Properties for the Checkbox box.
 */
export default function (props: MaterialCheckboxProps): JSX.Element {
    const id = props.id ?? generateId(8);
    const element = (
        <span>
            <button
                id={id}
                class={classMix(
                    "mdc-checkbox",
                    `mdc-checkbox--${!props.default ? "un" : ""}selected`,
                    props.class
                )}
                type="button"
                role="checkbox"
                aria-checked={props.default ? "true" : "false"}
            >
                <div class="mdc-form-field">
                    <div class="mdc-checkbox">
                        <input
                            type="checkbox"
                            class="mdc-checkbox__native-control"
                            id="checkbox-1"
                        />
                        <div class="mdc-checkbox__background">
                            <svg
                                class="mdc-checkbox__checkmark"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    class="mdc-checkbox__checkmark-path"
                                    fill="none"
                                    d="M1.73,12.91 8.1,19.28 22.79,4.59"
                                />
                            </svg>
                            <div class="mdc-checkbox__mixedmark"></div>
                        </div>
                        <div class="mdc-checkbox__ripple"></div>
                    </div>
                </div>
                <label for={id}>{i18next.t<string>("ui:toggleCheckbox")}</label>
            </button>
        </span>
    );
    const component = MaterialCheckboxUpgrade(element);
    component.initialize();
    component.initialSyncWithDOM();

    Log.info("MaterialCheckbox", { props, element, component });
    if (props.disabled) {
        component.disabled = true;
    }
    if (props.default) {
        component.checked = true;
    }

    element.querySelector("button").addEventListener("click", (event) => {
        Log.info("MaterialCheckbox change", { event });
        if (props.onChange) {
            props.onChange(component.checked, event);
        }
    });

    MaterialCheckboxTrack.set(id, {
        element,
        props,
        component,
    });
    return element;
}

/**
 * Upgrades an existing MaterialCheckbox and returns related MDC components.
 * @param element
 */
export function MaterialCheckboxUpgrade(element: JSX.Element): MDCCheckbox {
    const target = element.querySelector("button.mdc-checkbox");
    target.classList.add("rw-mdc--upgraded");
    return new MDCCheckbox(target as HTMLButtonElement);
}
