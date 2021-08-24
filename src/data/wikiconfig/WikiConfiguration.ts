import type {
    Warning,
    WarningCategory,
    WarningLevel,
    WarningLevelSignature
} from "rww/mediawiki";
import type { RevertOption } from "rww/data/RevertOptions";

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

export default WikiConfiguration;
