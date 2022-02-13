/**
 * Normalizes a page name.
 * @param title The title of the page to normalize.
 */
export default function (title: string): string {
    if (title == null || title.trim().length === 0)
        return "";
    return new mw.Title(title).getPrefixedText();
}
