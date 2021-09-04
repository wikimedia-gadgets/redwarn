import { RW_VERSION } from "rww/data/RedWarnConstants";

if (window.RedWarnLanguages == null) {
    window.RedWarnLanguages = [];
}

window.RedWarnLanguages.push({
    tag: "en-US",
    id: "redwarn-default-en-US",
    meta: {
        name: "RedWarn English",
        translators: ["The RedWarn Contributors"],
        license: {
            url: "https://www.apache.org/licenses/LICENSE-2.0.txt",
            text: "Apache License 2.0"
        },
        version: RW_VERSION,
        links: {
            home: "https://en.wikipedia.org/wiki/Wikpedia:RedWarn",
            license:
                "https://gitlab.com/redwarn/redwarn-web/-/blob/master/LICENSE"
        }
    },
    namespaces: {
        common: require("./common.json"),
        mediawiki: require("./mediawiki.json"),
        ui: require("./ui.json"),
        misc: require("./misc.json"),
        prefs: require("./prefs.json"),
        revert: require("./revert.json")
    }
});
