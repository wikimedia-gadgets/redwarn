import {
    MediaWikiAPI,
    MediaWikiURL,
    Page,
    User,
} from "rww/mediawiki/MediaWiki";
import redirect from "rww/util/redirect";

// Function names of the Revision class.
type RevisionFunctions =
    | "populate"
    | "isPopulated"
    | "getLatestRevision"
    | "isLatestRevision"
    | "getContent"
    | "navigate";

/**
 * A revision is an object provided by the MediaWiki API which represents
 * a change in a page's content.
 */
export class Revision {
    /** The ID of the revision. */
    revisionID: number;

    /** The page of the revision. */
    page?: Page;

    /** The edit comment for that revision. */
    comment?: string;

    /** The ID of the revision's parent. */
    parentID?: number;

    /** The user who published that revision. */
    user?: User;

    /** The timestamp that the revision was made. */
    timestamp?: number;

    /** The size of the revision. */
    size?: number;

    /** The content of the page as of the given revision. */
    content?: string;

    private constructor(object?: Omit<Revision, RevisionFunctions>) {
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
        additionalProperties?: Partial<Omit<Revision, RevisionFunctions>>
    ): Revision {
        return new Revision({
            revisionID: revisionID,
            ...(additionalProperties ?? {}),
        });
    }

    /**
     * Create a `Revision` object from a revision ID and immediately populate available fields.
     * @param revisionID The revision ID to use.
     * * @returns A populated Revision object.
     */
    static async fromIDToPopulated(revisionID: number): Promise<Revision> {
        return await Revision.populate(
            new Revision({ revisionID: revisionID })
        );
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

        return new Revision({
            revisionID: revisionID,
            parentID: revisionData["parentid"],
            page: Page.fromIDAndTitle(pageData["pageid"], pageData["title"]),
            comment: revisionData["comment"],
            user: new User(revisionData["user"]),
            timestamp: new Date(revisionData["timestamp"]).getTime(),
            size: revisionData["size"],
            content: revisionData["slots"]?.["main"]?.["*"],
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
        if (!revision.timestamp) toPopulate.push("timestamp");
        if (!revision.size) toPopulate.push("size");

        if (toPopulate.length > 0) {
            // Returns one revision (revision revision) from one slot (main) from one page.
            const revisionInfoRequest = await MediaWikiAPI.get({
                action: "query",
                format: "json",
                prop: "revisions",
                revids: `${revision.revisionID}`,
                rvprop: toPopulate.join("|"),
                rvslots: "main",
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
                revision.user = new User(revisionData["user"]);
            if (!!revisionData["timestamp"])
                revision.timestamp = new Date(
                    revisionData["timestamp"]
                ).getTime();
            if (!!revisionData["size"]) revision.size = revisionData["size"];
            if (!!revisionData["slots"]?.["main"]?.["*"])
                revision.content = revisionData["slots"]["main"]["*"];
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
            rvslots: "main",
        });

        const pageData: Record<string, any> = Object.values(
            revisionInfoRequest["query"]["pages"]
        )[0];
        this.content =
            pageData["revisions"]?.[0]?.["slots"]?.["main"]?.["*"] ?? null;
        return this.content;
    }

    /**
     * Checks if all of the revision's properties are filled. Use this before
     * using {@link populate} in order to conserve data usage.
     */
    isPopulated(): boolean {
        return Object.entries(this).reduce(
            (p, n): boolean => p && n[1] != null && n[0] !== "content",
            true
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
    async getLatestRevision(): Promise<Revision> {
        if (!!this.page) {
            // Big oh noes. We'll have to send an additional request just to get the page name.
            console.warn("Page of revision was not set. This is inefficient!");
            console.warn(new Error().stack);
            const revisionInfoRequest = await MediaWikiAPI.get({
                action: "query",
                format: "json",
                prop: "revisions",
                revids: `${this.revisionID}`,
                rvprop: "",
                rvslots: "main",
            });

            const pageData: Record<string, any> = Object.values(
                revisionInfoRequest["query"]["pages"]
            )[0];
            this.page = Page.fromIDAndTitle(
                pageData["pageid"],
                pageData["title"]
            );
        }

        return this.page.getLatestRevision();
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
}
