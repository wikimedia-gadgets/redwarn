import { RW_VERSION } from "../../data/RedWarnConstants";

if (window.RedWarnLanguages == null) {
    window.RedWarnLanguages = [];
}

window.RedWarnLanguages.push({
    tag: "en-US",
    id: "the-only-correct-type-of-english",
    meta: {
        name: "RedWarn English",
        translators: ["The RedWarn Contributors"],
        license: {
            url: "https://www.apache.org/licenses/LICENSE-2.0.txt",
            text: "Apache License 2.0",
        },
        version: RW_VERSION,
        links: {
            home: "https://en.wikipedia.org/wiki/Wikpedia:RedWarn",
            license:
                "https://gitlab.com/redwarn/redwarn-web/-/blob/master/LICENSE",
        },
    },
    namespaces: {
        common: import("./common.json"),
        wikipedia: import("./wikipedia.json"),
    },
});
