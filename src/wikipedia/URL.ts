import RedWarnStore from "rww/data/RedWarnStore";
import url from "rww/util/url";

/**
 * Utility class for generating a URL on Wikipedia.
 */
export default class WikipediaURL {
    /**
     * Get the link to a page's revision history.
     * @param page The page to find the history for.
     * @param fragment The URI fragment to use (i.e. the #fragment)
     */
    static getHistoryUrl(page: string, fragment?: string): string {
        return url(
            RedWarnStore.wikiIndex,
            {
                title: mw.util.wikiUrlencode(page),
                action: "history",
            },
            fragment
        );
    }

    // Page is no longer required as Wikipedia can automatically resolve the page.
    /**
     * Gets the diff page for a given diff ID (and an optional ID to compare with).
     * @param revId The newer revision ID to compare to.
     * @param oldId The older revision ID to compare against.
     * @param fragment The URI fragment to use (i.e. the #fragment)
     */
    static getDiffUrl(
        revId: string,
        oldId?: string,
        fragment?: string
    ): string {
        return url(
            RedWarnStore.wikiIndex,
            {
                diff: revId,
                oldid: oldId,
                diffmode: "source",
            },
            fragment
        );
    }
}
