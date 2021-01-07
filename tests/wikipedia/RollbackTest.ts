import RedWarnWebTestUtils from "../RedWarnWebTestUtils";
import RedWarnStore from "../../src/data/RedWarnStore";
import { Rollback } from "../../src/mediawiki/Rollback";

RedWarnWebTestUtils.initialize();

describe("Rollback flow tests", () => {
    // Mock English Wikipedia
    RedWarnStore.wikiIndex = "https://en.wikipedia.org/w/index.php";

    function mockMW(
        oldId: number | null | false,
        newId: number | null | false
    ) {
        (global as any).mw = {
            config: {
                get(parameter: string): number | null | false {
                    switch (parameter) {
                        case "wgDiffOldId":
                            return oldId;
                        case "wgDiffNewId":
                            return newId;
                    }
                },
            },
        };
    }

    interface RollbackTestCase {
        oldId: number | null | false;
        newId: number | null | false;
        testHTML: string;
        // [ expected old id, expected new id ]
        expected: [number, number];
    }

    const testCases: { [key: string]: RollbackTestCase } = {
        "Invalid diff page": {
            oldId: null,
            newId: null,
            testHTML: "blank",
            expected: [null, null],
        },
        "Single revision (only revision)": {
            oldId: 67890,
            newId: 67890,
            testHTML: "diff_onlyrev",
            expected: [67890, 67890],
        },
        "Older revision | Newer revision": {
            oldId: 12345,
            newId: 67890,
            testHTML: "diff_on",
            expected: [12345, 67890],
        },
        "Newer revision | Older revision": {
            oldId: 67890,
            newId: 12345,
            testHTML: "diff_no",
            expected: [12345, 67890],
        },
    };

    for (const testName of Object.keys(testCases)) {
        test(testName, () => {
            const testCase = testCases[testName];
            mockMW(testCase.oldId, testCase.newId);

            const newer = Rollback.getNewerRevisionId();
            expect(newer).toEqual(testCase.expected[1]);

            const older = Rollback.getOlderRevisionId();
            expect(older).toEqual(testCase.expected[0]);
        });
    }
});
