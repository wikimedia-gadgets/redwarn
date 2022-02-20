import { Configuration } from "rww/config/user/Configuration";
import { PrimitiveSetting, Setting } from "rww/config/user/Setting";
import { RWUIPreferences } from "rww/ui/elements/RWUIPreferences";
import { h } from "tsx-dom";
import MaterialTabBar from "./components/MaterialTabBar";
import MaterialPreferencesTab from "./MaterialPreferencesTab";
import "../css/preferences.css";
import Log from "rww/data/RedWarnLog";
import MaterialButton from "./components/MaterialButton";

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
        Log.info("MaterialPreferences onChange called", { setting });
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
        Log.info("MaterialPreferences saving", {
            unsavedPreferences: this.unsavedPreferences,
        });
        this.unsavedPreferences.forEach((setting) => {
            // find the setting in the configuration
            Log.debug("MaterialPreferences looking for setting", { setting });
            const configurationSet = Object.values(
                Configuration.configurationSets
            ).find((set) => {
                return (
                    Object.values(set).find((s) => s.id === setting.id) != null
                );
            });
            if (configurationSet) {
                Log.debug("MaterialPreferences config set found", {
                    configurationSet,
                });
                const settingToSave = configurationSet[setting.id];
                if (settingToSave) {
                    settingToSave.value = setting.value;
                } else {
                    throw "Setting not found in configuration";
                }
            }
        });
        this.unsavedPreferences = [];
        Log.debug("MaterialPreferences set config items");
        Configuration.save();
        Log.info("MateriaLPreference saved");
    }

    render(): HTMLDivElement {
        let config: [key: string, set: Setting<any>[]][] = Object.entries(
            Configuration.configurationSets
        ).map(([key, set]) => [
            key,
            Object.entries(set)
                .map(([_, setting]) => setting)
                .filter((setting) => setting.displayInfo != null),
        ]);
        config = config.filter(([, set]) => set.length > 0);
        if (this.props.excludeTabs) {
            config = config.filter(
                ([key]) => !this.props.excludeTabs.includes(key)
            );
        }
        const tabs = config.map(
            ([key, value], index) =>
                new MaterialPreferencesTab({
                    active: index === 0,
                    title: key,
                    items: value,
                    onChange: this.onChange.bind(this),
                })
        );

        return (this.element = (
            <div id="rw-preferences">
                <MaterialTabBar
                    id="rw-preferences-tab-bar"
                    activeTabIndex={0}
                    onActivate={(event) =>
                        tabs.forEach((tab, index) =>
                            index === event.detail.index
                                ? tab.activate()
                                : tab.deactivate()
                        )
                    }
                >
                    {tabs.map((tab) => tab.renderTabBarItem())}
                </MaterialTabBar>
                {tabs.map((tab) => tab.render())}
                <br />
                <MaterialButton
                    action={true}
                    raised={true}
                    dialogAction={"save"}
                    onClick={() => this.save()}
                >
                    Save
                </MaterialButton>
            </div>
        ) as HTMLDivElement);
    }
}
