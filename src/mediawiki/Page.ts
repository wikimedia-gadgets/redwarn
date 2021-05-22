import { MediaWikiAPI, Revision, User } from "rww/mediawiki";
import { RW_WIKIS_TAGGABLE } from "rww/data/RedWarnConstants";
import RedWarnStore from "rww/data/RedWarnStore";
import i18next from "i18next";
import {
    PageInvalidError,
    PageMissingError,
    SectionIndexMissingError,
} from "rww/errors/MediaWikiErrors";
import { url as buildURL } from "rww/util";
import redirect from "rww/util/redirect";
import Section, { SectionContainer } from "rww/mediawiki/Section";

export interface PageEditOptions {
    /**
     * The summary of the edit (without the RedWarn signature).
     */
    comment?: string;
    /**
     * The index of the section to edit, or "new" for a new section.
     */
    section?: string | number | Section;
    /**
     * Whether or not this text will be appended, be prepended, or replace the existing text.
     */
    mode?: "replace" | "append" | "prepend";
    /**
     * The basis revision of this page edit. This will help prevent possible edit conflicts.
     * Omit this parameter to edit a page regardless of content.
     */
    baseRevision?: Revision;
}

/**
 * A page is an object in a MediaWiki installation. All revisions stem from one page, and all
 * pages stem from one namespace. Since a `Page` object cannot be manually constructed, it must
 * be created using a page ID or using its title.
 */
export class Page implements SectionContainer {
    /** The ID of the page. */
    pageID?: number;

    /** The page title. */
    title?: string;

    /** The number that represents the namespace this page belongs to (i.e. its namespace ID). */
    namespace?: number;

    /** The latest revision cached by RedWarn. */
    latestCachedRevision?: Revision;

    /** The sections of this revision. */
    sections: Section[];

    /**
     * Returns the URL of the page.
     */
    get url(): string {
        const identifier = this.getIdentifier();
        return buildURL(RedWarnStore.wikiIndex, {
            [typeof identifier === "string" ? "title" : "curid"]: identifier,
        });
    }

    private constructor(object?: Partial<Page>) {
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
            rvprop: ["ids", "comment", "user", "timestamp", "size", "content"],
            rvslots: "main",
            rvexcludeuser: options?.excludeUser?.username ?? undefined,
        });

        if (revisionInfoRequest["query"]["pages"]["-1"]) {
            if (!!revisionInfoRequest["query"]["pages"]["-1"]["missing"])
                throw new PageMissingError(page);
            if (!!revisionInfoRequest["query"]["pages"]["-1"]["invalid"])
                throw new PageInvalidError(
                    page,
                    revisionInfoRequest["query"]["pages"]["-1"]["invalidreason"]
                );

            throw new Error("Invalid page ID or title.");
        }

        const pageData: Record<string, any> = Object.values(
            revisionInfoRequest["query"]["pages"]
        )[0];

        // Fill in blank values from the page if available.
        if (!page.title) page.title = pageData["title"];
        if (!page.namespace) page.namespace = pageData["ns"];

        // No revisions found. Return null.
        if (!pageData["revisions"] || pageData["revisions"].length === 0)
            return null;

        // Title is always provided. IDs are required (see toPopulate declaration).
        return (page.latestCachedRevision = Revision.fromPageLatestRevision(
            pageData["revisions"][0]["revid"],
            revisionInfoRequest
        ));
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
        return (this.latestCachedRevision = await Page.getLatestRevision(
            this,
            options
        ));
    }

    /**
     * Get the sections of this page's latest revision.
     */
    async getSections(): Promise<Section[]> {
        return Section.getSections(this);
    }

    /**
     * Checks if the page's latest revision has been cached.
     */
    hasLatestRevision(): boolean {
        return !!this.latestCachedRevision;
    }

    /**
     * Gets the latest revision of the page which was not by a given user.
     * @param username The user.
     */
    async getLatestRevisionNotByUser(username: string): Promise<Revision> {
        return this.getLatestRevision({
            excludeUser: User.fromUsername(username),
        });
    }

    /**
     * Redirects to the page.
     */
    redirect(): void {
        redirect(this.url);
    }

    /**
     * Opens the page in a new tab.
     */
    openInNewTab(): void {
        open(this.url);
    }

    /**
     * Gets a subpage of the given page.
     * @param subpage The subpage to get. Don't include the page's original title.
     * @returns The subpage requested.
     */
    getSubpage(subpage: string): Page {
        return Page.fromTitle(`${this.title}/${subpage}`);
    }

    /**
     * Edit the page.
     *
     * @throws {Error}
     * @param content The new page content.
     * @param options Page editing options.
     */
    async edit(content: string, options: PageEditOptions): Promise<void> {
        const pageIdentifier = this.getIdentifier();

        // Handle the section
        /**
         * The {@link Section} to append text to.
         */
        let existingSection: Section = null;
        if (options.section) {
            // For `Section` objects.
            if (
                options.section instanceof Section &&
                options.section.revision === this.latestCachedRevision
            )
                // Use the existing section on this talk page.
                existingSection = options.section;
            else if (options.section instanceof Section)
                // Replace section option with section title for automatic correction.
                options.section = options.section.title;

            const revision = this.sections[0].revision;
            const revisionSections = this.sections;

            // Search for an existing section.
            if (existingSection == null) {
                if (!revision && typeof options.section === "number") {
                    // Immediate failure since a non-existent page has no sections.
                    throw new PageMissingError(this);
                } else if (typeof options.section === "number") {
                    existingSection = revisionSections.filter(
                        (s) => s.index === options.section
                    )[0];

                    // Section not found. Hard fail since there's no fallback title.
                    if (existingSection == null)
                        throw new SectionIndexMissingError(
                            options.section,
                            revision
                        );
                } else {
                    existingSection = revisionSections.filter(
                        (s) => s.title === options.section
                    )[0];

                    // Section not found. It will be appended to the end of the user talk page.
                    // Remove leading whitespace to avoid extra spaces.
                    if (existingSection == null) content = content.trimLeft();
                }
            }
        }

        // Handle the mode
        let textArgument: Record<string, any>;
        switch (options.mode) {
            case "append":
                textArgument = { appendtext: content };
                break;
            case "prepend":
                textArgument = { prependtext: content };
                break;
            default:
                textArgument = { text: content };
                break;
        }

        await MediaWikiAPI.postWithEditToken({
            action: "edit",
            format: "json",

            // Page ID or title
            [typeof pageIdentifier === "number"
                ? "pageid"
                : "title"]: pageIdentifier,

            // Edit summary
            summary: `${options.comment ?? ""} ${i18next.t(
                "common:redwarn.signature"
            )}`,

            // Tags
            tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
                ? "RedWarn"
                : null,

            // Base revision ID
            ...(options.baseRevision
                ? {
                      baserevid: options.baseRevision.revisionID,
                  }
                : {}),

            // Section
            ...(options.section
                ? existingSection
                    ? {
                          section: existingSection.index,
                      }
                    : {
                          section: "new",
                          sectiontitle: options.section,
                      }
                : {}),

            ...textArgument,
        });
    }

    /**
     * Appends wikitext to the page.
     *
     * @param text The content to add.
     * @param options Page editing options.
     */
    async appendContent(
        text: string,
        options?: Omit<PageEditOptions, "mode">
    ): Promise<void> {
        // Force using append mode.
        await this.edit(
            text,
            Object.assign({ mode: <const>"append" }, options)
        );
    }

    /**
     * Prepends wikitext to the page.
     *
     * @param text The content to add.
     * @param options Page editing options.
     */
    async prependContent(
        text: string,
        options?: Omit<PageEditOptions, "mode">
    ): Promise<void> {
        // Force using prepend mode.
        await this.edit(
            text,
            Object.assign({ mode: <const>"prepend" }, options)
        );
    }
}