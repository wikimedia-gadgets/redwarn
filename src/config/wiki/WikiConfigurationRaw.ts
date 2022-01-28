// Overrides WikiConfigurationBase with JSON-serializable types.
import WikiConfigurationBase from "rww/config/wiki/WikiConfigurationBase";
import { SerializedWarning, SerializedWarningCategories } from "rww/mediawiki";
import { SerializableRevertOption } from "rww/mediawiki/revert/RevertOptions";
import { SerializableReportVenue } from "rww/mediawiki/report/ReportVenue";

type WikiConfigurationRaw = WikiConfigurationBase & {
    warnings?: {
        categories?: SerializedWarningCategories;
        vandalismWarning?: string;
        warnings: Record<string, SerializedWarning>;
    };
    revertOptions?: Record<string, SerializableRevertOption>;
    reporting: SerializableReportVenue[];
};

export default WikiConfigurationRaw;
