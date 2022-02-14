import RedWarnUI from "rww/ui/RedWarnUI";
import getMonthHeader from "rww/util/getMonthHeader";
import {
    Gender,
    GenderDict,
    GenderPronoun,
    GroupArray,
    GroupsFromNames,
    MediaWikiAPI,
    Page,
    PageEditOptions,
    Revision,
    WarningAnalysis,
    WarningLevel,
    WarningOptions,
    WarningType
} from "rww/mediawiki";
import i18next from "i18next";
import {PageMissingError, UserInvalidError, UserMissingError} from "rww/errors/MediaWikiErrors";
import {isIPAddress} from "rww/util";

import Section from "rww/mediawiki/core/Section";
import {highestWarningLevel} from "rww/mediawiki/warn/WarningUtils";

/**
 * The User represents a MediaWiki editor, be it a registered user or an IP address.
 * In the MediaWiki database, this is commonly called an "actor".
 */
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
            ucuser: user.username
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
                size: userLatestEdit["size"]
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
                const talkPageSections = await talkPage.getSections();
                const talkPageWikitext = talkPage.latestCachedRevision.content;
                if (!talkPageWikitext || talkPageWikitext.length === 0) {
                    this.warningAnalysis = {
                        level: WarningLevel.None,
                        notices: null,
                        page: talkPage
                    };
                } else {
                    const currentMonthSection = talkPageSections.filter(
                        (s) => s.title === getMonthHeader()
                    )[0];
                    if (!currentMonthSection)
                        this.warningAnalysis = {
                            level: WarningLevel.None,
                            notices: null,
                            page: talkPage
                        };
                    else {
                        const content = currentMonthSection.getContent();

                        this.warningAnalysis = {
                            level: highestWarningLevel(content),
                            notices: content,
                            page: talkPage
                        };
                    }
                }
            } catch (e) {
                if (e instanceof PageMissingError) {
                    this.warningAnalysis = {
                        level: WarningLevel.None,
                        notices: null,
                        page: talkPage
                    };
                } else throw e;
            }
        }
        return this.warningAnalysis;
    }

    /**
     * Appends text to the user's talk page.
     * @param text The text to add.
     * @param options Additional insertion options.
     * @param options.summary The summary of the edit.
     * @param options.section The section to append the text to.
     * @param options.blacklist Prevent appending if this wikitext was found on the page.
     */
    async appendToUserTalk(
        text: string,
        options: PageEditOptions & {
            summary?: string;
            section?: string | number | Section;
            blacklist?: { target: string; message: string };
        }
    ): Promise<void> {
        if (
            this.username == null ||
            `${this.username}`.toLowerCase() == "null" ||
            `${this.username}`.toLowerCase() == "undefined"
        ) {
            RedWarnUI.Toast.quickShow({
                content: i18next.t("ui:toasts.userUndefined")
            });
            return;
        }

        let revision = null;
        try {
            // Get the sections to avoid getting useless revision information.
            await this.talkPage.getSections();
            revision = this.talkPage.latestCachedRevision;
        } catch (e) {
            if (e instanceof PageMissingError) {
                debugger;
                // Page does not exist. We're making a new page.
            } else throw e;
        }

        // Check if this talk page should be messaged.
        if (revision && options.blacklist) {
            if (revision.content.includes(options.blacklist.target)) {
                // Don't continue and show toast
                RedWarnUI.Toast.quickShow({
                    content: options.blacklist.message
                });
                return;
            }
        }

        this.talkPage.appendContent(text, options);
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

    /**
     * Warn a user.
     * @param options Warning options
     */
    static async warn(options: WarningOptions): Promise<boolean> {
        if (options == null) return false;
        const level = {
            [WarningType.Tiered]: options.warnLevel,
            [WarningType.PolicyViolation]: 5,
            [WarningType.SingleIssue]: 0
        }[options.warning.type];
        await options.targetUser.appendToUserTalk(
            // Adds in one empty line.
            `\r\n\r\n${options.warningText}`,
            {
                comment: i18next.t("mediawiki:summaries.warn", {
                    context: level,
                    reason: options.warning.name
                }),
                section: getMonthHeader()
            }
        );
        return true;
    }
}

/**
 * Represents a MediaWiki user.
 */
export class UserAccount extends User {
    static current: UserAccount = UserAccount.fromUsername(
        mw.config.get("wgUserName")
    );

    /** The user id of this user. */
    id?: number;
    /** The edit count of this user. */
    editCount?: number;
    /** The date that the user registered */
    registered?: Date;
    /** The groups of the user. */
    groups?: GroupArray;
    /** The user's gender. */
    gender?: Gender;
    /** The user's block information (if they are blocked) */
    blocked?: BlockInfo | false;

    private _sandbox: Page;
    get sandbox(): Page {
        return (
            this._sandbox ??
            (this._sandbox = Page.fromTitle(`User:${this.username}/sandbox`))
        );
    }

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

        const userInfoRequestPromise = MediaWikiAPI.get({
            action: "query",
            format: "json",
            list: ["users"],
            usprop: toPopulate,
            [typeof identifier === "string"
                ? "ususers"
                : "ususerids"]: identifier
        }).then((v: JQueryXHR) => v);
        const [userInfoRequest] = await Promise.all([
            userInfoRequestPromise,
            await super.populate(user)
        ]);

        const userData = userInfoRequest["query"]["users"][0];

        if (userData.missing != null)
            throw new UserMissingError({ user: user });
        if (userData.invalid != null)
            throw new UserInvalidError({ user: user });

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
                creationBlocked: !!userData["blocknocreate"]
            };
        else if (!user.blocked) user.blocked = false;

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
