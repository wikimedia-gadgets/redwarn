import {DisplayInformationOption, UIInputType} from "rww/config/user/Setting";
import {RWUIPreferencesItem} from "rww/ui/elements/RWUIPreferencesItem";
import {h} from "tsx-dom";
import MaterialRadioField from "rww/styles/material/ui/components/MaterialRadioField";
import MaterialSelect from "rww/styles/material/ui/components/MaterialSelect";
import MaterialTextInput from "rww/styles/material/ui/components/MaterialTextInput";

/**
 * The MaterialPreferencesItem is a handling class used for different items in the preferences page.
 */
export default class MaterialPreferencesItem<T> extends RWUIPreferencesItem<T> {
    /** Input element */
    private input: HTMLElement;

    renderInputElement(): HTMLInputElement {
        switch (this.props.setting.displayInfo.uiInputType) {
            case UIInputType.Switch:
                // TODO: Implement switch
                break;
            case UIInputType.Checkboxes:
                // TODO: Implement checkboxes
                break;
            case UIInputType.Radio:
                this.input = <MaterialRadioField<DisplayInformationOption>
                    radios={this.props.setting.displayInfo.validOptions.map(options => ({
                        value: options.value,
                        children: <span>{options.name ?? options.value}</span>
                    }))}
                    direction={"vertical"}
                    onChange={(value) => {
                        this.result = value;
                    }}
                />;
                break;
            case UIInputType.Dropdown:
                this.input = <MaterialSelect<DisplayInformationOption>
                    items={this.props.setting.displayInfo.validOptions.map(options => ({
                        type: "action",
                        label: options.name,
                        value: options
                    }))}
                    label={this.props.setting.displayInfo.title}
                    onChange={(value) => {
                        this.result = value;
                    }}
                />;
                break;
            case UIInputType.Textbox:
                this.input = <MaterialTextInput
                    label={this.props.setting.displayInfo.title}
                    onInput={(value) => {
                        this.result = value;
                    }}
                />;
                break;
            case UIInputType.Number:
                this.input = <MaterialTextInput
                    type="number"
                    label={this.props.setting.displayInfo.title}
                    onInput={(value) => {
                        this.result = value;
                    }}
                />;
                break;
            case UIInputType.ColorPicker:
                // TODO: Implement color picker
                break;
            case UIInputType.Style:
                // TODO: Implement style
                break;
            case UIInputType.RevertOptions:
                // TODO: Implement revert options
                break;
            case UIInputType.PageIcons:
                // TODO: Implement page icons
                break;
        }
        return (this.input = (this.input ?? <input />) as HTMLInputElement);
    }

    render(): HTMLDivElement {
        return (this.element = (
            <div class={`mdc-form-field`}>
                {this.input}
            </div>
        ) as HTMLDivElement);
    }
}
