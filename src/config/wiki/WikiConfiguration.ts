// Overrides WikiConfigurationBase with RedWarn-usable types.
import WikiConfigurationBase from "rww/config/wiki/WikiConfigurationBase";
import { Warning, WarningCategory } from "rww/mediawiki";
import { RevertOption } from "rww/mediawiki/revert/RevertOptions";

type WikiConfiguration = WikiConfigurationBase & {
    warnings?: {
        categories?: WarningCategory[];
        vandalismWarning?: Warning;
        warnings: Record<string, Warning>;
    };
    revertOptions?: Record<string, RevertOption>;
};

export default WikiConfiguration;
