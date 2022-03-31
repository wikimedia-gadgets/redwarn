// Overrides WikiConfigurationBase with RedWarn-usable types.
import WikiConfigurationBase from "app/config/wiki/WikiConfigurationBase";
import { Warning, WarningCategory } from "app/mediawiki";
import { RevertOption } from "app/mediawiki/revert/RevertOptions";

type WikiConfiguration = WikiConfigurationBase & {
    warnings?: {
        categories?: WarningCategory[];
        vandalismWarning?: Warning;
        warnings: Record<string, Warning>;
    };
    revertOptions?: Record<string, RevertOption>;
};

export default WikiConfiguration;
