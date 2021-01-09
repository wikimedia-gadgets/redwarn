import { RW_SIG, RW_WELCOME, RW_WELCOME_IP } from "rww/data/RedWarnConstants";
import RWUI from "rww/ui/RWUI";
import getMonthHeader from "rww/util/getMonthHeader";
import regexEscape from "rww/util/regexEscape";
import {
    Gender,
    GenderDict,
    GenderPronoun,
    MediaWikiAPI,
    Page,
    Revision,
    WarningAnalysis,
} from "rww/mediawiki/MediaWiki";
import i18next from "i18next";

/**
 * Represents a Mediawiki user.
 */
export class User {
    /** The user id of this user. */
    id?: number;
    /** The edit count of this user. */
    editCount?: number;
    /** The date that the user registered */
    registered?: Date;
    /** The groups of the user. */
    groups?: string[];
    /** The user's gender. */
    gender?: Gender;
    /** The user's block information (if they are blocked) */
    blocked?: BlockInfo | false;
    /** The user's latest edit. `null` if they have never made an edit. */
    latestEdit?: Revision | null;

    get userPage(): Page {
        return Page.fromTitle(`User:${this.username}`);
    }
    get talkPage(): Page {
        return Page.fromTitle(`User talk:${this.username}`);
    }

    /** An analysis of the user's warning state. */
    warningAnalysis: WarningAnalysis;

    protected constructor(
        readonly username: string,
        properties?: Partial<typeof User>
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
        return User.fromUsername(username, additionalProperties);
    }

    /**
     * Creates a new user from their username and immediately populates the object.
     * @param username The username of the user.
     */
    static async fromUsernameToPopulated(username: string): Promise<User> {
        const user = User.fromUsername(username);
        return await user.populate();
    }

    /**
     * Populates all missing values of a user. This also mutates the original object.
     * @param user The user to populate.
     */
    static async populate(user: User): Promise<User> {
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
            list: ["users", "usercontribs"],
            continue: toPopulate,
            usprop: toPopulate,
            uclimit: 1,
            ...(typeof identifier === "string"
                ? {
                      ususers: identifier,
                      ucuser: identifier,
                  }
                : {
                      ususerids: identifier,
                      ucuserids: identifier,
                  }),
        });

        const userData = userInfoRequest["query"]["users"][0];
        const userLatestEdit = userInfoRequest["query"]["usercontribs"][0];

        if (userData.missing != null)
            throw new Error("This user does not exist.");
        if (userData.invalid != null)
            throw new Error("The provided username is invalid.");

        if (!user.editCount) user.editCount = userData["editcount"];
        if (!user.registered)
            user.registered = new Date(userData["registration"]);
        if (!user.groups)
            user.groups = userData["groups"].filter((v: string) => v !== "*");
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
        return Object.entries(this).reduce(
            (p, n: any): boolean => p && n[1] !== undefined,
            true
        );
    }

    /**
     * Populates all missing values of the revision. This also mutates the original object.
     */
    async populate(): Promise<User> {
        return User.populate(this);
    }

    /**
     * Grabs either the user's name (always a string) or ID (always a number).
     * Returns the name if both exist as long as `favorID` is set to false.
     *
     * If this function returns `null`, the `User` was illegally created.
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

    /**
     * Gets the user's last warning level.
     * @param forceRecheck If set to `true`, RedWarn will grab the latest data from
     *        Wikipedia and overwrite the stored value.
     */
    async getLastWarningLevel(forceRecheck = false): Promise<WarningAnalysis> {
        // Under repair.
        return;
        // if (!this.warningAnalysis || forceRecheck) {
        //     const talkPage = this.talkPage;
        //     try {
        //         const talkPageWikitext = (await talkPage.getLatestRevision()).content;
        //
        //         if (!talkPageWikitext) {
        //             return {
        //                 level: WarningLevel.None,
        //                 notices: null,
        //                 page: talkPage
        //             };
        //         }
        //
        //         const revisionWikitextLines = talkPageWikitext.split("\n");
        //         const warningHeaderExec = new RegExp(
        //             `==\\s?${regexEscape(getMonthHeader())}\\s?==`,
        //             "gi"
        //         ).exec(talkPageWikitext);
        //
        //         if (warningHeaderExec != null) {
        //             // No warnings for this month.
        //             return { level: 0 };
        //         }
        //
        //         const warningHeader = warningHeaderExec[0];
        //
        //         let monthNotices = "";
        //         for (
        //             let i = revisionWikitextLines.indexOf(warningHeader) + 1;
        //             i < revisionWikitextLines.length &&
        //             revisionWikitextLines[i].startsWith("==");
        //             i++
        //         ) {
        //             // Add the current line to the collection of this month's notices.
        //             monthNotices += revisionWikitextLines[i];
        //         }
        //
        //         this.warningAnalysis = getHighestWarningLevel(monthNotices);
        //     } catch (e) {
        //         if (e instanceof PageMissingError) {
        //             return {
        //                 level: WarningLevel.None,
        //                 notices: null,
        //                 page: talkPage
        //             };
        //         } else
        //             throw e;
        //     }
        // }
        // return this.warningAnalysis;
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
                `User talk:${this.username}`
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

        await Page.fromTitle(`User talk:${this.username}`).edit(
            finalText,
            `${summary} ${i18next.t("common:redwarn.signature")}`
        );
        // TODO Handle errors
    }

    /**
     * Welcomes the user.
     */
    async quickWelcome(): Promise<void> {
        const isIp = mw.util.isIPAddress(this.username);
        await this.addToUserTalk(
            `\n${isIp ? RW_WELCOME_IP : RW_WELCOME} ${RW_SIG}\n`,
            false,
            isIp ? "Welcome! (IP)" : "Welcome!"
        );
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
