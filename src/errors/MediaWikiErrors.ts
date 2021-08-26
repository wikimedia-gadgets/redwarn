import { Page } from "rww/mediawiki/core/Page";
import { Revision } from "rww/mediawiki";

/**
 * Additional data for MediaWiki errors.
 */
export interface MediaWikiErrorData {
    page?: Page;
    revision?: Revision;
}

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
    constructor(readonly data: MediaWikiErrorData, message?: string) {
        super(
            message ??
                `The page "${data.page.title.getPrefixedText()}" could not be found.`
        );
    }
}

export class RevisionMissingError extends GenericMediaWikiError {
    readonly code = "nosuchrevid";
    constructor(readonly data: MediaWikiErrorData, message?: string) {
        super(
            message ??
                `There is no revision with ID ${data.revision.revisionID}.`
        );
    }
}

// Not actually MediaWiki API errors.

export class PageInvalidError extends GenericMediaWikiError {
    constructor(readonly page: Page, message?: string) {
        super(
            message ??
                `The page "${page.title.getPrefixedText()}" could not be found.`
        );
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
    nosuchrevid: RevisionMissingError
};
