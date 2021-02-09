import { h } from "tsx-dom";
import { MDCSelect } from "@material/select/component";

/* Specificity is key */
type MaterialSelectID = string;

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
}

export type MaterialSelectItem<T> =
    | MaterialSelectAction<T>
    | MaterialSelectHeader
    | MaterialSelectDivider;

export interface MaterialSelectProps<T> {
    items: MaterialSelectItem<T>[];
    onChange?: (index: number, value: T) => void;
    required?: boolean;
}

export default function <T>(prop: MaterialSelectProps<T>): JSX.Element {
    let currentValueIndex = 0;
    const valueSet: { [key: string]: T } = {};

    const icon = <span class="mdc-select__dropdown-icon" />;
    icon.innerHTML = require("../../svg/dropdown-graphic.svg");

    const element = (
        <div
            class={`mdc-select mdc-select--outlined${
                prop.required ? " mdc-select--required" : ""
            }`}
        >
            <div
                class="mdc-select__anchor"
                aria-labelledby="outlined-select-label"
                aria-required={prop.required ?? "false"}
            >
                <span class="mdc-notched-outline">
                    <span class="mdc-notched-outline__leading" />
                    <span class="mdc-notched-outline__notch">
                        <span
                            id="outlined-select-label"
                            class="mdc-floating-label"
                        >
                            Warning
                        </span>
                    </span>
                    <span class="mdc-notched-outline__trailing" />
                </span>
                <span class="mdc-select__selected-text-container">
                    <span
                        id="demo-selected-text"
                        class="mdc-select__selected-text"
                    />
                </span>
                {icon}
            </div>

            <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
                <ul
                    class="mdc-list"
                    role="menu"
                    aria-hidden="true"
                    aria-orientation="vertical"
                    tabIndex={-1}
                >
                    {prop.items.map((item, index) => {
                        currentValueIndex++;
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
                                valueSet[currentValueIndex] = item.value;
                                return (
                                    <li class="mdc-list-item" role="menuitem">
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
        console.log(select.selectedIndex);
        console.log(valueSet[select.selectedIndex]);
        if (prop.onChange)
            prop.onChange(select.selectedIndex, valueSet[select.selectedIndex]);
    });

    return element;
}
