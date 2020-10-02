import regexClone from "../util/regexClone";

export enum WarningLevel {
    None,
    Notice,
    Caution,
    Warning,
    Final,
    PolicyViolation,
}

export interface WarningAnalysis {
    level: WarningLevel;
    notices?: string;
    pageContent?: string;
}

const WarningSignatures: { [key in WarningLevel]?: RegExp } = {
    [WarningLevel.Notice]: /(File|Image):Information.svg/gi,
    [WarningLevel.Caution]: /(File|Image):Information orange.svg/gi,
    [WarningLevel.Warning]: /(File|Image):(Nuvola apps important|Ambox warning pn).svg/gi,
    [WarningLevel.Final]: /(File|Image):Stop hand nuvola.svg/gi,
};

export function getHighestLevel(wikitext: string): WarningAnalysis {
    let highestWarningLevel = WarningLevel.None;

    // To identify the warning level, RedWarn has to rely on the icon used by the
    // template. The logo, however, can change per wiki. This means:
    // TODO Add support for the warning logos of other wikis.
    for (const [level, regex] of Object.entries(WarningSignatures).sort(
        (a, b) => +b[0] - +a[0]
    )) {
        if (+level > +highestWarningLevel) {
            if (regexClone(regex).test(wikitext)) highestWarningLevel = +level;
        }
    }

    return {
        level: highestWarningLevel,
        notices: wikitext,
        pageContent: wikitext,
    };
}
