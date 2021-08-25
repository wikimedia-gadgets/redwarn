/**
 * Attempt to upgrade an outdated configuration file.
 */
import { RW_WIKI_CONFIGURATION_VERSION } from "rww/data/RedWarnConstants";
import WikiConfigurationRaw from "rww/config/wiki/WikiConfigurationRaw";

const upgraders: Record<
    number,
    (oldConfiguration: Record<string, any>) => Record<string, any>
> = {};

export default function (config: Record<string, any>): WikiConfigurationRaw {
    let newConfig: Record<string, any> = config;

    while (
        newConfig.configVersion < RW_WIKI_CONFIGURATION_VERSION &&
        upgraders[newConfig.configVersion] != null
    ) {
        newConfig = upgraders[newConfig.configVersion](newConfig);
    }

    if (newConfig.configVersion === RW_WIKI_CONFIGURATION_VERSION) {
        return newConfig as WikiConfigurationRaw;
    } else {
        // We ran out of valid upgraders.
        // TODO: Proper errors
        throw new Error(
            "Cannot upgrade wiki-configuration file: no valid configuration available."
        );
    }
}
