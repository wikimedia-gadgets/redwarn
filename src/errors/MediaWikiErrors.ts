import { Page } from "rww/mediawiki/Page";
import { Revision } from "rww/mediawiki";
import { RWErrors, RWFormattedError } from "./RWError";

export class PageMissingError extends RWFormattedError<{ page: Page }> {
    static readonly code = RWErrors.PageMissing;
    static readonly message = "The page {{page.title}} could not be found.";
}

export class PageInvalidError extends RWFormattedError<{
    page: Page;
    reason: string;
}> {
    static readonly code = RWErrors.PageInvalid;
    static readonly message =
        "The page {{page.title}} could not be found. Reason: {{reason}}";
}

export class RevisionMissingError extends RWFormattedError<{ id: number }> {
    static readonly code = RWErrors.RevisionMissing;
    static readonly message = "There is no revision with ID {{id}}.";
}

export class SectionIndexMissingError extends RWFormattedError<{
    sectionId: number;
    revision: Revision;
}> {
    static readonly code = RWErrors.PageInvalid;
    static readonly message =
        "Revision with ID {{revision.revisionID}} does not contain a section with index {{sectionId}}.";
}
