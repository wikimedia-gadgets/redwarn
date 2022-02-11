import WikiTemplate from "../../../src/mediawiki/wikitext/WikiTemplate";

describe("WikiTemplate tests", () => {

    test("Object parameter constructor", () => {
        expect(
            new WikiTemplate("tlx", { "foo": "bar" })
                .build()
        ).toBe("{{tlx|foo=bar}}");
    });

    test("Array parameter constructor", () => {
        expect(
            new WikiTemplate("tlx", [ "foo", "bar" ])
                .build()
        ).toBe("{{tlx|foo|bar}}");
    });

    test("Named parameters with pipe in value", () => {
        expect(
            new WikiTemplate("tlx", [ "foo|bar" ])
                .build()
        ).toBe("{{tlx|foo{{!}}bar}}");
        expect(
            new WikiTemplate("tlx", { "foo": "bar|baz" })
                .build()
        ).toBe("{{tlx|foo=bar{{!}}baz}}");
    });

    test("Parameters with equal sign in value", () => {
        expect(
            new WikiTemplate("tlx", [ "1=foo" ])
                .build()
        ).toBe("{{tlx|1&#61;foo}}");
        expect(
            new WikiTemplate("tlx", { "1": "1=foo" })
                .build()
        ).toBe("{{tlx|1&#61;foo}}");
    });

    test("Forced parameter names", () => {
        expect(
            new WikiTemplate("tlx", ["bar", "baz"])
                .build({ forceParameterName: true })
        ).toBe("{{tlx|1=bar|2=baz}}");
        expect(
            new WikiTemplate("tlx", {1: "bar", 2: "baz", "qux": "quux"})
                .build({ forceParameterName: true })
        ).toBe("{{tlx|1=bar|2=baz|qux=quux}}");
    });

    test("Block type", () => {
        expect(
            new WikiTemplate("tlx", ["bar", "baz"])
                .build({ block: true })
        ).toBe("{{tlx\n|bar\n|baz\n}}");
        expect(
            new WikiTemplate("tlx", {1: "bar", 2: "baz", "qux": "quux"})
                .build({ block: true })
        ).toBe("{{tlx\n|bar\n|baz\n|qux=quux\n}}");
    });

    test("Zero-index correction", () => {
        expect(
            new WikiTemplate("tlx", {"0": "bar", "1": "baz", "2": "qux"})
                .build()
        ).toBe("{{tlx|bar|baz|qux}}");
        expect(
            new WikiTemplate("tlx", {"0": "bar", "1": "baz", 2: "qux"})
                .build()
        ).toBe("{{tlx|bar|baz|qux}}");
        expect(
            new WikiTemplate("tlx", {0: "bar", "1": "baz", "2": "qux"})
                .build()
        ).toBe("{{tlx|bar|baz|qux}}");
        expect(
            new WikiTemplate("tlx", {"0": "bar", 1: "baz", "2": "qux"})
                .build()
        ).toBe("{{tlx|bar|baz|qux}}");
    });

    test("Sparse numerical key compression", () => {
        expect(
            new WikiTemplate("tlx", {"2": "foo", "3": "bar"})
                .build()
        ).toBe("{{tlx||foo|bar}}");
        expect(
            new WikiTemplate("tlx", {"0": "bar", "1": "baz", "3": "qux", "4": "quux"})
                .build()
        ).toBe("{{tlx|bar|baz||qux|quux}}");
        expect(
            new WikiTemplate("tlx", {"1": "bar", "2": "baz", "5": "qux", "6": "quux"})
                .build()
        ).toBe("{{tlx|bar|baz|||qux|quux}}");
        expect(
            new WikiTemplate("tlx", {"1": "bar", "2": "baz", "6": "qux", "7": "quux"})
                .build()
        ).toBe("{{tlx|bar|baz|6=qux|7=quux}}");

        // Customized
        expect(
            new WikiTemplate("tlx", {"1": "bar", "2": "baz", "6": "qux", "7": "quux"})
                .build({ compressionMinimum: 3 })
        ).toBe("{{tlx|bar|baz||||qux|quux}}");
    });

    test("Falsy handling", () => {
        expect(
            new WikiTemplate("tlx", [null, 1])
                .build()
        ).toBe("{{tlx||1}}");
        expect(
            new WikiTemplate("tlx", [null, false, 1])
                .build()
        ).toBe("{{tlx|||1}}");
    });

});
