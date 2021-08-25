import type { Warning, WarningCategory } from "rww/mediawiki";
import { Page, SerializedWarningType, WarningManager } from "rww/mediawiki";
import type { RevertOption } from "rww/mediawiki/revert/RevertOptions";
import { ActionSeverity } from "rww/mediawiki/revert/RevertOptions";
import {
    RW_FALLBACK_CONFIG,
    RW_WIKI_CONFIGURATION,
    RW_WIKI_CONFIGURATION_VERSION
} from "rww/data/RedWarnConstants";
import Log from "rww/data/RedWarnLog";
import WikiConfiguration from "./WikiConfiguration";
import RawWikiConfiguration from "./RawWikiConfiguration";
import updateWikiConfiguration from "rww/config/wiki/updateWikiConfiguration";

/**
 * This class handles every single contact with the RedWarn per-wiki
 * configuration file, usually found at `Project:RedWarn/configuration.json`.
 *
 * The path of the configuration file is modified with the constant
 * {@link RW_WIKI_CONFIGURATION}.
 */
export default class RedWarnWikiConfiguration {
    private static _loadedConfiguration: WikiConfiguration;
    public static get c(): WikiConfiguration {
        return RedWarnWikiConfiguration._loadedConfiguration;
    }

    private static preloadedData: Record<string, any>;
    static async preloadWikiConfiguration(): Promise<Record<string, any>> {
        try {
            RedWarnWikiConfiguration.preloadedData = JSON.parse(
                (
                    await Page.fromTitle(
                        RW_WIKI_CONFIGURATION
                    ).getLatestRevision({ forceRefresh: false })
                ).content
            );
        } catch (e) {
            try {
                // Use the API to get the fallback configuration.
                RedWarnWikiConfiguration.preloadedData = await fetch(
                    RW_FALLBACK_CONFIG
                ).then((req) => req.json());
            } catch (e) {
                // TODO: Proper errors
                throw new AggregateError(
                    "Failed to get on-wiki configuration file.",
                    e
                );
            }
        }
        return RedWarnWikiConfiguration.preloadedData;
    }

    /**
     * Loads the onwiki configuration file. If a configuration file was not found,
     * it will fall back to the primary RedWarn configuration file, located on the
     * English Wikipedia (https://w.wiki/3V4o).
     */
    static async loadWikiConfiguration(): Promise<void> {
        Log.debug("Loading per-wiki configuration...");
        /**
         * A basic JSON object holding keys for what is supposed to be a {@link RawWikiConfiguration}.
         */
        const rawConfig: Record<string, any> =
            RedWarnWikiConfiguration.preloadedData ??
            (await RedWarnWikiConfiguration.preloadWikiConfiguration());

        /**
         * A fully-upgraded {@link RawWikiConfiguration} which can then be deserialized into
         * a proper {@link WikiConfiguration}.
         */
        let config: RawWikiConfiguration;
        if (rawConfig.configVersion < RW_WIKI_CONFIGURATION_VERSION)
            config = await RedWarnWikiConfiguration.upgradeWikiConfiguration(
                rawConfig
            );
        else config = rawConfig as RawWikiConfiguration;

        if (config.wiki != mw.config.get("wgDBname")) {
            // No need for i18n; this is debug information.
            Log.warn(
                `External wiki configuration file loaded. Expecting "${
                    config.wiki
                }", got "${mw.config.get(
                    "wgDBname"
                )}" instead. Templates may be missing or broken.`
            );

            // Force remove tag (to avoid errors)
            delete config.meta.tag;
        } else if (rawConfig.configVersion < RW_WIKI_CONFIGURATION_VERSION) {
            // TODO: Suggest saving the upgraded config file to the user (if it's the same wiki).
        }

        RedWarnWikiConfiguration._loadedConfiguration = RedWarnWikiConfiguration.deserializeWikiConfiguration(
            config
        );

        // Refresh whatever needs refreshing.
        WarningManager.refresh();
        Log.debug("Loaded per-wiki configuration.");
    }

    /**
     * Attempt to upgrade an outdated configuration file.
     */
    private static async upgradeWikiConfiguration(
        config: Record<string, any>
    ): Promise<RawWikiConfiguration> {
        return updateWikiConfiguration(config);
    }

    private static deserializeWikiConfiguration(
        config: RawWikiConfiguration
    ): WikiConfiguration {
        // Convert all warning category keypairs to WarningCategory objects.
        const categories: WarningCategory[] = [];
        for (const [id, details] of Object.entries(
            config.warnings.categories
        )) {
            categories.push(Object.assign({ id: id }, details));
        }

        // Convert all SerializableWarnings to Warnings
        const warnings: Record<string, Warning> = {};
        for (const [id, warning] of Object.entries(config.warnings.warnings)) {
            warnings[id] = Object.assign(warning, {
                category: Object.assign(
                    {
                        id: /* Category ID */ warning.category
                    },
                    config.warnings.categories[warning.category]
                ),
                type: SerializedWarningType[warning.type]
            }) as Warning;
        }

        // Convert all SerializableRevertOptions to RevertOptions
        const revertOptions: Record<string, RevertOption> = {};
        for (const [id, option] of Object.entries(config.revertOptions)) {
            revertOptions[id] = Object.assign(option, {
                id: id,
                severity:
                    ActionSeverity[
                        `${option.severity[0].toUpperCase()}${option.severity.substr(
                            1
                        )}` as keyof typeof ActionSeverity
                    ]
            });
        }

        return {
            configVersion: config.configVersion,
            wiki: config.wiki,
            meta: config.meta,
            warnings: {
                ipAdvice: config.warnings.ipAdvice,
                vandalismWarning: warnings[config.warnings.vandalismWarning],
                signatures: config.warnings.signatures,
                categories: categories,
                warnings: warnings
            },
            revertOptions: revertOptions
        };
    }
}
