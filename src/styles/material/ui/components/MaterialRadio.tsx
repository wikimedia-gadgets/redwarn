import {BaseProps, h} from "tsx-dom";
import {generateId} from "rww/util";
import {MDCRadio} from "@material/radio/component";
import classMix from "rww/styles/material/util/classMix";

export interface MaterialRadioProps<T> extends BaseProps {
    value: T;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    tooltip?: string;
}

export type MaterialRadioElement<T> = JSX.Element & {
    MDCRadio: MDCRadio;
    radioValue: T;
    enable: () => void;
    disable: () => void;
};

export default function <T>(
    props: MaterialRadioProps<T>
): MaterialRadioElement<T> {
    const id = `rwMdcRadio__${generateId()}`;
    const radioElement = (
        <div
            class={classMix(
                "mdc-radio",
                props.checked && "mdc-radio--checked",
                props.disabled && "mdc-radio--disabled"
            )}
        >
            <input
                class="mdc-radio__native-control"
                type="radio"
                id={id}
                name={props.name}
                {...(props.checked && { checked: true })}
                disabled={props.disabled}
            />
            <div class="mdc-radio__background">
                <div class="mdc-radio__outer-circle" />
                <div class="mdc-radio__inner-circle" />
            </div>
            <div class="mdc-radio__ripple" />
        </div>
    );
    const element = (
        <span class="rw-mdc-radio" data-rw-mdc-tooltip={props.tooltip}>
            {radioElement}
            <label for={id}>{props.children}</label>
        </span>
    );

    const radio = new MDCRadio(radioElement);

    return Object.assign(element, {
        MDCRadio: radio,
        radioValue: props.value,
        enable() {
            radio.disabled = false;
        },
        disable() {
            radio.disabled = true;
        },
    });
}
