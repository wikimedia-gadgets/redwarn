// Overrides WikiConfigurationBase with JSON-serializable types.
import WikiConfigurationBase from "app/config/wiki/WikiConfigurationBase";
import { SerializedWarning, SerializedWarningCategories } from "app/mediawiki";
import { SerializableRevertOption } from "app/mediawiki/revert/RevertOptions";
import { SerializableReportVenue } from "app/mediawiki/report/ReportVenue";

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
