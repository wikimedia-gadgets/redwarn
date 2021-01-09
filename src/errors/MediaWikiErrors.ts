import { Page } from "rww/mediawiki/Page";

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
