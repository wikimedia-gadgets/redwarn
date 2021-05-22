import regexClone from "rww/util/regexClone";
import { Page } from "rww/mediawiki";

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
    Immediate,
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

export const WarningLevelComments: {
    [key in WarningLevel]: {
        summary?: string;
        description: string;
        alternative?: string;
    };
} = {
    [WarningLevel.None]: {
        // Unused. Here for type checks.
        description: "Friendly reminder",
    },
    [WarningLevel.Notice]: {
        description: "Assumes good faith",
    },
    [WarningLevel.Caution]: {
        description: "No assumption of faith",
    },
    [WarningLevel.Warning]: {
        description: "Assumes bad faith \u2013 cease and desist",
    },
    [WarningLevel.Final]: {
        summary: "Final Warning",
        description: "Bad faith, last warning.",
    },
    [WarningLevel.Immediate]: {
        alternative: "4im",
        summary: "Only Warning",
        description: "Only warning \u2013 used for severe policy violations",
    },
};

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
    [WarningLevel.Immediate]: /<!--\s*Template:uw-.+?4im\s*-->/gi,
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
