/**
 * Creates a URL string from a given set of parameters. This automatically
 * handles escaping,
 */
export default function (
    baseURL: string | URL,
    queryParameters?: Record<string, any>
): string {
    let url;

    if (typeof baseURL === "string") url = new URL(baseURL);
    else url = baseURL;

    if (queryParameters != null) {
        for (const parameter in queryParameters) {
            if (
                queryParameters.hasOwnProperty(parameter) &&
                queryParameters[parameter] != null
            )
                url.searchParams.set(parameter, queryParameters[parameter]);
        }
    }

    return url.toString();
}
