import {
    RW_CONFIG_VERSION,
    RW_NOWIKI_CLOSE,
    RW_NOWIKI_OPEN,
} from "app/data/RedWarnConstants";
import { ClientUser } from "app/mediawiki";
import { Setting } from "./Setting";
import RedWarnUI from "app/ui/RedWarnUI";
import i18next from "i18next";
import StyleManager from "app/styles/StyleManager";
import { StyleMissingError } from "app/errors/RedWarnStyleError";
import Log from "app/data/RedWarnLog";

import initCoreSettings from "app/config/user/values/CoreSettings";
import initUISettings from "app/config/user/values/UISettings";
import initRevertSettings from "app/config/user/values/RevertSettings";
import initAccessibilitySettings from "app/config/user/values/AccessibilitySettings";
import { isEmptyObject } from "app/util";
import updateConfiguration from "./updateConfiguration";

export type ConfigurationSet = Record<string, Setting<any>>;

export class Configuration {
    private static initialized = false;
    private static _Core: ConfigurationSet;
    private static _UI: ConfigurationSet;
    private static _Revert: ConfigurationSet;
    private static _Accessibility: ConfigurationSet;

    static get Core(): ConfigurationSet {
        if (!Configuration.initialized) {
            Configuration.init();
        }
        return Configuration._Core;
    }

    static get UI(): ConfigurationSet {
        if (!Configuration.initialized) {
            Configuration.init();
        }
        return Configuration._UI;
    }

    static get Revert(): ConfigurationSet {
        if (!Configuration.initialized) {
            Configuration.init();
        }
        return Configuration._Revert;
    }

    static get Accessibility(): ConfigurationSet {
        if (!Configuration.initialized) {
            Configuration.init();
        }
        return Configuration._Accessibility;
    }

    static get configurationSets(): Record<string, ConfigurationSet> {
        return {
            core: Configuration.Core,
            ui: Configuration.UI,
            revert: Configuration.Revert,
            accessibility: Configuration.Accessibility,
        };
    }

    static get mappedConfigurationSets(): Record<string, ConfigurationSet> {
        return Object.entries(Configuration.configurationSets).reduce(
            (out, [id, set]) => {
                out[id] = Configuration.map(set);
                if (isEmptyObject(out[id])) {
                    delete out[id];
                }

                return out;
            },
            <Record<string, any>>{}
        );
    }

    static async refresh(): Promise<void> {
        Log.debug("Refreshing configuration...");
        let redwarnConfig: Record<string, any>,
            saveNow = false;

        try {
            const configLatestRev =
                await ClientUser.i.redwarnConfigPage.getLatestRevision();
            if (configLatestRev == null) {
                // Configuration does not exist. Create one.
                redwarnConfig = {};
                // Need to save the new config.
                saveNow = true;
            } else
                redwarnConfig = JSON.parse(
                    // Strip everything except the actual JSON part.
                    /rw\.config\s*=\s*({(?:.|\s)*});(?:\n|\s*\/\/<\/nowiki>)(?:.|\s)*/g.exec(
                        configLatestRev.content
                    )[1]
                );
        } catch (e) {
            Log.error("Configuration loading error.", e);
            // Fallback style
            StyleManager.setStyle(StyleManager.defaultStyle);
            // Show error message
            const dialog = new RedWarnUI.AlertDialog(
                i18next.t("ui:configErrorDialog")
            );
            dialog.show();
            // Reset configuration
            redwarnConfig = {};
            saveNow = true;
        }

        // This configuration comes from legacy RedWarn (RW 1 to RW 16.1).
        // The configuration file should be updated first to prevent loss of previous
        // settings and integrations.
        if (
            (redwarnConfig.core &&
                (redwarnConfig.core[Configuration.Core.configVersion.id] ??
                    0)) < RW_CONFIG_VERSION
        ) {
            redwarnConfig = updateConfiguration(redwarnConfig);
            saveNow = true;
        }

        // At this point, `redwarnConfig` is a configuration object that is of the latest
        // version, so loading can start based on this config.

        // Start loading the into the groups
        for (const [key, set] of Object.entries(
            Configuration.configurationSets
        )) {
            Configuration.loadSettings(redwarnConfig, key.toLowerCase(), set);
        }

        try {
            StyleManager.setStyle(
                redwarnConfig.ui[Configuration.UI.style.id] ??
                    Configuration.UI.style.defaultValue
            );
        } catch (e) {
            if (e instanceof StyleMissingError) {
                StyleManager.setStyle(StyleManager.defaultStyle);
                const dialog = new RedWarnUI.AlertDialog(
                    i18next.t("ui:styleError.missing")
                );
                dialog.show();
            }
        }

        if (saveNow) {
            Configuration.save();
        }
    }

    /**
     * Extracts all {@link Setting}s of a configuration set and
     * returns a {@link Map} of the values.
     *
     * @param configurationSet The configuration set to use.
     */
    static allSettings(
        configurationSet: Record<string, any>
    ): Map<string, Setting<unknown>> {
        const map = new Map();
        for (const [key, value] of Object.entries(configurationSet)) {
            if (value instanceof Setting) {
                map.set(key, value);
            }
        }
        return map;
    }

    /**
     * Loads settings from the configuration file and sets the proper values
     * in the given configuration set.
     *
     * @param rawConfiguration The raw configuration object.
     * @param configurationKey The key of the configuration set.
     * @param configurationSet The configuration set to modify.
     */
    static loadSettings(
        rawConfiguration: Record<string, any>,
        configurationKey: string,
        configurationSet: ConfigurationSet
    ) {
        // Skip if undefined.
        if (rawConfiguration[configurationKey] == undefined) return;

        Configuration.allSettings(configurationSet).forEach((setting) => {
            // Only set if the value is present in the configuration file (i.e. a changed value).
            if (rawConfiguration[configurationKey][setting.id])
                setting.value = rawConfiguration[configurationKey][setting.id];
        });
    }

    /**
     * Save the configuration file to wiki.
     *
     * @param reloadOnDone
     */
    static async save(reloadOnDone = false): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const template = require("./redwarnConfig.template.txt");

        Log.debug("Updating configuration page...");
        await ClientUser.i.redwarnConfigPage.edit(
            Configuration.toJavascriptFile(
                template,
                Configuration.mappedConfigurationSets
            ),
            {
                comment: "Updating configuration",
            }
        );

        if (reloadOnDone) window.location.reload();

        return;
    }

    /**
     * Map {@link ConfigurationSet}s into plain objects. This also converts the
     * internal ID with an external one.
     *
     * @param configurationSetToMap The configuration set to be mapped.
     */
    static map(configurationSetToMap: ConfigurationSet): Record<string, any> {
        /**
         * Keys that will be saved anyway, regardless of default status.
         */
        const forceInclude = [
            Configuration.Core.configVersion.id,
            Configuration.Core.latestVersion.id,
        ];

        return Array.from(
            Configuration.allSettings(configurationSetToMap).values()
        ).reduce((main, setting) => {
            if (
                !forceInclude.includes(setting.id) &&
                setting.value === setting.defaultValue
            )
                return main;

            return {
                ...main,
                [setting.id]: setting.value,
            };
        }, {});
    }

    /**
     * Convert configuration values to a JavaScript file that can be
     * stored onwiki.
     *
     * @param template The template text.
     * @param configurationValues The configuration values.
     */
    static toJavascriptFile(
        template: string,
        configurationValues: Record<string, any>
    ): string {
        return template
            .replace(/--nowikiOpen/g, RW_NOWIKI_OPEN)
            .replace(/--nowikiClose/g, RW_NOWIKI_CLOSE)
            .replace(/--configuration/g, JSON.stringify(configurationValues));
    }

    static init() {
        Configuration.initialized = true;

        Configuration._Core = initCoreSettings();
        Configuration._UI = initUISettings();
        Configuration._Revert = initRevertSettings();
        Configuration._Accessibility = initAccessibilitySettings();
    }
}
