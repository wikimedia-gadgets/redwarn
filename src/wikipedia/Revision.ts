/**
 * A revision is an object provided by the MediaWiki API which represents
 * a change in a page's content.
 */
interface Revision {
    /** The ID of the revision. */
    revid?: number;

    /** The content of the page as of the given revision. */
    content?: string;

    /** The edit summary for that revision. */
    summary?: string;

    /** The ID of the revision's parent. */
    parentid?: number;

    /** The user who published that revision. */
    user?: string;
}

export default Revision;
