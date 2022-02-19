import { Configuration } from "rww/config/user/Configuration";
import { PrimitiveSetting, Setting } from "rww/config/user/Setting";
import { RWUIPreferences } from "rww/ui/elements/RWUIPreferences";
import { h } from "tsx-dom";
import MaterialTabBar from "./components/MaterialTabBar";
import MaterialPreferencesTab from "./MaterialPreferencesTab";

/**
 * The MaterialPreferences is a handling class used for the preferences page.
 */
export default class MaterialPreferences extends RWUIPreferences {
    /**
     * Unsaved preferences cache
     */
    private unsavedPreferences: PrimitiveSetting<any>[] = [];

    /**
     * Handler for onChange events.
     */
    onChange(setting: PrimitiveSetting<any>): void {
        // if exists in unsaved preferences, remove it
        const index = this.unsavedPreferences.findIndex(
            (pref) => pref.id === setting.id
        );
        if (index !== -1) {
            this.unsavedPreferences.splice(index, 1);
        }
        this.unsavedPreferences.push(setting);
    }

    /**
     * Saves the unsaved preferences.
     */
    save(): void {
        this.unsavedPreferences.forEach((setting) => {
            // find the setting in the configuration
            const set = Object.entries(Configuration.configurationSets).find(
                ([_, value]) => {
                    return Object.entries(value).find(([_, setting]) => {
                        return setting.id === setting.id;
                    });
                }
            );
            if (set) {
                // set the value
                set[1][setting.id].value = setting.value;
            }
        });
        this.unsavedPreferences = [];
    }

    render(): HTMLDivElement {
        const config: [key: string, set: Setting<any>[]][] = Object.entries(
            Configuration.configurationSets
        ).map(([key, set]) => [
            key,
            Object.entries(set).map(([_, setting]) => setting),
        ]);
        const tabs = config.map(
            ([key, value], index) =>
                new MaterialPreferencesTab({
                    active: index === 0,
                    title: key,
                    items: value,
                    onChange: this.onChange,
                })
        );
        this.unsavedPreferences = config.flatMap(([_, value]) => value);

        return (this.element = (
            <div id="rw-preferences">
                <MaterialTabBar id="rw-preferences-tab-bar" activeTabIndex={0}>
                    {tabs.map((tab) => tab.renderTabBarItem())}
                </MaterialTabBar>
                {tabs.map((tab) => tab.render())}
            </div>
        ) as HTMLDivElement);
    }
}
