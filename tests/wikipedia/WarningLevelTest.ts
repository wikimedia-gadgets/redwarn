import {getHighestLevel, WarningLevel} from "../../src/wikipedia/WarningLevel";

describe("WarningLevel Parser Tests", () => {
    const highestLevel : { level: WarningLevel, content : string }[] = [
        {
            level: WarningLevel.None,
            content: ""
        },
        {
            level: WarningLevel.Notice,
            content: "[[File:Information.svg]]"
        },
        {
            level: WarningLevel.Caution,
            content: "[[File:Information orange.svg]]"
        },
        {
            level: WarningLevel.Warning,
            content: "[[File:Nuvola apps important.svg]]"
        },
        {
            level: WarningLevel.Final,
            content: "[[File:Stop hand nuvola.svg]]"
        },
        {
            level: WarningLevel.Final,
            content: "[[File:Stop hand nuvola.svg]][[File:Information orange.svg]]"
        },
        {
            level: WarningLevel.Final,
            content: "[[File:Information orange.svg]][[File:Stop hand nuvola.svg]]"
        },
        {
            level: WarningLevel.Caution,
            content: "[[File:Information orange.svg]][[File:Information.svg]]"
        },
    ];

    for (const patternId in highestLevel) {
        const testingPattern = highestLevel[patternId];
        test(`Highest level checks #${patternId}`, () => {
            expect(getHighestLevel(testingPattern.content).level).toEqual(testingPattern.level);
        });
    }
});