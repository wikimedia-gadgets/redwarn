import i18next from "i18next";
import {
    RW_LINK_SUMMARY,
    RW_SIG,
    RW_WELCOME,
    RW_WELCOME_IP,
} from "rww/data/RedWarnConstants";
import RWUI from "rww/ui/RWUI";
import getMonthHeader from "rww/util/getMonthHeader";
import regexEscape from "rww/util/regexEscape";
import WikipediaAPI from "./API";
import { Gender, GenderDict, GenderPronoun } from "./Gender";
import { getHighestLevel, WarningAnalysis } from "./WarningLevel";

interface UserInfo {
    gender: Gender;
    edits: number;
    lastWarning: WarningAnalysis;
}

/**
 * Represents a Mediawiki user.
 */
export default class User {
    private memory: Partial<UserInfo> = {};

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
    async getUserPronouns(forceRecheck = false): Promise<GenderPronoun> {
        if (!this.memory.gender || forceRecheck) {
            const r = await WikipediaAPI.get({
                action: "query",
                list: "users",
                usprop: "gender",
                ususers: this.username,
            });
            this.memory.gender = r.query.users[0].gender;
        }
        return GenderDict.get(this.memory.gender);
    }

    /**
     * Get the user's edit count.
     * @param forceRecheck If set to `true`, RedWarn will grab the latest data from
     *        Wikipedia and overwrite the stored value.
     * @returns The user's edit count.
     */
    async getUserEditCount(forceRecheck = false): Promise<number> {
        if (!this.memory.edits || forceRecheck) {
            const r = await WikipediaAPI.get({
                action: "query",
                list: "users",
                usprop: "editcount",
                ususers: this.username,
            });
            this.memory.edits = r.query.users[0].editcount;
        }
        return this.memory.edits;
    }

    /**
     * Gets the user's last warning level.
     * @param forceRecheck If set to `true`, RedWarn will grab the latest data from
     *        Wikipedia and overwrite the stored value.
     */
    async lastWarningLevel(forceRecheck = false): Promise<WarningAnalysis> {
        if (!this.memory.lastWarning || forceRecheck) {
            const revisionWikitext = (
                await WikipediaAPI.getRevision(
                    `User_talk:${mw.util.wikiUrlencode(this.username)}`
                )
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

            this.memory.lastWarning = getHighestLevel(monthNotices);
        }
        return this.memory.lastWarning;
    }

    /**
     * Appends text to the user's talk page.
     * @param text The text to add.
     * @param underDate The date header to look for.
     * @param summary The edit summary to use.
     * @param blacklist If the page already contains this text, insertion is skipped.
     * @param blacklistToast Whether or not to show a toast if the insertion was skipped.
     */
    async addToUserTalk(
        text: string,
        underDate: boolean,
        summary: string,
        blacklist?: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        blacklistToast?: string
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
            await WikipediaAPI.getRevision(
                `User_talk:${mw.util.wikiUrlencode(this.username)}`
            )
        ).content;
        // TODO Handle errors

        if (!revisionWikitext) {
            revisionWikitext = "";
        }

        const wikiTextLines = revisionWikitext.split("\n");
        let finalText = "";

        // Check blacklist (if defined)
        if (blacklist) {
            if (revisionWikitext.includes(blacklist)) {
                // Don't continue and show toast
                // TODO: **toasts**
                // RedWarnStore.visuals.toast.show(blacklistToast, false, false, 5000);
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

        await WikipediaAPI.editPage({
            page: `User_talk:${this.username}`,
            text: finalText,
            summary: `${summary} ${RW_LINK_SUMMARY}`,
        }); // TODO Handle errors
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
