import {
    RW_CONFIG_VERSION,
    RW_NOWIKI_CLOSE,
    RW_NOWIKI_OPEN,
} from "rww/data/RedWarnConstants";
import { ClientUser } from "rww/mediawiki";
import { Setting } from "./Setting";
import { updateConfiguration } from "./ConfigurationUpdate";
import RedWarnUI from "rww/ui/RedWarnUI";
import i18next from "i18next";
import StyleManager from "rww/styles/StyleManager";
import { RedWarnStyleMissingError } from "rww/errors/RedWarnStyleError";
import Log from "rww/data/RedWarnLog";

// Settings value files
import coreSettings from "./values/core";
import uiSettings from "./values/ui";
import rollbackSettings from "./values/rollback";
import accessibilitySettings from "./values/accessibility";

export class Configuration {
    // Add new config files both above and here, and (IMPORTANT) below in both the load (or it'll be ignored), and save()
    public static core = coreSettings;
    public static ui = uiSettings;
    public static rollback = rollbackSettings;
    public static accessibility = accessibilitySettings;

    static async refresh(): Promise<void> {
        Log.debug("Refreshing configuration...");
        let redwarnConfig: Record<string, any>,
            saveNow = false;

        try {
            redwarnConfig = JSON.parse(
                // Strip everything except the actual JSON part.
                /rw\.config\s*=\s*({(?:.|\s)*});(?:\n|\s*\/\/<\/nowiki>)(?:.|\s)*/g.exec(
                    (await ClientUser.i.redwarnConfigPage.getLatestRevision())
                        .content
                )[1]
            );
        } catch (e) {
            Log.error("Configuration loading error.", e);
            // Fallback style
            StyleManager.setStyle(StyleManager.defaultStyle);
            // Show error message
            const dialog = new RedWarnUI.Dialog(
                i18next.t("ui:configErrorDialog")
            );
            dialog.show();
            // Reset configuration
            redwarnConfig = {};
            saveNow = true;
        }

        // Compatibility - if redwarnConfig.core is not there we can assume it is an older style (todo)
        if (
            (redwarnConfig.core &&
                (redwarnConfig.core[this.core.configVersion.id] ?? 0)) <
            RW_CONFIG_VERSION
        ) {
            redwarnConfig = updateConfiguration(redwarnConfig);
            saveNow = true;
        }

        // At this point, we can definitely assume that `redwarnConfig` is a configuration
        // that is of the latest version, so we can start loading based on this config.

        // Start loading the into the groups
        this.loadSettings(redwarnConfig, "core", this.core);
        this.loadSettings(redwarnConfig, "ui", this.ui);
        this.loadSettings(redwarnConfig, "rollback", this.rollback);
        this.loadSettings(redwarnConfig, "accessibility", this.accessibility);

        try {
            StyleManager.setStyle(
                redwarnConfig.ui[this.ui.style.id] ?? this.ui.style.defaultValue
            );
        } catch (e) {
            if (e instanceof RedWarnStyleMissingError) {
                StyleManager.setStyle(StyleManager.defaultStyle);
                const dialog = new RedWarnUI.Dialog(
                    i18next.t("ui:styleError.missing")
                );
                dialog.show();
            }
        }

        if (saveNow) {
            this.save();
        }
    }

    // Example use: allSettings(this.ui)
    static allSettings(
        settingGroup: Record<string, any>
    ): Map<string, Setting<unknown>> {
        const map = new Map();
        for (const [key, value] of Object.entries(settingGroup)) {
            if (value instanceof Setting) {
                map.set(key, value);
            }
        }
        return map;
    }

    // Example use: loadSettings("ui", this.ui)
    static loadSettings(
        redwarnConfig: Record<string, any>,
        configKey: string,
        settingGroup: Record<string, any>
    ) {
        if (redwarnConfig[configKey] == undefined) return; // if it's not set, skip and keep defaults
        this.allSettings(settingGroup).forEach((setting) => {
            // Only setting if config is there, else it's the default value
            if (redwarnConfig[configKey][setting.id])
                setting.value = redwarnConfig[configKey][setting.id];
        });
    }

    static async save(reloadOnDone = false): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const template = require("./redwarnConfig.template.txt");

        await ClientUser.i.redwarnConfigPage.edit(
            Configuration.fromTemplate(template, {
                // ADD NEW SETTINGS TO BE SAVED HERE
                core: this.map(this.core),
                ui: this.map(this.ui),
                rollback: this.map(this.rollback),
                accessibility: this.map(this.accessibility),
            }),
            {
                comment: "Updating configuration",
            }
        );
        if (reloadOnDone) {
            window.location.reload();
        }
        return;
    }

    // Example usage: this.map(this.ui)
    static map(settingsGroupToMap: Record<string, any>): Record<string, any> {
        // Any keys to exclude from default skip - make sure these are unique as they will apply irrespective of which group they are in!!
        const excludeFromDefaultSkip = [
            this.core.configVersion.id,
            this.core.latestVersion.id,
        ];

        return Array.from(
            this.allSettings(settingsGroupToMap).entries()
        ).reduce(
            (main, [id, setting]) => ({
                ...main,
                ...(excludeFromDefaultSkip.includes(setting.id) ||
                setting.value !== setting.defaultValue
                    ? { [id]: setting.value }
                    : {}),
            }),
            {}
        );
    }

    static fromTemplate(
        template: string,
        configurationValues: Record<string, any>
    ): string {
        return template
            .replace(/--nowikiOpen/g, RW_NOWIKI_OPEN)
            .replace(/--nowikiClose/g, RW_NOWIKI_CLOSE)
            .replace(/--configuration/g, JSON.stringify(configurationValues));
    }
}
