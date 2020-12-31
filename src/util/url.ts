/**
 * Creates a URL string from a given set of parameters. This automatically
 * handles escaping.
 */
import { URIComponents } from "rww/wikipedia/URL";

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
