import regexClone from "../util/regexClone";

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
    /** The wikitext of the user's talk page. **/
    pageContent?: string;
}

/**
 * Warning signatures are used to trace the existence of a warning on a user's
 * talk page. If a given signature was found on the talk page, the warning
 * level corresponding to that signature is used, with the highest level being
 * the final value.
 */
const WarningSignatures: { [key in WarningLevel]?: RegExp } = {
    [WarningLevel.Notice]: /(File|Image):Information.svg/gi,
    [WarningLevel.Caution]: /(File|Image):Information orange.svg/gi,
    [WarningLevel.Warning]: /(File|Image):(Nuvola apps important|Ambox warning pn).svg/gi,
    [WarningLevel.Final]: /(File|Image):Stop hand nuvola.svg/gi,
};

/**
 * Grabs the highest warning value from wikitext.
 * @param wikitext The wikitext to parse.
 */
export function getHighestLevel(wikitext: string): WarningAnalysis {
    let highestWarningLevel = WarningLevel.None;

    // To identify the warning level, RedWarn has to rely on the icon used by the
    // template. The logo, however, can change per wiki. This means:
    // TODO Add support for the warning logos of other wikis.
    for (const [level, regex] of Object.entries(WarningSignatures).sort(
        (a, b) => +b[0] - +a[0]
    )) {
        if (+level > +highestWarningLevel) {
            if (regexClone(regex).test(wikitext)) {
                highestWarningLevel = +level;
            }
        }
    }

    return {
        level: highestWarningLevel,
        notices: wikitext,
        pageContent: wikitext,
    };
}
