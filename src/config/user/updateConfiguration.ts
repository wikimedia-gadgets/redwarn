import { RW_CONFIG_VERSION } from "rww/data/RedWarnConstants";
import { RevertMethod } from "rww/config/user/ConfigurationEnums";
import { RevertDoneOption } from "rww/mediawiki/revert/RevertDoneOptions";
import Log from "rww/data/RedWarnLog";

type ConfigurationUpdater = (
    oldConfig: Record<string, unknown>
) => Record<string, unknown>;

/**
 * A full collection of all configuration updaters.
 *
 * Updaters are indexed by configuration version, with an index of `2`
 * set to upgrade a configuration file from version `2` to `3`. This
 * entire array should be in sequence, and should always have an updater
 * from configuration version 0 (pre-TypeScript RedWarn) up to the latest
 * configuration version ({@link RW_CONFIG_VERSION}) minus one.
 */
const configurationUpdaters: { [key: number]: ConfigurationUpdater } = {
    /*
     * NOTE: Modify as if you're rewriting the actual RedWarn configuration,
     * not as if you were rewriting a `Settings` value.
     *
     * You are allowed to mutate the provided `config` object, since it is not
     * the actual value. `config` is deep-copied from the old configuration.
     */

    /**
     * Updater for configuration version 0 (v0.1.16, RedWarn pre-TypeScript)
     *
     * @param config The old configuration.
     */
    0: (config) => {
        for (const [key, value] of Object.entries(config)) {
            switch (key) {
                case "rwRollbackDoneOption":
                    switch (value) {
                        case "RWRBDONEmrevPg":
                            config.revertDoneOption =
                                RevertDoneOption.LatestRevision;
                            break;
                        case "RWRBDONEnewUsrMsg":
                            config.revertDoneOption =
                                RevertDoneOption.NewMessage;
                            break;
                        case "RWRBDONEwelcomeUsr":
                            config.revertDoneOption =
                                RevertDoneOption.QuickTemplate;
                            break;
                        case "RWRBDONEwarnUsr":
                            config.revertDoneOption = "warnUser";
                            break;
                        case "RWRBDONEreportUsr":
                            config.revertDoneOption = "reportUser";
                            break;
                        default:
                            Log.error("Unknown rwRollbackDoneOption:", value);
                    }
                    delete config.rwRollbackDoneOption;
                    break;
                case "rollbackMethod":
                    switch (config.rollbackMethod) {
                        case "rollbackLike":
                            config.rollbackMethod = RevertMethod.Undo;
                            break;
                        case "rollback":
                            config.rollbackMethod = RevertMethod.Rollback;
                            break;
                        default:
                            config.rollbackMethod = RevertMethod.Unset;
                            break;
                    }
                    break;
                case "lastVersion":
                    // We used to rely on a number-based version system. Convert this to the semantic
                    // versioning style used now.
                    config.latestVersion = "0.1." + config.latestVersion;
                    delete config.lastVersion;
                    break;
            }
        }

        config.configVersion = 1;
        return config;
    }
};

/**
 * Recursively updates a config through each version to get it up to the latest.
 * @param oldConfig
 */
export default function (oldConfig: Record<string, any>): Record<string, any> {
    let modifiedConfig: Record<string, any> = JSON.parse(
        JSON.stringify(oldConfig)
    );

    while (modifiedConfig.configVersion < RW_CONFIG_VERSION) {
        if (configurationUpdaters[modifiedConfig.configVersion ?? 0] == null)
            throw `No updater for configuration version: ${modifiedConfig.configVersion}`;

        modifiedConfig = configurationUpdaters[
            modifiedConfig.configVersion ?? 0
        ](modifiedConfig);
    }

    return modifiedConfig;
}
