import {
    DisplayInformationOption,
    Setting,
    UIInputType,
} from "rww/config/user/Setting";
import { RWUIPreferencesItem } from "rww/ui/elements/RWUIPreferencesItem";
import { h } from "tsx-dom";
import MaterialRadioField from "rww/styles/material/ui/components/MaterialRadioField";
import MaterialSelect from "rww/styles/material/ui/components/MaterialSelect";
import MaterialTextInput from "rww/styles/material/ui/components/MaterialTextInput";
import StyleManager from "rww/styles/StyleManager";
import i18next from "i18next";
import MaterialSwitch from "./components/MaterialSwitch";

/**
 * The MaterialPreferencesItem is a handling class used for different items in the preferences page.
 */
export default class MaterialPreferencesItem extends RWUIPreferencesItem {
    /** Input element */
    private input: HTMLElement;

    renderInputElement(): HTMLElement {
        switch (this.props.setting.displayInfo.uiInputType) {
            case UIInputType.Switch:
                this.input = (
                    <MaterialSwitch
                        default={(this.props.setting as Setting<boolean>).value}
                        onChange={(value) => {
                            this.result = value;
                        }}
                    />
                );
                break;
            case UIInputType.Checkboxes:
                // TODO: Implement checkboxes
                break;
            case UIInputType.Radio:
                this.input = (
                    <MaterialRadioField<DisplayInformationOption>
                        radios={this.props.setting.displayInfo.validOptions.map(
                            (options) => ({
                                value: options.value,
                                children: (
                                    <span>{options.name ?? options.value}</span>
                                ),
                                checked:
                                    options.value === this.props.setting.value,
                            })
                        )}
                        direction={"vertical"}
                        onChange={(value) => {
                            this.result = value;
                        }}
                    />
                );
                break;
            case UIInputType.Dropdown:
                this.input = (
                    <MaterialSelect<DisplayInformationOption>
                        items={this.props.setting.displayInfo.validOptions.map(
                            (options) => ({
                                type: "action",
                                label: options.name,
                                value: options,
                                selected:
                                    options.value === this.props.setting.value,
                            })
                        )}
                        label={this.props.setting.displayInfo.title}
                        onChange={(value) => {
                            this.result = value;
                        }}
                    />
                );
                break;
            case UIInputType.Textbox:
                this.input = (
                    <MaterialTextInput
                        label={this.props.setting.displayInfo.title}
                        // If the value wasn't actually a string, blame whoever made the setting
                        // for using the Textbox UIInputType for a string value.
                        defaultText={`${this.props.setting.value}`}
                        onInput={(value) => {
                            this.result = value;
                        }}
                    />
                );
                break;
            case UIInputType.Number:
                this.input = (
                    <MaterialTextInput
                        type="number"
                        label={this.props.setting.displayInfo.title}
                        // If the value wasn't actually a number, blame whoever made the setting
                        // for using the Textbox UIInputType for a number value.
                        defaultText={`${this.props.setting.value}`}
                        onInput={(value) => {
                            this.result = value;
                        }}
                    />
                );
                break;
            case UIInputType.ColorPicker:
                // TODO: Implement color picker
                break;
            case UIInputType.Style:
                this.input = (
                    <MaterialSelect<string>
                        items={StyleManager.styles.map((style) => ({
                            type: "action",
                            label: style.meta[i18next.language ?? "en-US"]
                                .displayName,
                            value: style.name,
                        }))}
                        label={this.props.setting.displayInfo.title}
                        onChange={(value) => {
                            this.result = value;
                        }}
                    />
                );
                break;
            case UIInputType.RevertOptions:
                // TODO: Implement revert options
                break;
            case UIInputType.PageIcons:
                // TODO: Implement page icons
                break;
        }
        return (this.input = this.input ?? (
            <span>This setting is currently unsupported.</span>
        ));
    }

    render(): HTMLDivElement {
        this.renderInputElement();
        return (this.element = (
            <div class={`mdc-form-field`}>{this.input}</div>
        ) as HTMLDivElement);
    }
}
