import semanticDifference from "../../../src/util/semanticDifference";

describe("Semantic difference tests", () => {
    const pairs: [number, string, string][] = [
        [null, null, null],
        [0, "1.0.0", "1.0.0"],
        [0, "1.2.2", "1.2.2"],
        [0, "0.2.0", "0.2.0"],
        [0, "0.0.1", "0.0.1"],

        [-1, "1.0.0", "1.2.0"],
        [-1, "1.0.0", "1.0.2"],
        [-1, "1.0.0", "2.0.0"],
        [-1, "0.2.0", "1.0.0"],
        [-1, "0.0.2", "1.0.0"],
        [-1, "0.0.0", "1.0.0"],

        [1, "1.2.0", "1.0.0"],
        [1, "1.0.2", "1.0.0"],
        [1, "2.0.0", "1.0.0"],
        [1, "1.0.0", "0.2.0"],
        [1, "1.0.0", "0.0.2"],
        [1, "1.0.0", "0.0.0"],

        [1, "1.35.1", "1.30.0"],
        [-1, "1.30.0", "1.35.1"]
    ];

    for (const pair of pairs) {
        test(`${pair[1]} and ${pair[2]}`, () => {
            expect(semanticDifference(pair[1], pair[2])).toEqual(pair[0]);
        });
    }
});
