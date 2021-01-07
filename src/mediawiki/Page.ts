import Revision from "./Revision";
import MediaWikiAPI from "./API";
import { RW_WIKIS_TAGGABLE } from "rww/data/RedWarnConstants";
import RedWarnStore from "rww/data/RedWarnStore";
import i18next from "i18next";
import User from "./User";

export type PageFunctions =
    | "getIdentifier"
    | "getLatestRevision"
    | "getLatestRevisionNotByUser"
    | "edit";

/**
 * A page is an object in a MediaWiki installation. All revisions stem from one page, and all
 * pages stem from one namespace. Since a `Page` object cannot be manually constructed, it must
 * be created using a page ID or using its title.
 */
export default class Page {
    /** The ID of the page. */
    pageID?: number;

    /** The page title. */
    title?: string;

    /** The number that represents the namespace this page belongs to (i.e. its namespace ID). */
    namespace?: number;

    private constructor(object?: Omit<Page, PageFunctions>) {
        if (!!object) {
            Object.assign(this, object);
        }
    }

    /**
     * Creates a `Page` object from its ID.
     * @param pageID The page's ID.
     */
    static fromID(pageID: number): Page {
        return new Page({ pageID: pageID });
    }

    /**
     * Creates a `Page` object from its title.
     * @param pageTitle The page's title (including namespace).
     */
    static fromTitle(pageTitle: string): Page {
        return new Page({ title: pageTitle });
    }

    /**
     * Creates a `Page` object from its title and ID. Best choice.
     * @param pageID The page's ID.
     * @param pageTitle The page's title (including namespace).
     */
    static fromIDAndTitle(pageID: number, pageTitle: string): Page {
        return new Page({ pageID: pageID, title: pageTitle });
    }

    /**
     * Get a page's latest revision.
     * @param page The page to get the latest revision of.
     * @param options Extra options or restrictions for getting the latest revision.
     * @returns `null` if no matching revisions were found. A {@link Revision} otherwise.
     */
    static async getLatestRevision(
        page: Page,
        options?: { excludeUser: User }
    ): Promise<Revision> {
        const pageIdentifier = page.getIdentifier();

        // Returns one revision from one page (the given page).
        const revisionInfoRequest = await MediaWikiAPI.get({
            action: "query",
            format: "json",
            prop: "revisions",
            [typeof pageIdentifier === "number"
                ? "pageids"
                : "titles"]: pageIdentifier,
            rvprop: [
                "ids",
                "comment",
                "user",
                "timestamp",
                "size",
                "content",
            ].join("|"),
            rvslots: "main",
            rvexcludeuser: options?.excludeUser?.username ?? undefined,
        });

        if (revisionInfoRequest["query"]["pages"]["-1"]) {
            throw new Error("Invalid page ID or title.");
        }

        const pageData: Record<string, any> = Object.values(
            revisionInfoRequest["query"]["pages"]
        )[0];

        // Give the page a small boost as well.
        if (!page.title) page.title = pageData["title"];
        if (!page.namespace) page.namespace = pageData["ns"];

        // No revisions found. Return null.
        if (!pageData["revisions"] || pageData["revisions"].length === 0)
            return null;

        // Title is always provided. IDs are required (see toPopulate declaration).
        return Revision.fromPageLatestRevision(
            pageData["revisions"][0]["revid"],
            revisionInfoRequest
        );
    }

    /**
     * Grabs either the page's title or ID. Returns the ID if both exist as long as
     * `favorTitle` is set to false.
     *
     * If this function returns `null`, the `Page` was illegally created.
     * @param favorTitle Whether or not to favor the title over the ID.
     */
    getIdentifier(favorTitle = false): number | string {
        if (!!this.pageID && !favorTitle) return this.pageID;
        else if (!this.pageID && !favorTitle) return this.title ?? null;
        else if (!!this.title && favorTitle) return this.title;
        else if (!this.title && favorTitle) return this.pageID ?? null;
    }

    /**
     * Get a page's latest revision.
     */
    async getLatestRevision(options?: {
        excludeUser: User;
    }): Promise<Revision> {
        return Page.getLatestRevision(this, options);
    }

    /**
     * Gets the latest revision of the page which was not by a given user.
     * @param username The user.
     */
    async getLatestRevisionNotByUser(username: string): Promise<Revision> {
        return this.getLatestRevision({ excludeUser: new User(username) });
    }

    /**
     * Edit the page.
     *
     * @throws {Error}
     * @param content {string} The new page content.
     * @param comment {string} The edit summary.
     */
    async edit(content: string, comment?: string): Promise<void> {
        const pageIdentifier = this.getIdentifier();

        await MediaWikiAPI.postWithEditToken({
            action: "edit",
            format: "json",
            [typeof pageIdentifier === "number"
                ? "pageids"
                : "titles"]: pageIdentifier,
            summary: `${comment ?? ""} ${i18next.t(
                "common:redwarn.signature"
            )}`,
            text: content,
            tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
                ? "RedWarn"
                : null,
        });
    }
}