import {
    RW_SIGNATURE,
    RW_WELCOME,
    RW_WELCOME_ANON,
} from "rww/data/RedWarnConstants";
import RWUI from "rww/ui/RWUI";
import getMonthHeader from "rww/util/getMonthHeader";
import regexEscape from "rww/util/regexEscape";
import {
    Gender,
    GenderDict,
    GenderPronoun,
    getHighestWarningLevel,
    MediaWikiAPI,
    Page,
    Revision,
    WarningAnalysis,
    WarningLevel,
} from "rww/mediawiki";
import i18next from "i18next";
import { PageMissingError } from "rww/errors/MediaWikiErrors";
import Group, { GroupsFromNames } from "rww/definitions/Group";
import { isIPAddress } from "rww/util";

export class User {
    /** The user's latest edit. `null` if they have never made an edit. */
    latestEdit?: Revision | null;

    private _userPage: Page;
    get userPage(): Page {
        return (
            this._userPage ??
            (this._userPage = Page.fromTitle(`User:${this.username}`))
        );
    }
    private _userSubpages: { [key: string]: Page } = {};
    private _talkPage: Page;
    get talkPage(): Page {
        return (
            this._talkPage ??
            (this._talkPage = Page.fromTitle(`User talk:${this.username}`))
        );
    }
    private _userTalkSubpages: { [key: string]: Page } = {};

    /** An analysis of the user's warning state. */
    warningAnalysis: WarningAnalysis;

    protected constructor(
        readonly username: string,
        properties?: Partial<User>
    ) {
        if (properties) Object.assign(this, properties);
    }

    /**
     * Creates a new user from their username.
     * @param username The username of the user.
     * @param additionalProperties Additional properties to add to the user.
     */
    static fromUsername(
        username: string,
        additionalProperties?: Partial<User>
    ): User {
        return new (isIPAddress(username) ? UserIP : UserAccount)(
            username,
            additionalProperties
        );
    }

    /**
     * Creates a new user from their username and immediately populates the object.
     * @param username The username of the user.
     */
    static async fromUsernameToPopulated(username: string): Promise<User> {
        const user = (isIPAddress(username)
            ? UserIP
            : UserAccount
        ).fromUsername(username);
        return await user.populate();
    }

    /**
     * Populates all missing values of a user. This also mutates the original object.
     * @param user The user to populate.
     */
    static async populate(user: User): Promise<User> {
        const userInfoRequest = await MediaWikiAPI.get({
            action: "query",
            format: "json",
            list: ["usercontribs"],
            uclimit: 1,
            ucuser: user.username,
        });

        const userLatestEdit = userInfoRequest["query"]["usercontribs"][0];

        if (userLatestEdit) {
            user.latestEdit = Revision.fromID(userLatestEdit["revid"], {
                user: user,
                page: Page.fromIDAndTitle(
                    userLatestEdit["pageid"],
                    userLatestEdit["title"]
                ),
                parentID: userLatestEdit["pageid"],
                time: new Date(userLatestEdit["timestamp"]),
                comment: userLatestEdit["comment"],
                size: userLatestEdit["size"],
            });
        } else user.latestEdit = null;

        return user;
    }

    /**
     * Checks if all of the user's properties are filled. Use this before
     * using {@link populate} in order to conserve data usage.
     */
    isPopulated(): boolean {
        return !(this.latestEdit === undefined);
    }

    /**
     * Populates all missing values of the revision. This also mutates the original object.
     */
    async populate(): Promise<User> {
        return User.populate(this);
    }

    /**
     * Gets the user's last warning level.
     * @param forceRecheck If set to `true`, RedWarn will grab the latest data from
     *        Wikipedia and overwrite the stored value.
     */
    async getWarningAnalysis(forceRecheck = false): Promise<WarningAnalysis> {
        if (!this.warningAnalysis || forceRecheck) {
            const talkPage = this.talkPage;
            try {
                const talkPageLatestRevision = await talkPage.getLatestRevision();
                const talkPageWikitext = talkPageLatestRevision?.content;
                if (!talkPageWikitext) {
                    this.warningAnalysis = {
                        level: WarningLevel.None,
                        notices: null,
                        page: talkPage,
                    };
                } else {
                    const monthHeader = getMonthHeader();
                    const talkPageSections = talkPageLatestRevision.findSections(
                        2
                    );
                    if (
                        typeof talkPageSections["*"] === "string" ||
                        !talkPageSections["*"][monthHeader]
                    )
                        this.warningAnalysis = {
                            level: WarningLevel.None,
                            notices: null,
                            page: talkPage,
                        };
                    else {
                        const monthNotices = talkPageSections["*"][monthHeader];

                        this.warningAnalysis = {
                            level: getHighestWarningLevel(monthNotices),
                            notices: monthNotices,
                            page: talkPage,
                        };
                    }
                }
            } catch (e) {
                if (e instanceof PageMissingError) {
                    this.warningAnalysis = {
                        level: WarningLevel.None,
                        notices: null,
                        page: talkPage,
                    };
                } else throw e;
            }
        }
        return this.warningAnalysis;
    }

    /**
     * Appends text to the user's talk page.
     * @param text The text to add.
     * @param underDate The date header to look for.
     * @param summary The edit comment to use.
     * @param blacklist If the page already contains this text, insertion is skipped.
     */
    async addToUserTalk(
        text: string,
        underDate: boolean,
        summary: string,
        blacklist?: {
            target: string;
            message: string;
        }
    ): Promise<void> {
        if (
            `${this.username}`.toLowerCase() == "null" ||
            `${this.username}`.toLowerCase() == "undefined"
        ) {
            RWUI.Toast.quickShow({
                content: i18next.t("ui:toasts.userUndefined"),
            });
            return;
        }

        let revisionWikitext = (
            await Page.fromTitle(
                `UserBase talk:${this.username}`
            ).getLatestRevision()
        ).content;
        // TODO Handle errors

        if (!revisionWikitext) {
            revisionWikitext = "";
        }

        const wikiTextLines = revisionWikitext.split("\n");
        let finalText = "";

        // Check blacklist (if defined)
        if (blacklist) {
            if (revisionWikitext.includes(blacklist.target)) {
                // Don't continue and show toast
                RWUI.Toast.quickShow({
                    content: blacklist.message,
                });
                return;
            }
        }

        // Check if the date header already exists.
        // If the date header was not found, we would still want to insert the date
        // header. This will make sure that a date header exists all the time.
        const dateHeader =
            new RegExp(
                `==\\s?${regexEscape(getMonthHeader())}\\s?==`,
                "gi"
            ).exec(revisionWikitext)?.[0] ?? `== ${getMonthHeader()} ==`;

        if (underDate) {
            if (dateHeader) {
                // Locate and add text in section

                // Locate where the current date section ends so we can append ours to the bottom
                let locationOfLastLine = wikiTextLines.indexOf(dateHeader) + 1;

                for (
                    let i = wikiTextLines.indexOf(dateHeader) + 1;
                    i < wikiTextLines.length;
                    i++
                ) {
                    if (wikiTextLines[i].startsWith("==")) {
                        // A new section has started (encountered a level 2 heading).
                        // The previous line would be the last line of that sectino.
                        locationOfLastLine = i - 1;
                        break;
                    } else if (i == wikiTextLines.length - 1) {
                        // End of the page.
                        locationOfLastLine = i;
                        break;
                    }
                }

                if (locationOfLastLine == wikiTextLines.length - 1) {
                    // The last line is at the bottom of the page.
                    // To prevent to end notices squishing against eachother
                    // Same as without, but we just include the date string at bottom of page
                    wikiTextLines.push(`\n${text}`);
                } else {
                    // Add notice to array at correct position.
                    wikiTextLines.splice(locationOfLastLine, 0, `\n${text}`);
                }
            } else {
                // Page doesn't have current date
                // This will insert the date header along with the user talk page.
                wikiTextLines.push(`\n${dateHeader}\n${text}`);
            }
        } else {
            // No need to add to date. Just insert at the bottom of the page.
            wikiTextLines.push(text);
        }

        // Process final string
        finalText = wikiTextLines.join("\n");
        console.log(finalText);

        await Page.fromTitle(`UserBase talk:${this.username}`).edit(
            finalText,
            `${summary} ${i18next.t("common:redwarn.signature")}`
        );
        // TODO Handle errors
    }

    /**
     * Welcomes the user.
     */
    async quickWelcome(): Promise<void> {
        const isIp = isIPAddress(this.username);
        await this.addToUserTalk(
            `\n${isIp ? RW_WELCOME_ANON : RW_WELCOME} ${RW_SIGNATURE}\n`,
            false,
            isIp ? "Welcome! (IP)" : "Welcome!"
        );
    }

    /**
     * Get a user's subpage
     * @param subpage The subpage of the user. This should not have the starting `User:Username/`
     * @returns The requested subpage
     */
    getUserSubpage(subpage: string): Page {
        return (
            this._userSubpages[subpage] ??
            (this._userSubpages[subpage] = this.userPage.getSubpage(subpage))
        );
    }

    /**
     * Get a user's talk subpage
     * @param subpage The subpage of the user's talk. This should not have the starting `User talk:Username/`
     * @returns The requested subpage
     */
    getUserTalkSubpage(subpage: string): Page {
        return (
            this._userTalkSubpages[subpage] ??
            (this._userTalkSubpages[subpage] = this.talkPage.getSubpage(
                subpage
            ))
        );
    }
}

/**
 * Represents a Mediawiki user.
 */
export class UserAccount extends User {
    /** The user id of this user. */
    id?: number;
    /** The edit count of this user. */
    editCount?: number;
    /** The date that the user registered */
    registered?: Date;
    /** The groups of the user. */
    groups?: Group[];
    /** The user's gender. */
    gender?: Gender;
    /** The user's block information (if they are blocked) */
    blocked?: BlockInfo | false;

    /**
     * Creates a new user from their username.
     * @param username The username of the user.
     * @param additionalProperties Additional properties to add to the user.
     */
    static fromUsername(
        username: string,
        additionalProperties?: Partial<UserAccount>
    ): UserAccount {
        return new UserAccount(username, additionalProperties);
    }

    /**
     * Creates a new user from their username and immediately populates the object.
     * @param username The username of the user.
     */
    static async fromUsernameToPopulated(
        username: string
    ): Promise<UserAccount> {
        const user = UserAccount.fromUsername(username);
        return await user.populate();
    }

    /**
     * Populates all missing values of a user. This also mutates the original object.
     * @param user The user to populate.
     */
    static async populate(user: UserAccount): Promise<UserAccount> {
        const toPopulate = [];
        if (!user.editCount) toPopulate.push("editcount");
        if (!user.registered) toPopulate.push("registration");
        if (!user.groups) toPopulate.push("groups");
        if (!user.gender) toPopulate.push("gender");
        if (!user.blocked) toPopulate.push("blockinfo");

        const identifier = user.getIdentifier();

        const userInfoRequest = await MediaWikiAPI.get({
            action: "query",
            format: "json",
            list: ["users"],
            usprop: toPopulate,
            [typeof identifier === "string"
                ? "ususers"
                : "ususerids"]: identifier,
        });

        const userData = userInfoRequest["query"]["users"][0];

        if (userData.missing != null)
            throw new Error("This user does not exist.");
        if (userData.invalid != null)
            throw new Error("The provided username is invalid.");

        if (!user.id) user.id = userData["userid"];
        if (!user.editCount) user.editCount = userData["editcount"];
        if (!user.registered)
            user.registered = new Date(userData["registration"]);
        if (!user.groups)
            user.groups = GroupsFromNames(
                userData["groups"].filter((v: string) => v !== "*")
            );
        if (!user.gender) user.gender = userData["gender"];
        if (!user.blocked && !!userData["blockid"])
            user.blocked = {
                id: userData["blockid"],
                blocker: User.fromUsername(userData["blockedby"]),
                reason: userData["blockreason"],
                time: new Date(userData["blockedtimestamp"]),
                expiry:
                    userData["blockexpiry"] === "infinite"
                        ? false
                        : new Date(userData["blockexpiry"]),
                partial: !!userData["blockpartial"],
                creationBlocked: !!userData["blocknocreate"],
            };
        else if (!user.blocked) user.blocked = false;

        // Get latest edit
        super.populate(user);

        return user;
    }

    /**
     * Checks if all of the user's properties are filled. Use this before
     * using {@link populate} in order to conserve data usage.
     */
    isPopulated(): boolean {
        return !(
            this.id == null ||
            this.editCount == null ||
            this.registered == null ||
            this.groups == null ||
            this.gender == null ||
            this.blocked == null ||
            this.latestEdit === undefined
        );
    }

    /**
     * Populates all missing values of the revision. This also mutates the original object.
     */
    async populate(): Promise<UserAccount> {
        return UserAccount.populate(this);
    }

    /**
     * Grabs either the user's name (always a string) or ID (always a number).
     * Returns the name if both exist as long as `favorID` is set to false.
     *
     * If this function returns `null`, the `UserAccount` was illegally created.
     * @param favorID Whether or not to favor the ID over the username.
     */
    getIdentifier(favorID = false): number | string {
        if (!!this.username && !favorID) return this.username;
        else if (!this.username && !favorID) return this.id ?? null;
        else if (!!this.id && favorID) return this.id;
        else if (!this.id && favorID) return this.username ?? null;
    }

    /**
     * Get a user's pronouns from Wikipedia.
     * @returns The user's gender pronouns.
     */
    async getPronouns(): Promise<GenderPronoun> {
        if (!this.gender) await this.populate();
        return GenderDict.get(this.gender);
    }

    /**
     * Get the user's edit count.
     * @returns The user's edit count.
     */
    async getEditCount(): Promise<number> {
        if (!this.editCount) await this.populate();
        return this.editCount;
    }
}

/**
 * Represents block information.
 */
export interface BlockInfo {
    /** The ID of the block action. */
    id: number;
    /** The user who blocked the blocked user. */
    blocker: User;
    /** The reason given by the blocker on why the user was blocked. */
    reason: string;
    /** The time at which the account was blocked. */
    time: Date;
    /** The time at which the account will be unblocked. `false` if infinite. */
    expiry: Date | false;
    /** Whether or not account creation had also been blocked. */
    creationBlocked: boolean;
    /** Whether or not the block was partial. */
    partial: boolean;
}

export class UserIP extends User {}
