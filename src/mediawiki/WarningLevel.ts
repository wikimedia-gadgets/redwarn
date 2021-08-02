import type { Page } from "rww/mediawiki";
import RedWarnWikiConfiguration from "rww/data/RedWarnWikiConfiguration";

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
        summary: "Final warning",
        description: "Bad faith, last warning.",
    },
    [WarningLevel.Immediate]: {
        alternative: "4im",
        summary: "Only warning",
        description: "Only warning \u2013 used for severe policy violations",
    },
};

export interface IncludesWarningLevelSignature {
    type: "includes";
    substring: string;
}

export interface RegexWarningLevelSignature {
    type: "regex";
    source: string;
    flags: string;
}

export type WarningLevelSignature =
    | IncludesWarningLevelSignature
    | RegexWarningLevelSignature;

/**
 * Grabs the highest warning value from wikitext.
 * @param wikitext The wikitext to check for.
 */
export function getHighestWarningLevel(wikitext: string): WarningLevel {
    let highestWarningLevel = WarningLevel.None;

    for (const [level, checks] of Object.entries(
        RedWarnWikiConfiguration.c.warnings.signatures
    ).sort((a, b) => +b[0] - +a[0])) {
        if (+level > +highestWarningLevel) {
            checkLoop: for (const check of checks) {
                switch (check.type) {
                    case "includes":
                        if (wikitext.includes(check.substring)) {
                            highestWarningLevel = +level;
                            break checkLoop;
                        }
                        break;
                    case "regex":
                        if (
                            new RegExp(check.source, check.flags).test(wikitext)
                        ) {
                            highestWarningLevel = +level;
                            break checkLoop;
                        }
                        break;
                }
            }
        }
    }

    return highestWarningLevel;
}
