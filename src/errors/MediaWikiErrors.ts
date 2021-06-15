import { Page } from "rww/mediawiki/Page";
import { Revision } from "rww/mediawiki";

export class GenericMediaWikiError extends Error {
    readonly code: string;

    constructor(error: Record<string, any> | string) {
        super(
            typeof error === "string"
                ? error
                : error["text"] ??
                      error["info"] ??
                      error["html"] ??
                      "Unknown MediaWiki API error."
        );
        if (!this.code)
            this.code = typeof error === "object" ? error["code"] : "unknown";
    }
}

export class PageMissingError extends GenericMediaWikiError {
    readonly code = "missingtitle";
    constructor(readonly page: Page, message?: string) {
        super(message ?? `The page "${page.title}" could not be found.`);
    }
}

export class RevisionMissingError extends GenericMediaWikiError {
    readonly code = "nosuchrevid";
    constructor(readonly revisionID: number, message?: string) {
        super(message ?? `There is no revision with ID ${revisionID}.`);
    }
}

// Not actually MediaWiki API errors.

export class PageInvalidError extends GenericMediaWikiError {
    constructor(readonly page: Page, message?: string) {
        super(message ?? `The page "${page.title}" could not be found.`);
    }
}

export class SectionIndexMissingError extends GenericMediaWikiError {
    constructor(
        readonly sectionId: number,
        readonly revision: Revision,
        message?: string
    ) {
        super(
            message ??
                `Revision with ID ${revision.revisionID} does not contain a section with index ${sectionId}.`
        );
    }
}

export const SpecializedMediaWikiErrors: Record<string, any> = {
    missingtitle: PageMissingError,
    nosuchrevid: RevisionMissingError,
};
