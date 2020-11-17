import {Gender, GenderDict, GenderPronoun} from "./Gender";
import {getHighestLevel, WarningAnalysis} from "./WarningLevel";
import {RW_LINK_SUMMARY, RW_SIG, RW_WELCOME, RW_WELCOME_IP} from "../data/RedWarnConstants";
import WikipediaAPI from "./API";
import regexEscape from "../util/regexEscape";
import getMonthHeader from "../util/getMonthHeader";

export default class User {

    constructor(readonly username : string) {}

    async getUserPronouns(): Promise<GenderPronoun> {
        const r = await WikipediaAPI.get({
            action: "query",
            list: "users",
            usprop: "gender",
            ususers: this.username,
        });
        const gender: Gender = r.query.users[0].gender;
        return GenderDict.get(gender);
    }

    async getUserEditCount(): Promise<number> {
        const r = await WikipediaAPI.get({
            action: "query",
            list: "users",
            usprop: "editcount",
            ususers: this.username,
        });
        return r.query.users[0].editcount;
    }

    async lastWarningLevel(): Promise<WarningAnalysis> {
        const revisionWikitext =
            await WikipediaAPI.getLatestRevision(`User_talk:${mw.util.wikiUrlencode(this.username)}`);
        // TODO Handle errors

        if (!revisionWikitext)
            return { level: 0 };

        const revisionWikitextLines = revisionWikitext.split("\n");
        const warningHeaderExec =
            (new RegExp(
                `==\\s?${regexEscape(getMonthHeader())}\\s?==`,
                "gi"
            ).exec(revisionWikitext));

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
            i < revisionWikitextLines.length && revisionWikitextLines[i].startsWith("==");
            i++
        ) {
            // Add the current line to the collection of this month's notices.
            monthNotices += revisionWikitextLines[i];
        }

        return getHighestLevel(monthNotices);
    }

    async addToUserTalk(
        text: string,
        underDate: boolean,
        summary: string,
        blacklist?: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        blacklistToast?: string
    ): Promise<void> {
        if (this.username == null || this.username.toLowerCase() == "undefined") {
            // Stop it from being sent to User:undefined
            // TODO: **toasts**
            // RedWarnStore.toast.show("Sorry, an error occured. (user undef.)");
            return;
        }

        let revisionWikitext =
            await WikipediaAPI.getLatestRevision(`User_talk:${mw.util.wikiUrlencode(this.username)}`);
        // TODO Handle errors

        if (!revisionWikitext)
            revisionWikitext = "";

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
            (new RegExp(
                `==\\s?${regexEscape(getMonthHeader())}\\s?==`,
                "gi"
            ).exec(revisionWikitext))?.[0] ?? `== ${getMonthHeader()} ==`;


        if (underDate) {
            if (dateHeader) {
                // Locate and add text in section

                // Locate where the current date section ends so we can append ours to the bottom
                let locationOfLastLine =
                    wikiTextLines.indexOf(dateHeader) + 1;

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
            summary: `${summary} ${RW_LINK_SUMMARY}`
        }); // TODO Handle errors
    }

    async quickWelcome(): Promise<void> {
        const isIp = mw.util.isIPAddress(this.username);
        await this.addToUserTalk(
            `\n${isIp ? RW_WELCOME_IP : RW_WELCOME} ${RW_SIG}\n`,
            false,
            isIp ? "Welcome! (IP)" : "Welcome!"
        );
    }

}