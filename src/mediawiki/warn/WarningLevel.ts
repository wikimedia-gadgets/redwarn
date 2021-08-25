import type { Page } from "rww/mediawiki";

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
        description: "Friendly reminder"
    },
    [WarningLevel.Notice]: {
        description: "Assumes good faith"
    },
    [WarningLevel.Caution]: {
        description: "No assumption of faith"
    },
    [WarningLevel.Warning]: {
        description: "Assumes bad faith \u2013 cease and desist"
    },
    [WarningLevel.Final]: {
        summary: "Final warning",
        description: "Bad faith, last warning."
    },
    [WarningLevel.Immediate]: {
        alternative: "4im",
        summary: "Only warning",
        description: "Only warning \u2013 used for severe policy violations"
    }
};

/**
 * A warning level signature that searches a page for a specific string of wikitext.
 */
export interface IncludesWarningLevelSignature {
    /**
     * The type determines whether or not this signature is includes-based or
     * regular expression-based.
     */
    type: "includes";
    /**
     * The wikitext to look for.
     *
     * @example "<-- uw:1 -->"
     */
    substring: string;
}

export interface RegexWarningLevelSignature {
    /**
     * The type determines whether or not this signature is includes-based or
     * regular expression-based.
     */
    type: "regex";
    /**
     * The regular expression source. If you were writing a JavaScript RegExp
     * literal, this would be what goes in between the slashes.
     *
     * @example "<!--\s*Template:uw-.+?1\s*-->"
     */
    source: string;
    /**
     * The regular expression flags. This is equal to the flags provided by
     * JavaScript. You are not required to add a "g" flag, since RedWarn
     * will locate only one instance of that signature.
     *
     * @example "i"
     */
    flags?: string;
}

export type WarningLevelSignature =
    | IncludesWarningLevelSignature
    | RegexWarningLevelSignature;
