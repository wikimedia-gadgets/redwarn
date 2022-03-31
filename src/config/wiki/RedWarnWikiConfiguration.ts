import { Page, WarningManager } from "app/mediawiki";
import {
    RW_FALLBACK_CONFIG,
    RW_WIKI_CONFIGURATION_PAGES,
    RW_WIKI_CONFIGURATION_VERSION,
} from "app/data/RedWarnConstants";
import Log from "app/data/RedWarnLog";
import WikiConfiguration from "./WikiConfiguration";
import WikiConfigurationRaw from "./WikiConfigurationRaw";
import updateWikiConfiguration from "app/config/wiki/updateWikiConfiguration";
import WikiConfigurationDeserializers from "app/config/wiki/WikiConfigurationDeserializers";
import i18next from "i18next";
import RedWarnUI from "app/ui/RedWarnUI";
import MediaWikiNotificationContent from "app/ui/MediaWikiNotificationContent";

/**
 * This class handles every single contact with the RedWarn per-wiki
 * configuration file, usually found at `Project:RedWarn/configuration.json`.
 *
 * The path of the configuration file is modified with the constant
 * {@link RW_WIKI_CONFIGURATION_PAGES}.
 */
export default class RedWarnWikiConfiguration {
    private static _loadedConfiguration: WikiConfiguration;
    public static get c(): WikiConfiguration {
        return RedWarnWikiConfiguration._loadedConfiguration;
    }

    private static preloadedData: Record<string, any>;
    static async preloadWikiConfiguration(): Promise<Record<string, any>> {
        try {
            const configurationPages = RW_WIKI_CONFIGURATION_PAGES.map((t) =>
                Page.fromTitle(t)
            );
            await Page.getLatestRevisions(configurationPages, {
                followRedirects: true,
                throwIfMissing: false,
            });
            const primaryConfiguration = configurationPages.find(
                (p) => p.latestCachedRevision != null
            );
            Log.debug(
                `Using configuration from ${primaryConfiguration.title.getPrefixedDb()}`
            );

            RedWarnWikiConfiguration.preloadedData = JSON.parse(
                primaryConfiguration.latestCachedRevision.content
            );
        } catch (e) {
            Log.error(e);
            try {
                // Use the API to get the fallback configuration.
                RedWarnWikiConfiguration.preloadedData = await fetch(
                    RW_FALLBACK_CONFIG
                ).then((req) => req.json());
            } catch (e) {
                if (e.message.includes("NetworkError")) {
                    new RedWarnUI.AlertDialog({
                        content: MediaWikiNotificationContent(
                            i18next.t("mediawiki:error.wikiConfigBlocked")
                        ),
                        actions: [{ data: `${i18next.t("ui:close")}` }],
                    });
                }
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
         * A basic JSON object holding keys for what is supposed to be a {@link WikiConfigurationRaw}.
         */
        const rawConfig: Record<string, any> =
            RedWarnWikiConfiguration.preloadedData ??
            (await RedWarnWikiConfiguration.preloadWikiConfiguration());

        /**
         * A fully-upgraded {@link WikiConfigurationRaw} which can then be deserialized into
         * a proper {@link WikiConfiguration}.
         */
        let config: WikiConfigurationRaw;
        if (rawConfig.configVersion < RW_WIKI_CONFIGURATION_VERSION)
            config = await RedWarnWikiConfiguration.upgradeWikiConfiguration(
                rawConfig
            );
        else config = rawConfig as WikiConfigurationRaw;

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

        RedWarnWikiConfiguration._loadedConfiguration =
            RedWarnWikiConfiguration.deserializeWikiConfiguration(config);

        // Refresh whatever needs refreshing.
        WarningManager.refresh();
        Log.debug("Loaded per-wiki configuration.");
    }

    /**
     * Attempt to upgrade an outdated configuration file.
     */
    private static async upgradeWikiConfiguration(
        config: Record<string, any>
    ): Promise<WikiConfigurationRaw> {
        return updateWikiConfiguration(config);
    }

    private static deserializeWikiConfiguration(
        config: WikiConfigurationRaw
    ): WikiConfiguration {
        const preDeserializeConfig = JSON.parse(JSON.stringify(config));
        const deserializeChunk = (
            chunk: Record<string, any>,
            deserializerSet: Record<string, any>
        ) => {
            // Run through fields first.
            for (const [key, deserializer] of Object.entries(deserializerSet)) {
                if (chunk[key] != null) {
                    if (typeof deserializer === "function")
                        chunk[key] = deserializer(
                            chunk[key],
                            preDeserializeConfig,
                            config
                        );
                    else if (typeof deserializer._self === "function")
                        chunk[key] = deserializer._self(
                            chunk[key],
                            preDeserializeConfig,
                            config
                        );
                }
            }

            // Run through subrecords.
            for (const [key, value] of Object.entries(deserializerSet)) {
                if (chunk[key] != null && typeof value === "object") {
                    chunk[key] = deserializeChunk(chunk[key], value);
                }
            }

            return chunk;
        };
        return deserializeChunk(
            config,
            WikiConfigurationDeserializers
        ) as WikiConfiguration;
    }
}
