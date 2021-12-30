import { URIComponents } from "rww/mediawiki/util/URL";

/**
 * Creates a URL string from a given set of parameters. This automatically
 * handles escaping.
 *
 * @param baseURL The base URL.
 * @param queryParameters A set of parameters that will be passed in the returned URL.
 * @param additionalURIComponents Additonal components of the URL.
 */
export default function (
    baseURL: string | URL,
    queryParameters?: Record<string, any>,
    additionalURIComponents?: URIComponents
): string {
    let url: URL;

    if (typeof baseURL === "string") {
        const a = document.createElement("a");
        a.href = baseURL; // need this hack so relative URLs get parsed
        url = new URL(a.href);
    } else {
        url = baseURL;
    }

    if (queryParameters != null) {
        for (const parameter in queryParameters) {
            if (
                queryParameters.hasOwnProperty(parameter) &&
                queryParameters[parameter] != null
            ) {
                url.searchParams.set(parameter, queryParameters[parameter]);
            }
        }
    }

    if (!!additionalURIComponents) {
        if (!!additionalURIComponents.fragment) {
            url.hash = additionalURIComponents.fragment;
        }
        if (!!additionalURIComponents.query) {
            additionalURIComponents.query.forEach((value, key) => {
                url.searchParams.append(key, value);
            });
        }
    }

    return url.toString();
}
