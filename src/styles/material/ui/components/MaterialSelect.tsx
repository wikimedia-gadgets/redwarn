import { h } from "tsx-dom";
import { MDCSelect } from "@material/select/component";
import { generateId } from "rww/util";
import {
    MaterialList,
    MaterialListDivider,
    MaterialListItem,
    MaterialListSubheader
} from "rww/styles/material/ui/components/MaterialList";
import classMix from "rww/styles/material/util/classMix";

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
    // Options for this component
    label: string;
    items: MaterialSelectItem<T>[];
    onChange?: (index: number, value: T) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    required?: boolean;
    class?: string;
}

export type MaterialSelectElement<T> = JSX.Element & {
    MDCSelect: MDCSelect;
    valueSet: { [key: string]: T };
    setItem: (item: T) => void;
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
            class={classMix(
                "mdc-select",
                "mdc-select--outlined",
                props.required ? "mdc-select--required" : false,
                props.class
            )}
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
                <MaterialList
                    initialized={false}
                    role="listbox"
                    aria-hidden="true"
                    aria-orientation="vertical"
                    aria-label={props.label}
                    tabIndex={-1}
                >
                    {props.items.map((item) => {
                        switch (item.type) {
                            case "divider":
                                return <MaterialListDivider />;
                            case "header":
                                return (
                                    <MaterialListSubheader>
                                        {item.label}
                                    </MaterialListSubheader>
                                );
                            case "action":
                                const itemId = generateId();
                                valueSet[itemId] = item.value;
                                return (
                                    <MaterialListItem
                                        class={
                                            item.selected
                                                ? " mdc-list-item--selected"
                                                : ""
                                        }
                                        aria-selected={item.selected ?? "false"}
                                        role="option"
                                        data-value={itemId}
                                    >
                                        {item.label}
                                    </MaterialListItem>
                                );
                        }
                    })}
                </MaterialList>
            </div>
        </div>
    );

    const select = new MDCSelect(element);

    if (props.onChange)
        select.listen("MDCSelect:change", () => {
            props.onChange(select.selectedIndex, valueSet[select.value]);
        });

    if (props.onKeyDown)
        select.listen("keydown", (e) => {
            props.onKeyDown(e);
        });

    return Object.assign(element, {
        MDCSelect: select,
        valueSet: valueSet,
        setItem: (item: T) => {
            const targetValue = Object.entries(valueSet).find(
                ([, _item]) => _item === item
            );
            if (targetValue)
                (element.querySelector(
                    `li[data-value="${targetValue[0]}"]`
                ) as HTMLElement).click();
        }
    });
}
