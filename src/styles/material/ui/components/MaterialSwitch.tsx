import { BaseProps, h } from "tsx-dom";
import { generateId } from "app/util";
import { MDCSwitch } from "@material/switch";
import i18next from "i18next";
import classMix from "app/styles/material/util/classMix";
import Log from "app/data/RedWarnLog";

interface MaterialSwitchProps extends BaseProps {
    id?: string;
    class?: string;
    disabled?: boolean;
    default?: boolean;
    onChange?: (value: boolean, event: Event) => void;
}

export const MaterialSwitchTrack = new Map<
    string,
    {
        element: JSX.Element;
        props: MaterialSwitchProps;
        component: MDCSwitch | null;
    }
>();

/**
 * Creates an MDC Switch field. This field is not upgraded on its own. To
 * upgrade the text field, pass the text field as properties to
 * {@link MaterialSwitchUpgrade}
 *
 * @param props Properties for the Switch box.
 */
export default function (props: MaterialSwitchProps): JSX.Element {
    const id = props.id ?? generateId(8);
    const element = (
        <span>
            <button
                id={id}
                class={classMix(
                    "mdc-switch",
                    `mdc-switch--${!props.default ? "un" : ""}selected`,
                    props.class
                )}
                type="button"
                role="switch"
                aria-checked={props.default ? "true" : "false"}
            >
                <div class="mdc-switch__track" />
                <div class="mdc-switch__handle-track">
                    <div class="mdc-switch__handle">
                        <div class="mdc-switch__shadow">
                            <div class="mdc-elevation-overlay" />
                        </div>
                        <div class="mdc-switch__ripple" />
                        <div class="mdc-switch__icons">
                            <svg
                                class="mdc-switch__icon mdc-switch__icon--on"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
                            </svg>
                            <svg
                                class="mdc-switch__icon mdc-switch__icon--off"
                                viewBox="0 0 24 24"
                            >
                                <path d="M20 13H4v-2h16v2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </button>
            <label for={id}>{i18next.t<string>("ui:toggleSwitch")}</label>
        </span>
    );
    const component = MaterialSwitchUpgrade(element);
    component.initialize();
    component.initialSyncWithDOM();

    Log.info("MaterialSwitch", { props, element, component });
    if (props.disabled) {
        component.disabled = true;
    }
    if (props.default) {
        component.selected = true;
    }

    element.querySelector("button").addEventListener("click", (event) => {
        Log.info("MaterialSwitch change", { event });
        if (props.onChange) {
            props.onChange(component.selected, event);
        }
    });

    MaterialSwitchTrack.set(id, {
        element,
        props,
        component,
    });
    return element;
}

/**
 * Upgrades an existing MaterialSwitch and returns related MDC components.
 * @param element
 */
export function MaterialSwitchUpgrade(element: JSX.Element): MDCSwitch {
    const target = element.querySelector("button.mdc-switch");
    target.classList.add("rw-mdc--upgraded");
    return new MDCSwitch(target as HTMLButtonElement);
}
