import RedWarnWikiConfiguration from "rww/data/wikiconfig/RedWarnWikiConfiguration";
import { WarningLevel } from "rww/mediawiki";

/**
 * Grabs the highest warning value from wikitext.
 * @param wikitext The wikitext to check for.
 */
export default function (wikitext: string): WarningLevel {
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
