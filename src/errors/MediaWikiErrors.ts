import { Page } from "rww/mediawiki/core/Page";
import { Revision } from "rww/mediawiki";
import RWErrorBase, { RWErrors, RWFormattedError } from "./RWError";

export class PageMissingError extends RWFormattedError<{ page: Page }> {
    readonly code = RWErrors.PageMissing;
    static readonly message = "The page {{page.title}} could not be found.";
}

export class PageInvalidError extends RWFormattedError<{
    page: Page;
    reason: string;
}> {
    readonly code = RWErrors.PageInvalid;
    static readonly message =
        "The page {{page.title}} could not be found. Reason: {{reason}}";
}

export class RevisionMissingError extends RWFormattedError<{ id: number }> {
    readonly code = RWErrors.RevisionMissing;
    static readonly message = "There is no revision with ID {{id}}.";
}

export class SectionIndexMissingError extends RWFormattedError<{
    sectionId: number;
    revision: Revision;
}> {
    readonly code = RWErrors.PageInvalid;
    static readonly message =
        "Revision with ID {{revision.revisionID}} does not contain a section with index {{sectionId}}.";
}

export class GenericAPIError extends RWErrorBase {
    readonly code = RWErrors.APIError;

    constructor(readonly error: Record<string, any> | string) {
        super();
    }

    get message() {
        return typeof this.error === "string"
            ? this.error
            : this.error["text"] ??
                  this.error["info"] ??
                  this.error["html"] ??
                  "Unknown MediaWiki API error.";
    }
}

export const SpecializedMediaWikiErrors: Record<string, any> = {
    missingtitle: PageMissingError,
    nosuchrevid: RevisionMissingError
};
