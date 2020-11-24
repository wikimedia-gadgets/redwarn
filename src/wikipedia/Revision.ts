interface Revision {
    content?: string;
    summary?: string;
    revid?: number;
    parentid?: number;
    user?: string;

    /**
     * Only exists if the given revision has content data attached.
     */
    slots?: { main: { content: string } };
}

export default Revision;
