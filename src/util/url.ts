/**
 * Creates a URL string from a given set of parameters. This automatically
 * handles escaping.
 */
export default function (
    baseURL: string | URL,
    queryParameters?: Record<string, any>,
    fragment?: string
): string {
    let url;

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

    if (fragment != null) {
        url.hash = fragment;
    }

    return url.toString();
}
