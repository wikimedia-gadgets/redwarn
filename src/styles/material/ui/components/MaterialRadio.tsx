import { BaseProps, h } from "tsx-dom";
import { generateId } from "rww/util";
import { MDCRadio } from "@material/radio/component";

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
};

export default function <T>(
    props: MaterialRadioProps<T>
): MaterialRadioElement<T> {
    const id = `rwMdcRadio__${generateId()}`;
    const element = (
        <span class="rw-mdc-radio" data-rw-mdc-tooltip={props.tooltip}>
            <div
                class={`mdc-radio ${
                    props.checked ? "mdc-radio--checked" : ""
                } ${props.disabled ? "mdc-radio--disabled" : ""}`}
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
            <label for={id}>{props.children}</label>
        </span>
    );

    const radio = new MDCRadio(element);

    return Object.assign(element, {
        MDCRadio: radio,
        radioValue: props.value
    });
}
