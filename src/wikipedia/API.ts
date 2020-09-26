import RedWarnHooks from "../event/RedWarnHooks";
import redirect from "../util/redirect";
import Revision from "./Revision";
import { GenderPronoun, Gender, GenderDict } from "./Gender";
import { LastWarningLevel } from "./WarningLevels";
import {
    RW_VERSION,
    RW_WELCOME_IP,
    RW_SIG,
    RW_WELCOME,
} from "../data/RedWarnConstants";

const rw = window.RedWarnStore;
export default class WikipediaAPI {
    static api: any;
    /* static sendAPIRequest(
        query: string,
        method: "get" | "post" = "get",
        settings = {}
    ): Promise<any> {
        return new Promise((res, rej) => {
            $.ajax(
                rw.wikiAPI + query,
                Object.assign(
                    {
                        dataType: "json",
                        method: method.toUpperCase(),
                    },
                    settings
                )
            )
                .done(res)
                .fail((_, __, error) => rej(error));
        });
    } */

    /* static async getRollbackToken(): Promise<string> {
        if (this.hasPermission("rollbacker")) {
            const token = await this.sendAPIRequest(
                "?action=query&meta=tokens&type=rollback&format=json"
            );
            rw.APIStore.rollbackToken = token;
            return token;
        }
    } */

    static async isLatestRevision(
        name: string,
        revID: string,
        noRedirect = false
    ): Promise<string> {
        const r = await this.api.get({
            action: "query",
            prop: "revisions",
            titles: mw.util.wikiUrlencode(name),
            rvslots: "*",
            rvprop: ["ids", "user"],
        });
        const latestRId = r.query.pages[0].revisions[0].revid;
        const parentRId = r.query.pages[0].revisions[0].parentid;
        const latestUsername = r.query.pages[0].revisions[0].user;
        if (latestRId == revID) {
            return latestUsername;
        } else {
            if (noRedirect) {
                throw `Not latest revision! Latest revision (ID ${latestRId}) by [[User:${latestUsername}]]`;
            }
            if (rw.dialogTracker.size > 0) {
                return; // DO NOT REDIRECT IF DIALOG IS OPEN.
            }

            // TODO: **config**
            redirect(
                rw.wikiIndex +
                    "?title=" +
                    encodeURIComponent(name) +
                    "&diff=" +
                    latestRId +
                    "&oldid=" +
                    parentRId +
                    "&diffmode=source#redirectLatestRevision"
                // rw.config.rwLatestRevisionOption === "newtab"
            );
        }
    }

    static async latestRevisionNotByUser(
        name: string,
        username: string
    ): Promise<Revision> {
        const r = await this.api.get({
            action: "query",
            prop: "revisions",
            titles: mw.util.wikiUrlencode(name),
            rvslots: "*",
            rvprop: ["ids", "user", "content"],
            rvexcludeuser: username,
        });

        let _r;
        try {
            _r = r.query.pages[0].revisions[0]; // get latest revision
            if (_r == null) {
                throw "can't be null";
            } // if empty error
        } catch (error) {
            // Probably no other edits. Redirect to history page and show the notice
            redirect(
                rw.wikiIndex +
                    "?title=" +
                    encodeURIComponent(name) +
                    "&action=history#rollbackFailNoRev"
            );
            return; // exit
        }

        const latestContent = _r.slots.main.content;
        const summary = `Reverting edit(s) by [[Special:Contributions/${username}|${username}]] ([[User_talk:${username}|talk]]) to rev. ${_r.revid} by ${_r.user}`;
        return {
            content: latestContent,
            summary: summary,
            revid: _r.revid,
            parentid: _r.parentid,
        };
    }

    static async getUserPronouns(user: string): Promise<GenderPronoun> {
        const r = await this.api.get({
            action: "query",
            list: "users",
            usprop: "gender",
            ususers: user,
        });
        const gender: Gender = r.query.users[0].gender;
        return GenderDict.get(gender);
    }

    static async getUserEditCount(user: string): Promise<number> {
        const r = await this.api.get({
            action: "query",
            list: "users",
            usprop: "editcount",
            ususers: user,
        });
        return r.query.users[0].editcount;
    }

    static async lastWarningLevel(user: string): Promise<LastWarningLevel> {
        const latestR = await this.api.get({
            action: "query",
            prop: "revisions",
            titles: `User_talk:${mw.util.wikiUrlencode(user)}`,
            rvslots: "*",
            rvprop: ["content"],
        });
        let revisionWikitext = "";
        if (!latestR.query.pages[0].missing) {
            // If page isn't missing, i.e exists
            revisionWikitext =
                latestR.query.pages[0].revisions[0].slots.main.content;
        } else {
            return { level: 0 };
        }
        const wikiTxtLines = revisionWikitext.split("\n");
        // let's continue
        // Returns date in == Month Year == format and matches
        let currentDateHeading = ((d) => {
            return (
                "== " +
                [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ][d.getMonth()] +
                " " +
                d.getFullYear() +
                " =="
            );
        })(new Date());

        // rev13, add alt without space
        const currentAltDateHeading = ((d) => {
            return (
                "==" +
                [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ][d.getMonth()] +
                " " +
                d.getFullYear() +
                "=="
            );
        })(new Date());

        const pageIncludesCurrentDate = wikiTxtLines.includes(
            currentDateHeading
        );
        const pageIncludesCurrentAltDate = wikiTxtLines.includes(
            currentAltDateHeading
        );

        if (!pageIncludesCurrentDate && !pageIncludesCurrentAltDate) {
            // No warnings this month
            return { level: 0 };
        } else if (!pageIncludesCurrentDate && pageIncludesCurrentAltDate) {
            currentDateHeading = currentAltDateHeading;
        } // If ==Date== is there but == Date == isn't, use ==Date== instead.

        let highestWarningLevel = 0; // Set highest to nothing so if there is a date title w nothing in then that will be reported
        let thisMonthsNotices = ""; // for dialog
        // For each line
        for (
            let i = wikiTxtLines.indexOf(currentDateHeading) + 1;
            i < wikiTxtLines.length;
            i++
        ) {
            if (wikiTxtLines[i].startsWith("==")) {
                // New section
                break; // exit the loop
            }

            // Check if it contains logo for each level
            thisMonthsNotices += wikiTxtLines[i]; // Add to this months
            if (wikiTxtLines[i].match(/(File:|Image:)Stop hand nuvola.svg/gi)) {
                // Level 4 warning
                // This is the highest warning level. We can leave now
                highestWarningLevel = 4;
                break; // exit the loop
            }

            // Not using elseif in case of formatting ext..

            if (
                wikiTxtLines[i].match(
                    /(File:|Image:)(Nuvola apps important.svg|Ambox warning pn.svg)/gi
                )
            ) {
                // Level 3 warning
                highestWarningLevel = 3; // No need for if check as highest level exits
            }

            if (
                wikiTxtLines[i].match(/(File:|Image:)Information orange.svg/gi)
            ) {
                // Level 2 warning
                if (highestWarningLevel < 3) {
                    // We can set
                    highestWarningLevel = 2;
                }
            }

            if (wikiTxtLines[i].match(/(File:|Image:)Information.svg/gi)) {
                // Level 1 notice
                if (highestWarningLevel < 2) {
                    // We can set
                    highestWarningLevel = 1;
                }
            }
        } // End for loop

        return {
            level: highestWarningLevel,
            notices: thisMonthsNotices,
            pageContent: revisionWikitext,
        };
    }

    static async addToUserTalk(
        user: string,
        text: string,
        underDate: boolean,
        summary: string,
        blacklist?: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        blacklistToast?: string
    ): Promise<void> {
        if (user == null || user.toLowerCase() == "undefined") {
            // Stop it from being sent to User:undefined
            // TODO: **toasts**
            // rw.toast.show("Sorry, an error occured. (user undef.)");
            return;
        }

        const latestR = await this.api.get({
            action: "query",
            prop: "revisions",
            titles: `User_talk:${mw.util.wikiUrlencode(user)}`,
            rvslots: "*",
            rvprop: ["content"],
        });

        let revisionWikitext = "";
        if (!latestR.query.pages[0].missing) {
            // If page isn't missing, i.e exists
            revisionWikitext =
                latestR.query.pages[0].revisions[0].slots.main.content;
        } // else we keep to ""
        const wikiTxtLines = revisionWikitext.split("\n");
        let finalTxt = "";

        // Check blacklist (if defined)
        if (blacklist) {
            if (revisionWikitext.includes(blacklist)) {
                // Don't continue and show toast
                // TODO: **toasts**
                // rw.visuals.toast.show(blacklistToast, false, false, 5000);
                return;
            }
        }

        // let's continue
        // Returns date in == Month Year == format and matches
        let currentDateHeading = ((d) => {
            return (
                "== " +
                [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ][d.getMonth()] +
                " " +
                d.getFullYear() +
                " =="
            );
        })(new Date());
        let pageIncludesCurrentDate = wikiTxtLines.includes(currentDateHeading);
        // rev13, add alt without space (i.e ==Month Year==)
        const currentAltDateHeading = ((d) => {
            return (
                "==" +
                [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ][d.getMonth()] +
                " " +
                d.getFullYear() +
                "=="
            );
        })(new Date());
        const pageIncludesCurrentAltDate = wikiTxtLines.includes(
            currentAltDateHeading
        );

        if (!pageIncludesCurrentDate && pageIncludesCurrentAltDate) {
            // If ==Date== is there but == Date == isn't, use ==Date== instead.
            currentDateHeading = currentAltDateHeading;
            pageIncludesCurrentDate = true;
        }

        // Let's continue :)
        if (underDate) {
            if (pageIncludesCurrentDate) {
                // Locate and add text in section

                // Locate where the current date section ends so we can append ours to the bottom
                let locationOfLastLine =
                    wikiTxtLines.indexOf(currentDateHeading) + 1; // in case of date heading w nothing under it
                for (
                    let i = wikiTxtLines.indexOf(currentDateHeading) + 1;
                    i < wikiTxtLines.length;
                    i++
                ) {
                    if (wikiTxtLines[i].startsWith("==")) {
                        // New section
                        locationOfLastLine = i - 1; // the line above is therefore the last
                        console.log(
                            "exiting loop: " + wikiTxtLines[locationOfLastLine]
                        );
                        break; // exit the loop
                    } else if (i == wikiTxtLines.length - 1) {
                        // End of page, let's break and set location of last line.
                        locationOfLastLine = i;
                        break; // exit loop
                    }
                }
                console.log(locationOfLastLine);
                if (locationOfLastLine == wikiTxtLines.length - 1) {
                    // To prevent to end notices squishing against eachother
                    // Same as without, but we just include the date string at bottom of page
                    wikiTxtLines.push("\n" + text);
                } else {
                    wikiTxtLines.splice(locationOfLastLine, 0, "\n" + text); // Add notice to array at correct position. Note the "" at the start is for a newline to seperate from prev content
                }
            } else {
                // Page doesn't have current date
                // Same as without, but we just include the date string at bottom of page
                wikiTxtLines.push("\n" + currentDateHeading + "\n" + text);
            }
        } else {
            // No need to add to date. Just shove at the bottom of the page
            wikiTxtLines.push(text);
        }

        // Process final string
        wikiTxtLines.forEach((ln) => (finalTxt = finalTxt + ln + "\n")); // Remap to lines
        console.log(finalTxt);

        await this.api.postWithEditToken({
            action: "edit",
            format: "json",
            title: "User_talk:" + user,
            summary: summary + " [[w:en:WP:RW|(RW " + RW_VERSION + ")]]", // summary sign here
            text: finalTxt,
            tags: rw.wikiID == "enwiki" ? "RedWarn" : null, // Only add tags if on english wikipedia
        });
    }

    static async quickWelcome(username: string): Promise<void> {
        if (mw.util.isIpAddress(username)) {
            this.addToUserTalk(
                username,
                `\n${RW_WELCOME_IP} ${RW_SIG}\n`,
                false,
                "Welcome! (IP)"
            );
        } else {
            this.addToUserTalk(
                username,
                `\n${RW_WELCOME} ${RW_SIG}\n`,
                false,
                "Welcome!"
            );
        }
    }

    static hasPermission(perm: string): boolean {
        const g = rw.APIStore.permissions;
        let hasPerm = g.includes(perm);
        if (!hasPerm) hasPerm = g.includes("sysop"); // admins override all feature restrictions if we don't have them
        if (perm === "confirmed" && !hasPerm) {
            hasPerm = g.includes("autoconfirmed");
        } // Due to 2 types of confirmed user, confirmed and autoconfirmed, we have to check both

        return hasPerm;
    }

    static async getPermissions(): Promise<string[]> {
        const groups = await mw.user.getGroups();
        rw.APIStore.permissions = groups;
        return groups;
    }

    static async init(): Promise<void> {
        this.api = new mw.Api();
        rw.APIStore.username = mw.getName();
        await this.getPermissions();
    }
}

export interface APIStore {
    rollbackToken: string;
    permissions: string[];
    username: string;
}

export const EmptyAPIStore: APIStore = {
    rollbackToken: "",
    permissions: [],
    username: "",
};

RedWarnHooks.addHook("init", WikipediaAPI.init);
