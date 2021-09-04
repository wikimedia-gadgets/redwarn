// noinspection ES6PreferShortImport
import { MediaWikiURL } from "../../../src/mediawiki/util/URL";
import RedWarnStore from "../../../src/data/RedWarnStore";

describe("URL generation tests", () => {
    // Mock English Wikipedia
    RedWarnStore.wikiIndex = "https://en.wikipedia.org/w/index.php";

    // Mock MediaWiki
    // https://doc.wikimedia.org/mediawiki-core/master/js/source/util.html#mw-util-method-wikiUrlencode
    function rawurlencode(str: string) {
        return encodeURIComponent(String(str))
            .replace(/!/g, "%21")
            .replace(/'/g, "%27")
            .replace(/\(/g, "%28")
            .replace(/\)/g, "%29")
            .replace(/\*/g, "%2A")
            .replace(/~/g, "%7E");
    }

    (global as any).mw = {
        util: {
            wikiUrlencode: function (str: string) {
                return (
                    rawurlencode(str)
                        .replace(/%20/g, "_")
                        // wfUrlencode replacements
                        .replace(/%3B/g, ";")
                        .replace(/%40/g, "@")
                        .replace(/%24/g, "$")
                        .replace(/%21/g, "!")
                        .replace(/%2A/g, "*")
                        .replace(/%28/g, "(")
                        .replace(/%29/g, ")")
                        .replace(/%2C/g, ",")
                        .replace(/%2F/g, "/")
                        .replace(/%7E/g, "~")
                        .replace(/%3A/g, ":")
                );
            }
        }
    };

    const pairs: { [key: string]: [string, string] } = {
        histStandard: [
            "https://en.wikipedia.org/w/index.php?title=Wikipedia:Sandbox&action=history",
            MediaWikiURL.getHistoryUrl("Wikipedia:Sandbox")
        ],
        histWhitespace: [
            "https://en.wikipedia.org/w/index.php?title=Wikipedia:Sandbox_1&action=history",
            MediaWikiURL.getHistoryUrl("Wikipedia:Sandbox 1")
        ],
        histSubpage: [
            "https://en.wikipedia.org/w/index.php?title=Wikipedia:Sandbox/1&action=history",
            MediaWikiURL.getHistoryUrl("Wikipedia:Sandbox/1")
        ],

        diffStandalone: [
            "https://en.wikipedia.org/w/index.php?diff=12345&diffmode=source",
            MediaWikiURL.getDiffUrl("12345")
        ],
        diffWithOld: [
            "https://en.wikipedia.org/w/index.php?diff=12345&oldid=67890&diffmode=source",
            MediaWikiURL.getDiffUrl("12345", "67890")
        ]
    };

    for (const testName of Object.keys(pairs)) {
        const pair = pairs[testName];
        test(testName, () => {
            const url1 = new URL(pair[0]);
            const url2 = new URL(pair[1]);

            // Check if the leading part (protocol, host, port, path, etc.)
            expect(pair[0].split("?")[0]).toEqual(pair[1].split("?")[0]);

            const url1Params = url1.searchParams;
            const url2Params = url2.searchParams;

            url1Params.sort();
            url2Params.sort();

            // Check the query parameters if they match.
            expect(url1Params.toString()).toEqual(url2Params.toString());
        });
    }
});
