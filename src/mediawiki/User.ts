import { RW_SIG, RW_WELCOME, RW_WELCOME_IP } from "rww/data/RedWarnConstants";
import RWUI from "rww/ui/RWUI";
import getMonthHeader from "rww/util/getMonthHeader";
import regexEscape from "rww/util/regexEscape";
import { MediaWikiAPI, Page } from "rww/mediawiki";
import { Gender, GenderDict, GenderPronoun } from "./Gender";
import { getHighestLevel, WarningAnalysis } from "./WarningLevel";
import i18next from "i18next";

interface UserInfo {
    gender: Gender;
    edits: number;
    lastWarning: WarningAnalysis;
}

/**
 * Represents a Mediawiki user.
 */
export class User {
    private cache: Partial<UserInfo> = {};

    /**
     * Creates a new user from their username.
     * @param username The username of the user.
     */
    constructor(readonly username: string) {}

    /**
     * Get a user's pronouns from Wikipedia.
     * @param forceRecheck If set to `true`, RedWarn will grab the latest data from
     *        Wikipedia and overwrite the stored value.
     * @returns The user's gender pronouns.
     */
    async getPronouns(forceRecheck = false): Promise<GenderPronoun> {
        if (!this.cache.gender || forceRecheck) {
            const r = await MediaWikiAPI.get({
                action: "query",
                list: "users",
                usprop: "gender",
                ususers: this.username,
            });
            this.cache.gender = r.query.users[0].gender;
        }
        return GenderDict.get(this.cache.gender);
    }

    /**
     * Get the user's edit count.
     * @param forceRecheck If set to `true`, RedWarn will grab the latest data from
     *        Wikipedia and overwrite the stored value.
     * @returns The user's edit count.
     */
    async getEditCount(forceRecheck = false): Promise<number> {
        if (!this.cache.edits || forceRecheck) {
            const r = await MediaWikiAPI.get({
                action: "query",
                list: "users",
                usprop: "editcount",
                ususers: this.username,
            });
            this.cache.edits = r.query.users[0].editcount;
        }
        return this.cache.edits;
    }

    /**
     * Gets the user's last warning level.
     * @param forceRecheck If set to `true`, RedWarn will grab the latest data from
     *        Wikipedia and overwrite the stored value.
     */
    async getLastWarningLevel(forceRecheck = false): Promise<WarningAnalysis> {
        if (!this.cache.lastWarning || forceRecheck) {
            const revisionWikitext = (
                await Page.fromTitle(
                    `User talk:${this.username}`
                ).getLatestRevision()
            ).content;
            // TODO Handle errors

            if (!revisionWikitext) {
                return { level: 0 };
            }

            const revisionWikitextLines = revisionWikitext.split("\n");
            const warningHeaderExec = new RegExp(
                `==\\s?${regexEscape(getMonthHeader())}\\s?==`,
                "gi"
            ).exec(revisionWikitext);

            if (warningHeaderExec != null) {
                // No warnings for this month.
                return { level: 0 };
            }

            const warningHeader = warningHeaderExec[0];

            // Set highest to nothing so if there is a date header with nothing in it,
            // then no warning will be reported.
            let monthNotices = "";
            // For each line
            for (
                let i = revisionWikitextLines.indexOf(warningHeader) + 1;
                i < revisionWikitextLines.length &&
                revisionWikitextLines[i].startsWith("==");
                i++
            ) {
                // Add the current line to the collection of this month's notices.
                monthNotices += revisionWikitextLines[i];
            }

            this.cache.lastWarning = getHighestLevel(monthNotices);
        }
        return this.cache.lastWarning;
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
            this.username == null ||
            this.username.toLowerCase() == "undefined"
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
