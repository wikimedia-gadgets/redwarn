import type {
    SerializedWarningCategories,
    Warning,
    WarningCategory,
} from "rww/mediawiki";
import {
    Page,
    SerializedWarning,
    SerializedWarningType,
    WarningLevel,
    WarningLevelSignature,
    WarningManager,
} from "rww/mediawiki";
import type {
    RevertOption,
    SerializableRevertOption,
} from "rww/definitions/RevertOptions";
import { ActionSeverity } from "rww/definitions/RevertOptions";
import { RW_WIKI_CONFIGURATION_VERSION } from "rww/data/RedWarnConstants";
import Log from "rww/data/RedWarnLog";

interface RawWikiConfiguration {
    configVersion: number;
    wiki: string;
    meta: {
        tag: string;
        link: string;
    };
    warnings: {
        ipAdvice: string | null;
        vandalismWarning: string;
        signatures: Record<Exclude<WarningLevel, 0>, WarningLevelSignature[]>;
        categories: SerializedWarningCategories;
        warnings: Record<string, SerializedWarning>;
    };
    revertOptions: Record<string, SerializableRevertOption>;
}

interface WikiConfiguration {
    configVersion: number;
    wiki: string;
    meta: {
        tag?: string;
        link: string;
    };
    warnings: {
        ipAdvice?: string | null;
        vandalismWarning: Warning;
        signatures: Record<Exclude<WarningLevel, 0>, WarningLevelSignature[]>;
        categories: WarningCategory[];
        warnings: Record<string, Warning>;
    };
    revertOptions: Record<string, RevertOption>;
}

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
        let rawConfig: Record<string, any> = null;
        try {
            rawConfig = JSON.parse(
                (
                    await Page.fromTitle(
                        "Project:RedWarn/configuration.json"
                    ).getLatestRevision()
                ).content
            );
        } catch (e) {
            try {
                rawConfig = await fetch(
                    ((): string => {
                        const url = new URL("//en.wikipedia.org/w/index.php");

                        // Do not use the short URL (`/wiki/Wikipedia:RedWarn/configuration.json`)
                        url.searchParams.set(
                            "title",
                            "Wikipedia:RedWarn/configuration.json"
                        );
                        url.searchParams.set("action", "raw");
                        url.searchParams.set("ctype", "application/json");

                        return url.toString();
                    })()
                ).then((req) => req.json());
            } catch (e) {
                // TODO: Proper errors
                throw new Error("Failed to get on-wiki configuration file.");
            }
        }

        /**
         * A fully-upgraded {@link RawWikiConfiguration} which can then be deserialized into
         * a proper {@link WikiConfiguration}.
         */
        let config: RawWikiConfiguration;
        if (rawConfig.configVersion < RW_WIKI_CONFIGURATION_VERSION)
            config = RedWarnWikiConfiguration.upgradeWikiConfiguration(
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
                )} instead. Templates may be missing or broken.`
            );
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
    private static upgradeWikiConfiguration(
        config: Record<string, any>
    ): RawWikiConfiguration {
        const upgraders: Record<
            number,
            (oldConfiguration: Record<string, any>) => Record<string, any>
        > = {};

        while (
            config.configVersion < RW_WIKI_CONFIGURATION_VERSION &&
            upgraders[config.configVersion] != null
        ) {
            config = upgraders[config.configVersion](config);
        }

        if (config.configVersion === RW_WIKI_CONFIGURATION_VERSION) {
            return config as RawWikiConfiguration;
        } else {
            // We ran out of valid upgraders.
            // TODO: Proper errors
            throw new Error(
                "Cannot upgrade wiki-configuration file: no valid configuration available."
            );
        }
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
                        id: /* Category ID */ warning.category,
                    },
                    config.warnings.categories[warning.category]
                ),
                type: SerializedWarningType[warning.type],
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
                    ],
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
                warnings: warnings,
            },
            revertOptions: revertOptions,
        };
    }
}
