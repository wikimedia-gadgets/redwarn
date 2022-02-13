import { UIInputType } from "rww/config/user/Setting";
import { RWUIPreferencesItem } from "rww/ui/elements/RWUIPreferencesItem";
import { h } from "tsx-dom";

/**
 * The MaterialPreferencesItem is a handling class used for different items in the preferences page.
 */
export default class MaterialPreferencesItem extends RWUIPreferencesItem {
    /** Input element */
    private input: HTMLInputElement;

    renderInputElement(): HTMLInputElement {
        switch (this.props.displayInfo.uiInputType) {
            case UIInputType.Switch:
                // TODO: Implement switch
                break;
            case UIInputType.Checkboxes:
                // TODO: Implement checkboxes
                break;
            case UIInputType.Radio:
                // TODO: Implement radio
                break;
            case UIInputType.Dropdown:
                // TODO: Implement dropdown
                break;
            case UIInputType.Textbox:
                // TODO: Implement textbox
                break;
            case UIInputType.Number:
                // TODO: Implement number
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
        return (this.input = (<input />) as HTMLInputElement);
    }

    render(): HTMLDivElement {
        return (this.element = (
            <div class={`mdc-form-field`} id={this.key}>
                {this.input}
            </div>
        ) as HTMLDivElement);
    }
}
