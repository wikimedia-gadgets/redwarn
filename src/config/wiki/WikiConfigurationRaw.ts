// Overrides WikiConfigurationBase with JSON-serializable types.
import WikiConfigurationBase from "rww/config/wiki/WikiConfigurationBase";
import { SerializedWarning, SerializedWarningCategories } from "rww/mediawiki";
import { SerializableRevertOption } from "rww/mediawiki/revert/RevertOptions";

type WikiConfigurationRaw = WikiConfigurationBase & {
    warnings?: {
        categories?: SerializedWarningCategories;
        vandalismWarning?: string;
        warnings: Record<string, SerializedWarning>;
    };
    revertOptions?: Record<string, SerializableRevertOption>;
};

export default WikiConfigurationRaw;
