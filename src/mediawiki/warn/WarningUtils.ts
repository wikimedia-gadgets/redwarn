import RedWarnWikiConfiguration from "app/config/wiki/RedWarnWikiConfiguration";
import { WarningLevel } from "app/mediawiki";

/**
 * Grabs the highest warning value from wikitext.
 * @param wikitext The wikitext to check for.
 */
export function highestWarningLevel(wikitext: string): WarningLevel {
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

export function warningSuffix(warningLevel: WarningLevel): string {
    switch (warningLevel) {
        case null:
            return "";
        case WarningLevel.None:
            return "";
        case WarningLevel.Notice:
            return "1";
        case WarningLevel.Caution:
            return "2";
        case WarningLevel.Warning:
            return "3";
        case WarningLevel.Final:
            return "4";
        case WarningLevel.Immediate:
            return "4im";
    }
}
