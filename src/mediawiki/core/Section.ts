import { Revision } from "app/mediawiki/core/Revision";
import { Page, PageEditOptions } from "./Page";
import { MediaWikiAPI } from "app/mediawiki/core/API";

export interface APISection {
    /**
     * The level of this section in the table of contents.
     */
    toclevel: number;
    /**
     * The heading level for this section.
     */
    level: string;
    /**
     * The name of the section.
     */
    line: string;
    /**
     * The table of contents number of this section.
     */
    number: string;
    /**
     * The index of this section.
     */
    index: string;
    /**
     * The title of the page this section belongs to.
     */
    fromtitle: mw.Title;
    /**
     * The byte at which the first character of the heading starts.
     *
     * Assuming the following wikitext:
     * ```
     * content here
     * == heading ==
     * subcontent here
     * ```
     * the byte offset will be the position of the character directly
     * before the first `=` character.
     */
    byteoffset: number;
    /**
     * The anchor of this section for browser navigation.
     */
    anchor: string;
}

export default class Section {
    /**
     * The heading level for this section.
     * @example "2"
     */
    readonly level: string;
    /**
     * The index (sequential number) of this section.
     * @example "52"
     */
    readonly index: number;
    /**
     * The title of the section.
     * @example "API Documentation"
     */
    readonly title: string;
    /**
     * Table of contents properties.
     */
    readonly toc: {
        /**
         * The level of this section in the table of contents.
         */
        level: number;
        /**
         * The table of contents number of this section.
         * @example "2.3.1"
         */
        number: string;
    };
    /**
     * The revision this section belongs to.
     */
    readonly revision: Revision & SectionContainer;
    /**
     * The byte at which the first character of the heading starts in
     * wikitext.
     *
     * Assuming the following wikitext:
     * ```
     * content here
     * == heading ==
     * subcontent here
     * ```
     * the byte offset will be the position of the character directly
     * before the first `=` character.
     */
    readonly byteoffset: number;
    /**
     * The anchor of this section for browser navigation.
     * @example API_Documentation
     */
    readonly anchor: string;

    /**
     * Creates a new Section object.
     *
     * @param source The origin of the section (a {@link Page} at latest revision
     *               or a {@link Revision})
     * @param properties The properties of the section as returned by MediaWiki's
     *                   "parse" action.
     */
    constructor(source: Revision & SectionContainer, properties: APISection) {
        this.toc = {
            level: properties.toclevel,
            number: properties.number,
        };
        this.level = properties.level;
        this.index = +properties.index;
        this.title = properties.line;
        this.revision = source;
        this.byteoffset = properties.byteoffset;
        this.anchor = properties.anchor;
    }

    /**
     * Gets the sections of an article.
     *
     * If the given context is a {@link Page}, it is assumed that the revision the
     * sections are from is always the latest revision. Thus, {@link context.latestCachedRevision}
     * may be used to refer to the revision if the context is a Page.
     *
     * @returns Page content split into sections.
     */
    static async getSections(
        context: (Page | Revision) & SectionContainer
    ): Promise<Section[]> {
        if (context.sections) return context.sections;

        const sectionsRequest = await MediaWikiAPI.get({
            action: "parse",
            format: "json",
            ...(context instanceof Page
                ? {
                      page: `${context.title}`,
                  }
                : {
                      oldid: context.revisionID,
                  }),
            prop: [
                "sections",
                "revid",
                // Don't grab wikitext if we already have it.
                ...(context instanceof Revision && context.content
                    ? []
                    : ["wikitext"]),
            ],
        }).catch((e) => {
            let data;
            if (context instanceof Page) {
                data = { page: context };
            } else if (context instanceof Revision) {
                data = { revision: context };
            } else {
                // ??? how did we get here
                throw "Impossible else";
            }
            throw MediaWikiAPI.error(e, data);
        });

        if (
            sectionsRequest["parse"] == null ||
            sectionsRequest["parse"]["sections"] == null
        )
            throw new Error("Invalid request.");

        if (context instanceof Page) {
            // Fill in blank values from the page if available.
            if (!context.title)
                context.title = sectionsRequest["parse"]["title"];
            if (!context.pageID)
                context.pageID = sectionsRequest["parse"]["pageid"];

            // This will overwrite the latest cached revision in the Page.
            // This can cause some parts of the revision to be unpopulated. This is, however,
            // the ideal solution as it prevents using stale page content.
            context.latestCachedRevision = Revision.fromIDAndText(
                sectionsRequest["parse"]["revid"],
                sectionsRequest["parse"]["wikitext"]
            );
            context.latestCachedRevision.page = Object.assign(context, {
                title: context.title,
            });
        } else {
            // Fill in blank values from the page if available.
            if (!context.page)
                context.page = Page.fromIDAndTitle(
                    sectionsRequest["parse"]["pageid"],
                    sectionsRequest["parse"]["title"]
                );
            else if (!context.page.title)
                context.page.title = sectionsRequest["parse"]["title"];
            else if (!context.page.pageID)
                context.page.pageID = sectionsRequest["parse"]["pageid"];

            if (!context.content)
                context.content = sectionsRequest["parse"]["wikitext"];
        }

        // Pre-fill with top section
        const sectionsList: Section[] = [
            new Section(
                context instanceof Revision
                    ? context
                    : context.latestCachedRevision,
                {
                    toclevel: 0,
                    level: "2",
                    line: null,
                    number: "0",
                    index: "0",
                    fromtitle:
                        context instanceof Revision
                            ? context.page.title
                            : context.title,
                    byteoffset: 0,
                    anchor: "top",
                }
            ),
        ];
        for (const sectionRequestEntry of sectionsRequest["parse"][
            "sections"
        ] as APISection[]) {
            sectionsList.push(
                new Section(
                    context instanceof Page
                        ? context.latestCachedRevision
                        : context,
                    sectionRequestEntry
                )
            );
        }

        context.sections = sectionsList;
        if (context instanceof Page)
            context.latestCachedRevision.sections = sectionsList;

        return sectionsList;
    }

    /**
     * Determines whether or not this section has subsections.
     */
    hasSubsections(): boolean {
        for (const section of this.revision.sections) {
            // Preceding sections.
            if (section.index <= this.index) continue;

            // Section comes after and is of a lower level.
            return section.index > this.index && section.level > this.level;
        }
        // Last section of a revision. Automatically false.
        return false;
    }

    /**
     * Gets the contents of this section.
     *
     * @param subsections Whether or not to include the wikitext of subsections.
     */
    getContent(subsections = true): string {
        /**
         * The succeeding section. If null, this is the last section in the sequence.
         */
        let nextSection = null;

        for (const section of this.revision.sections) {
            // Preceding sections.
            if (section.index <= this.index) continue;

            // Section comes after and is of the same level.
            if (
                subsections &&
                section.index > this.index &&
                section.level === this.level
            ) {
                nextSection = section;
                break;
            } else if (section.index > this.index) {
                nextSection = section;
                break;
            }
        }

        return this.revision.content.substring(
            this.byteoffset,
            nextSection ? nextSection.byteoffset : undefined
        );
    }

    /**
     * Sets the contents of this section. This will replace the text of all
     * subsections under it.
     *
     * @param text The new text of the section.
     * @param options Page editing options.
     */
    async setContent(
        text: string,
        options: Omit<PageEditOptions, "mode" | "baseRevision" | "section"> = {}
    ): Promise<any> {
        return this.revision.page.edit(
            text,
            Object.assign(
                {
                    mode: <const>"replace",
                    baseRevision: this.revision,
                    section: this,
                },
                options
            )
        );
    }

    /**
     * Appends wikitext to the section.
     *
     * @param text The new text of the section.
     * @param options Page editing options.
     */
    async appendContent(
        text: string,
        options: Omit<PageEditOptions, "mode" | "baseRevision" | "section"> = {}
    ): Promise<any> {
        return this.revision.page.edit(
            text,
            Object.assign(
                {
                    mode: <const>"append",
                    baseRevision: this.revision,
                    section: this,
                },
                options
            )
        );
    }

    /**
     * Prepends wikitext to the section.
     *
     * @param text The new text of the section.
     * @param options Page editing options.
     */
    async prependContent(
        text: string,
        options: Omit<PageEditOptions, "mode" | "baseRevision" | "section"> & {
            /**
             * Whether or not to prepend the text below the header. Settings this
             * to true will require two requests: one to get the section text and
             * another to save the text.
             */
            belowHeader?: boolean;
        } = {}
    ): Promise<any> {
        if (options?.belowHeader ?? false) {
            const content = this.getContent(false).split("\n");

            return this.setContent(
                content[0] + "\n" + text + content.slice(1).join("\n"),
                options
            );
        } else {
            return this.revision.page.edit(
                text,
                Object.assign(
                    {
                        mode: <const>"prepend",
                        baseRevision: this.revision,
                        section: this,
                    },
                    options
                )
            );
        }
    }
}

export interface SectionContainer {
    /** The sections of this revision. */
    sections: Section[];
}
