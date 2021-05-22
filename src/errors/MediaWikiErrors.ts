import { Page } from "rww/mediawiki/Page";
import { Revision } from "rww/mediawiki";

export class PageMissingError extends Error {
    constructor(page: Page, message?: string) {
        super(message ?? `The page "${page.title}" could not be found.`);
    }
}

export class PageInvalidError extends Error {
    constructor(page: Page, message?: string) {
        super(message ?? `The page "${page.title}" could not be found.`);
    }
}

export class RevisionMissingError extends Error {
    constructor(id: number, message?: string) {
        super(message ?? `There is no revision with ID ${id}.`);
    }
}

export class SectionIndexMissingError extends Error {
    constructor(sectionId: number, revision: Revision, message?: string) {
        super(
            message ??
                `Revision with ID ${revision.revisionID} does not contain a section with index ${sectionId}.`
        );
    }
}
