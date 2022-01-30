import {
    MediaWikiAPI,
    MediaWikiURL,
    NamedPage,
    Page,
    PageEditOptions,
    PageLatestRevisionOptions,
    Revert,
    User
} from "rww/mediawiki";
import redirect from "rww/util/redirect";
import Log from "rww/data/RedWarnLog";
import Section, { SectionContainer } from "rww/mediawiki/core/Section";
import url from "rww/util/url";
import RedWarnStore from "rww/data/RedWarnStore";

/**
 * A revision is an object provided by the MediaWiki API which represents
 * a change in a page's content.
 */
export class Revision implements SectionContainer {
    /** An index of all revisions. */
    private static revisionIndex: Record<number, Revision> = {};

    /** The ID of the revision. */
    revisionID: number;

    /** The page of the revision. */
    page?: Page & NamedPage;

    /** The edit comment for that revision. */
    comment?: string;

    /** The ID of the revision's parent. */
    parentID?: number;

    /** The user who published that revision. */
    user?: User;

    /** The timestamp that the revision was made. */
    time?: Date;

    /** The size of the revision. */
    size?: number;

    /** The content of the page as of the given revision. */
    content?: string;

    /** The sections of this revision. */
    sections: Section[];

    private constructor(object?: Partial<Revision>) {
        if (!!object) {
            Object.assign(this, object);
        }
    }

    /**
     * Create a `Revision` object from a revision ID.
     * @param revisionID The revision ID to use.
     * @param additionalProperties Additional properties to populate.
     * @returns An unpopulated Revision object.
     */
    static fromID(
        revisionID: number,
        additionalProperties?: Partial<Revision>
    ): Revision {
        return (
            Revision.revisionIndex[revisionID] ??
            (Revision.revisionIndex[revisionID] = new Revision({
                revisionID: revisionID,
                ...(additionalProperties ?? {})
            }))
        );
    }

    /**
     * Create a `Revision` object from a revision ID and immediately populate available fields.
     * @param revisionID The revision ID to use.
     * * @returns A populated Revision object.
     */
    static async fromIDToPopulated(revisionID: number): Promise<Revision> {
        return await Revision.populate(
            Revision.revisionIndex[revisionID] ??
                (Revision.revisionIndex[revisionID] = new Revision({
                    revisionID: revisionID
                }))
        );
    }

    /**
     * Create a nearly-bare `Revision` object from a revision ID and wikitext.
     * @param revisionID The revision ID to use.
     * @param wikitext The wikitext of this revision.
     * @returns A partially populated Revision object.
     */
    static fromIDAndText(revisionID: number, wikitext: string): Revision {
        const revision =
            Revision.revisionIndex[revisionID] ??
            (Revision.revisionIndex[revisionID] = new Revision({
                revisionID: revisionID
            }));
        revision.content = wikitext;
        return revision;
    }

    /**
     * Create a `Revision` object from a revision ID and MediaWiki API call results. This assumes
     * that an API request has already been made. Depending on the `apiResult`, the created object
     * may or may not be fully populated.
     * @param revisionID The ID of the revision.
     * @param apiResult The result of the API request.
     */
    static fromPageLatestRevision(
        revisionID: number,
        apiResult: Record<string, any>
    ): Revision {
        const pageData: Record<string, any> = Object.values(
            apiResult["query"]["pages"]
        )[0];
        const revisionData: Record<string, any> = pageData["revisions"][0];
        return (Revision.revisionIndex[revisionID] = new Revision({
            revisionID: revisionID,
            parentID: revisionData["parentid"],
            page: Page.fromIDAndTitle(pageData["pageid"], pageData["title"]),
            comment: revisionData["comment"],
            user: User.fromUsername(revisionData["user"]),
            time: new Date(revisionData["timestamp"]),
            size: revisionData["size"],
            content: revisionData["slots"]?.["main"]?.["content"]
        }));
    }

    /**
     * Create a `Revision` object from the response of a MediaWiki API edit.
     * @param editResponse The returned JSON response.
     */
    static fromEditReponse({
        edit: editResponse
    }: {
        edit: Record<string, any>;
    }): Revision {
        return new Revision({
            revisionID: editResponse["newrevid"],
            parentID: editResponse["oldrevid"],
            page: Page.fromIDAndTitle(
                editResponse["pageid"],
                editResponse["title"]
            )
        });
    }

    /**
     * Populates all missing values of a revision. This also mutates the original object.
     * @param revision The revision to populate.
     */
    static async populate(revision: Revision): Promise<Revision> {
        const toPopulate = ["ids"];
        if (!revision.comment) toPopulate.push("comment");
        if (!revision.user) toPopulate.push("user");
        if (!revision.time) toPopulate.push("timestamp");
        if (!revision.size) toPopulate.push("size");

        if (toPopulate.length > 0) {
            // Returns one revision (revision revision) from one slot (main) from one page.
            const revisionInfoRequest = await MediaWikiAPI.get({
                action: "query",
                format: "json",
                prop: "revisions",
                revids: `${revision.revisionID}`,
                rvprop: toPopulate,
                rvslots: "main"
            });

            if (revisionInfoRequest["query"]["badrevids"]) {
                throw new Error("Invalid revision ID");
            }

            const pageData: Record<string, any> = Object.values(
                revisionInfoRequest["query"]["pages"]
            )[0];
            const revisionData: Record<string, any> = pageData["revisions"][0];

            // Page is always provided. IDs are required (see toPopulate declaration).
            revision.page = Page.fromIDAndTitle(
                pageData["pageid"],
                pageData["title"]
            );
            revision.content = revisionData["revid"];
            if (!!revisionData["comment"])
                revision.comment = revisionData["comment"];
            if (!!revisionData["user"])
                revision.user = User.fromUsername(revisionData["user"]);
            if (!!revisionData["timestamp"])
                revision.time = new Date(revisionData["timestamp"]);
            if (!!revisionData["size"]) revision.size = revisionData["size"];
            if (!!revisionData["slots"]?.["main"]?.["content"])
                revision.content = revisionData["slots"]["main"]["content"];
        }

        return revision;
    }

    /**
     * Get the revision content. If the content has already been taken before, the cached
     * version is used.
     */
    async getContent(): Promise<string> {
        if (this.content) return this.content;

        const revisionInfoRequest = await MediaWikiAPI.get({
            action: "query",
            format: "json",
            prop: "revisions",
            revids: `${this.revisionID}`,
            rvprop: "content",
            rvslots: "main"
        });

        const pageData: Record<string, any> = Object.values(
            revisionInfoRequest["query"]["pages"]
        )[0];
        this.content =
            pageData["revisions"]?.[0]?.["slots"]?.["main"]?.["content"] ??
            null;
        return this.content;
    }

    /**
     * Get the revision sections.
     */
    async getSections(): Promise<Section[]> {
        return Section.getSections(this);
    }

    /**
     * Checks if all of the revision's properties are filled. Use this before
     * using {@link populate} in order to conserve data usage.
     */
    isPopulated(): boolean {
        return !(
            this.page == null ||
            this.comment == null ||
            this.parentID == null ||
            this.user == null ||
            this.time == null ||
            this.size == null ||
            this.content == null
        );
    }

    /**
     * Populates all missing values of the revision. This also mutates the original object.
     */
    async populate(): Promise<Revision> {
        return Revision.populate(this);
    }

    /**
     * Get the page's latest revision.
     */
    async getLatestRevision(
        options?: PageLatestRevisionOptions
    ): Promise<Revision> {
        if (!this.page) {
            // Big oh noes. We'll have to send an additional request just to get the page name.
            Log.warn("Page of revision was not set. This is inefficient!", {
                stack: new Error("Inefficient latest revision get.")
            });
            await this.populate();
        }

        return this.page.getLatestRevision(options);
    }

    /**
     * Check if this revision is the page's latest revision.
     */
    async isLatestRevision(): Promise<boolean> {
        return (await this.getLatestRevision()).revisionID === this.revisionID;
    }

    /**
     * Navigate to the given revision's diff page.
     */
    navigate(): void {
        redirect(MediaWikiURL.getDiffUrl(this.revisionID));
    }

    /**
     * Restores the page to this revision.
     */
    restore(reason?: string): Promise<any> {
        return Revert.restore(this, reason);
    }

    /**
     * Navigate to the given revision's diff page.
     */
    navigateToLatestRevision(): void {
        redirect(
            url(RedWarnStore.wikiIndex, {
                diff: 0,
                title: `${this.page.title}`
            })
        );
    }

    /**
     * Appends wikitext to the page at a given revision.
     *
     * @param text The content to add.
     * @param options Page editing options.
     */
    async appendContent(
        text: string,
        options?: Omit<PageEditOptions, "mode" | "baseRevision">
    ): Promise<void> {
        if (!this.page) {
            // Big oh noes. We'll have to send an additional request just to get the page name.
            Log.warn("Page of revision was not set. This is inefficient!", {
                stack: new Error("Inefficient revision content append.")
            });
            await this.populate();
        }

        this.page.appendContent(
            text,
            Object.assign(
                {
                    mode: "append",
                    baseRevision: this
                },
                options
            )
        );
    }
}
