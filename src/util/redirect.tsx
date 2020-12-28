import { h } from "@sportshead/tsx-dom";

/**
 * Redirects a user to another page.
 * @param url The new page's URL
 * @param inNewTab Whether to open the page in a new tab or not.
 */
export default function (url: string, inNewTab = false): void {
    if (inNewTab) {
        (<a target="_blank" href={url} />).click(); // Open in new tab
    } else {
        window.location.href = url; // open here
    }
}
