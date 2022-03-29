import { h } from "tsx-dom";
import type {
    MaterialRadioElement,
    MaterialRadioProps,
} from "rww/styles/material/ui/components/MaterialRadio";
import MaterialRadio from "rww/styles/material/ui/components/MaterialRadio";
import { generateId } from "rww/util";

export interface MaterialRadioFieldProps<T> {
    radios: Omit<MaterialRadioProps<T>, "name">[];
    name?: string;
    class?: string | string[];
    onChange?: (value: T, radio: MaterialRadioElement<T>) => void;
    /** Whether or not this field goes vertical or horizontal. */
    direction?: "vertical" | "horizontal";
    disabled?: boolean;
}

export type MaterialRadioFieldElement<T> = JSX.Element & {
    MDCRadios: MaterialRadioElement<T>[];
    reset: () => void;
    enable: () => void;
    disable: () => void;
};

export default function <T>(
    props: MaterialRadioFieldProps<T>
): MaterialRadioFieldElement<T> {
    const radioFieldId = `rwMdcRadioField__${generateId()}`;
    const radios: MaterialRadioElement<T>[] = props.radios.map((radio) => {
        return (
            <MaterialRadio<T>
                {...Object.assign({}, radio, {
                    name: props.name ?? radioFieldId,
                    disabled: props.disabled ?? radio.disabled ?? false,
                })}
            >
                {radio.children ?? `${radio.value}`}
            </MaterialRadio>
        ) as MaterialRadioElement<T>;
    });

    const element = (
        <div
            id={radioFieldId}
            class={`mdc-form-field rw-mdc-radiofield--${
                props.direction ?? "horizontal"
            } ${
                props.class
                    ? Array.isArray(props.class)
                        ? props.class.join(" ")
                        : props.class
                    : ""
            }`}
        >
            {radios}
        </div>
    );

    element.addEventListener("change", () => {
        for (const radio of radios) {
            if (radio.MDCRadio.checked) {
                props.onChange(radio.radioValue, radio);
                break;
            }
        }
    });

    return Object.assign(element, {
        MDCRadios: radios,
        reset() {
            radios.forEach((v) => (v.MDCRadio.checked = false));
            props.onChange(null, null);
        },
        enable() {
            radios.forEach((v) => v.enable());
        },
        disable() {
            radios.forEach((v) => v.disable());
        },
    });
}
