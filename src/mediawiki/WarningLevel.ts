import regexClone from "rww/util/regexClone";
import { Page } from "rww/mediawiki/MediaWiki";

/**
 * The Warning Level is derived from the English Wikipedia's four-level tier
 * system for issuing user warnings.
 */
export enum WarningLevel {
    /** No warnings issued. */
    None,
    /** A notice-level warning. */
    Notice,
    /** A caution-level warning for no-assumption cases. */
    Caution,
    /** A warning-level warning for bad faith assumption cases */
    Warning,
    /** A final warning for repeated bad faith edits. */
    Final,
    /** A single-issue final warning for gross violations of policy. */
    PolicyViolation,
}

/**
 * The Warning Analysis is a comment of the user's collective issued warnings.
 */
export interface WarningAnalysis {
    /** The highest warning level for a user. **/
    level: WarningLevel;
    /** The wikitext of the user's collected warnings (for the given month). **/
    notices?: string;
    /** The page analyzed. **/
    page?: Page;
}

/**
 * Warning signatures are used to trace the existence of a warning on a user's
 * talk page. If a given signature was found on the talk page, the warning
 * level corresponding to that signature is used, with the highest level being
 * the final value.
 */
export const WarningSignatures: { [key in WarningLevel]?: RegExp } = {
    [WarningLevel.Notice]: /<!--\s*Template:uw-.+?1\s*-->/gi,
    [WarningLevel.Caution]: /<!--\s*Template:uw-.+?2\s*-->/gi,
    [WarningLevel.Warning]: /<!--\s*Template:uw-.+?3\s*-->/gi,
    [WarningLevel.Final]: /<!--\s*Template:uw-.+?4\s*-->/gi,
    [WarningLevel.PolicyViolation]: /<!--\s*Template:uw-.+?4im\s*-->/gi,
};

// TODO isolate MDC icons from redwarn icons (icon map?)
export const WarningIcons: {
    [key in WarningLevel]: { icon: string; iconColor: string };
} = {
    [WarningLevel.None]: {
        icon: "check_circle",
        iconColor: "green",
    },
    [WarningLevel.Notice]: {
        icon: "info",
        iconColor: "blue",
    },
    [WarningLevel.Caution]: {
        icon: "announcement",
        iconColor: "orange",
    },
    [WarningLevel.Warning]: {
        icon: "warning",
        iconColor: "red",
    },
    [WarningLevel.Final]: {
        icon: "report", // This one has hard edges
        iconColor: "darkred",
    },
    [WarningLevel.PolicyViolation]: {
        icon: "new_releases", // This one has star-like edges
        iconColor: "darkred",
    },
};

/**
 * Grabs the highest warning value from wikitext.
 * @param wikitext The wikitext to check for.
 */
export function getHighestWarningLevel(wikitext: string): WarningLevel {
    let highestWarningLevel = WarningLevel.None;

    // TODO Implement per-wiki signature checking.
    for (const [level, regex] of Object.entries(WarningSignatures).sort(
        (a, b) => +b[0] - +a[0]
    )) {
        if (+level > +highestWarningLevel) {
            if (regexClone(regex).test(wikitext)) {
                highestWarningLevel = +level;
            }
        }
    }

    return highestWarningLevel;
}
