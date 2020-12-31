import RedWarnStore from "rww/data/RedWarnStore";
import url from "rww/util/url";

export interface URIComponents {
    query?: URLSearchParams;
    fragment?: string;
}

/**
 * Utility class for generating a URL on Wikipedia.
 */
export default class WikipediaURL {
    /**
     * Get the link to a page's revision history.
     * @param page The page to find the history for.
     * @param additionalURIComponents Additional URI components to include.
     */
    static getHistoryUrl(
        page: string,
        additionalURIComponents?: URIComponents
    ): string {
        return url(
            RedWarnStore.wikiIndex,
            {
                title: mw.util.wikiUrlencode(page),
                action: "history",
            },
            additionalURIComponents
        );
    }

    // Page is no longer required as Wikipedia can automatically resolve the page.
    /**
     * Gets the diff page for a given diff ID (and an optional ID to compare with).
     * @param targetRevisionID The newer revision ID to compare to.
     * @param sourceRevisionID The older revision ID to compare against.
     * @param additionalURIComponents Additional URI components to include.
     */
    static getDiffUrl(
        targetRevisionID: number | string,
        sourceRevisionID?: number | string,
        additionalURIComponents?: URIComponents
    ): string {
        return url(
            RedWarnStore.wikiIndex,
            {
                diff: targetRevisionID,
                oldid: sourceRevisionID,
                diffmode: "source",
            },
            additionalURIComponents
        );
    }
}
