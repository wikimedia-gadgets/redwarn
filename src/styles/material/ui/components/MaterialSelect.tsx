import { h } from "tsx-dom";
import { MDCSelect } from "@material/select/component";
import { generateId } from "rww/util";

export interface MaterialSelectDivider {
    type: "divider";
}

export interface MaterialSelectHeader {
    type: "header";
    label: string;
}

export interface MaterialSelectAction<T> {
    type: "action";
    label: string;
    value: T;
    selected?: boolean;
}

export type MaterialSelectItem<T> =
    | MaterialSelectAction<T>
    | MaterialSelectHeader
    | MaterialSelectDivider;

export interface MaterialSelectProps<T> {
    label: string;
    items: MaterialSelectItem<T>[];
    onChange?: (index: number, value: T) => void;
    required?: boolean;
}

export type MaterialSelectElement<T> = JSX.Element & {
    MDCSelect: MDCSelect;
    valueSet: { [key: string]: T };
};

export default function <T>(
    props: MaterialSelectProps<T>
): MaterialSelectElement<T> {
    const valueSet: { [key: string]: T } = {};

    const icon = <i class="mdc-select__dropdown-icon" />;
    icon.innerHTML = require("../../svg/dropdown-graphic.svg");

    const selectId = `rwMdcSelect__${generateId()}`;

    const element = (
        <div
            class={`mdc-select mdc-select--outlined${
                props.required ? " mdc-select--required" : ""
            }`}
        >
            <div
                class="mdc-select__anchor"
                role="button"
                aria-haspopup="listbox"
                aria-expanded="false"
                aria-labelledby={`${selectId}label ${selectId}text`}
                aria-required={props.required ?? "false"}
            >
                <div class="mdc-notched-outline">
                    <div class="mdc-notched-outline__leading" />
                    <div class="mdc-notched-outline__notch">
                        <label
                            id={`${selectId}label`}
                            class="mdc-floating-label mdc-floating-label--float-above"
                        >
                            {props.label}
                        </label>
                    </div>
                    <div class="mdc-notched-outline__trailing" />
                </div>
                <span class="mdc-select__selected-text-container">
                    <div
                        id={`${selectId}text`}
                        class="mdc-select__selected-text"
                    />
                </span>
                {icon}
            </div>

            <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
                <ul
                    class="mdc-list"
                    role="listbox"
                    aria-hidden="true"
                    aria-orientation="vertical"
                    aria-label={props.label}
                    tabIndex={-1}
                >
                    {props.items.map((item) => {
                        switch (item.type) {
                            case "divider":
                                return (
                                    <li
                                        class="mdc-list-divider"
                                        role="separator"
                                    />
                                );
                            case "header":
                                return (
                                    <li
                                        class="mdc-list-item mdc-list-header mdc-list-item--disabled"
                                        role="separator"
                                    >
                                        {item.label}
                                    </li>
                                );
                            case "action":
                                const itemId = generateId();
                                valueSet[itemId] = item.value;
                                return (
                                    <li
                                        class={`mdc-list-item ${
                                            item.selected
                                                ? " mdc-list-item--selected"
                                                : ""
                                        }`}
                                        aria-selected={item.selected ?? "false"}
                                        role="option"
                                        data-value={itemId}
                                    >
                                        <span class="mdc-list-item__ripple" />
                                        <span class="mdc-list-item__text">
                                            {item.label}
                                        </span>
                                    </li>
                                );
                        }
                    })}
                </ul>
            </div>
        </div>
    );

    const select = new MDCSelect(element);

    select.listen("MDCSelect:change", () => {
        console.log(select.value);
        console.log(valueSet[select.value]);
        if (props.onChange)
            props.onChange(select.selectedIndex, valueSet[select.value]);
    });

    return Object.assign(element, {
        MDCSelect: select,
        valueSet: valueSet,
    });
}
