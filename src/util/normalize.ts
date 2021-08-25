/**
 * Normalizes a page name.
 * @param title The title of the page to normalize.
 */
export default function (title: string): string {
    return new mw.Title(title).getPrefixedText();
}
