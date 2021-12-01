"use strict";

/**
 * RedWarn English Wikipedia Deployment Script
 * ------------------------------------------------------------------------------
 * 
 * Copyright 2021 The RedWarn Development Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * ------------------------------------------------------------------------------
 */
(async () => {
    /**
     * Authorized Wikipedia users for verification.
     */
    const authorizedUsers = [
        "Chlod"
    ];

    const signatureWaitTime = 300;

    const axiosCookieJarSupport = require("axios-cookiejar-support").default;
    const {CookieJar} = require("tough-cookie");
    const fs = require("fs");
    const git = {
        log: require("gitlog").default,
        commit: require("git-commit-info")
    };
    const packageLock = require("../package-lock.json");
    const path = require("path");
    const qs = require("querystring");

    const CI_DEPLOYSCRIPT_VERSION = "1.0.0";

    const axios = require("axios").create({
        withCredentials: true,
        jar: new CookieJar()
    });
    axiosCookieJarSupport(axios);

    console.log("============================================================");
    console.log("  RedWarn Continuous Integration for the English Wikipedia  ");
    console.log(`${
        " ".repeat(30 - Math.floor(CI_DEPLOYSCRIPT_VERSION.length / 2))
    }${
        CI_DEPLOYSCRIPT_VERSION
    }`);
    console.log("============================================================");
    console.log();

    /**
     * Prints error details and terminates.
     * 
     * @param {Error} error 
     */
    function crashAndBurn(error) {
        console.error("Fatal error occurred.");
        console.error(error);

        process.exit(500);
    }

    console.log("Setting up...");

    const root = (() => {

        let currentPath = path.resolve(process.cwd());

        let foundRoot = null;
        do {
            if (currentPath === "/") break;

            const curPath = path.resolve(currentPath, ".gitlab");
            if (fs.existsSync(curPath))
                foundRoot = currentPath;
            else
                currentPath = path.resolve(currentPath, "..");
        } while (foundRoot == null);

        if (foundRoot == null)
            crashAndBurn(new Error("Cannot find source directory."));
        return foundRoot;
    })();

    // Check for environment variables.
    if (process.env.ENWIKI_CI_USERNAME == null) {
        console.error("English Wikipedia username not supplied.");
        return;
    }
    if (process.env.ENWIKI_CI_PASSWORD == null) {
        console.error("English Wikipedia password not supplied.");
        return;
    }
    if (!fs.existsSync(path.resolve(root, "public", "redwarn.js"))) {
        console.error("Compiled redwarn.js file missing.");
        return;
    }

    const apiEndpoint = "https://en.wikipedia.org/w/api.php";

    // Ensure user agent and configuration
    axios.interceptors.request.use(function (config) {
        config.headers["User-Agent"] = `RedWarnCI/${
            CI_DEPLOYSCRIPT_VERSION
        } (https://gitlab.com/redwarn/redwarn-web; https://w.wiki/s6j) axios/${
            packageLock.dependencies["axios"].version
        }`;
    
        return config;
    });

    console.log("Declaring helper functions...");

    // ========================================================================
    // Functions
    // ========================================================================

    /**
     * Get a token from MediaWiki.
     * 
     * @param {"login"|"csrf"} tokenType 
     * @returns {string} The login token.
     */
    async function grabToken(tokenType) {
        const tokenRequest = await axios.get(apiEndpoint, {
            params: {
                action: "query",
                format: "json",
                formatversion: "2",
                meta: "tokens",
                type: tokenType
            }
        }).catch(e => crashAndBurn(e));

        return tokenRequest.data["query"]["tokens"][`${tokenType}token`];
    }
    console.log(":: grabToken declared.");

    /**
     * Remaps API:Query page objects from page ID keys to page title keys.
     * @param {Object} pagesObject 
     */
    function remapPages(pagesObject) {
        const finalObject = {};
        for (const value of Object.values(pagesObject)) {
            if (value["missing"] == null)
                finalObject[value["title"]] = value;
        }
        return finalObject;
    }
    console.log(":: remapPages declared.");

    /**
     * Build a {{/commit}} template based on given parameters.
     * @param {string} hash The commit hash.
     * @param {number} timestamp The unix timestamp (seconds, not ms) of the commit.
     * @param {string} author The author of the commit.
     * @param {string} message The commit string.
     */
    function buildCommitTemplate({
        hash, timestamp, author, message
    }) {
        // Remove email from the commit author.
        author = author.replace(/<.*@.*>/g, "");

        // Encode commit message.
        message = message
            .trim()
            .replace(/&/g, "&amp;") // Escapes
            .replace(/\{/g, "&lbrace;") // Templates
            .replace(/\}/g, "&rbrace;") // Templates
            .replace(/\[/g, "&lsqb;") // Wikilinks
            .replace(/\]/g, "&rsqb;") // Wikilinks
            .replace(/\</g, "&lt;") // HTML
            .replace(/\>/g, "&gt;") // HTML
            .replace(/\|/g, "<nowiki>|</nowiki>"); // Tables

        return fs.readFileSync(path.join(__dirname, "commit.wikitext")).toString()
            .replace(/\{\{\{hash\}\}\}/g, hash)
            .replace(/\{\{\{timestamp\}\}\}/g, timestamp)
            .replace(/\{\{\{author\}\}\}/g, author)
            .replace(/\{\{\{message\}\}\}/g, message);
    }
    console.log(":: buildCommitTemplate declared.");

    // ========================================================================
    // Setup
    // ========================================================================

    console.log("Logging into Wikipedia...");

    // Get login token
    const loginToken = await grabToken("login");
    const loginRequest = await axios.post(apiEndpoint, qs.stringify({
        action: "login",
        format: "json",
        formatversion: "2",
        lgname: process.env.ENWIKI_CI_USERNAME,
        lgpassword: process.env.ENWIKI_CI_PASSWORD,
        lgtoken: loginToken
    })).catch(e => {
        if (e.response.status !== "200")
            crashAndBurn(e);

        if (e.response.data["login"]["result"] !== "Success") {
            console.error(`${e.response.data["login"]["result"]}: ${e.response.data["login"]["reason"]}`);
            process.exit(401);
        }
    });

    console.log(":: loginToken received...");
    
    // At this point, login credentials are now stored in cookies.

    console.log(loginRequest.data);
    const username = loginRequest.data["login"]["lgusername"];

    console.log(`:: User: ${username}`);
    
    console.log("Getting deployment metadata...");
    // Get details of the latest metadata files.
    let deployMetadata;
    try {
        deployMetadata = await axios.get(apiEndpoint, {
            params: {
                action: "query",
                format: "json",
                formatVersion: 2,
                prop: "revisions",
                titles: [
                    `User:${username}/Commit Approval`,
                    `User:${username}/Commit Approval/latest.json`
                ].join("|"),
                rvprop: "timestamp|user|ids|content",
                rvslots: "main"
            }
        });
    } catch (e) {
        crashAndBurn(e);
    }

    /**
     * null if a latest.json does not exist. Sets the verification page
     * to include only the latest commit to avoid clutter.
     */
    let latestData = null;
    /**
     * null if a commit approval page does not exist. This will disable
     * revision limiting and will instead check all revisions of the page.
     * Otherwise, the data of the latest revision of the page before update.
     */
    let approvalPageRevision = null;

    // Check for missing pages.
    const deployMetadataPages = remapPages(deployMetadata.data["query"]["pages"]);
    console.log(deployMetadataPages);
    if (deployMetadataPages[`User:${username}/Commit Approval/latest.json`] == null) {
        latestData = null;
        console.log(":: Latest on-wiki version metadata not found.");
    } else {
        latestData = JSON.parse(
            deployMetadataPages
                [`User:${username}/Commit Approval/latest.json`]
                ["revisions"][0]["slots"]["main"]["*"]
        )["details"];
    }
            
    if (deployMetadataPages[`User:${username}/Commit Approval`] == null) {
        approvalPageRevision = null;
        console.log(":: Approval page not found.");
    } else {
        approvalPageRevision = deployMetadataPages
            [`User:${username}/Commit Approval`]
            ["revisions"][0];
        console.log(`:: Approval page current revision: ${approvalPageRevision.revid}`);
    }

    if (latestData != null) {
        // Confirm contents of latest.json
        if (
            typeof latestData.hash !== "string"
            || /[^a-f0-9]/g.test(latestData.hash)
            || typeof latestData.message !== "string"
            || typeof latestData.timestamp !== "number"
            || typeof latestData.author !== "string"
        ) {
            // Invalid contents. Assume no latest data.
            console.log(latestData);
            latestData = null;
            console.log(`:: Invalid latest on-wiki version metadata. Assuming none...`);
        } else {
            console.log(`:: On-wiki version: ${latestData.hash}`);
        }
    }

    // ========================================================================
    // Verification
    // ========================================================================

    console.log("Grabbing commit details...");
    // Get the latest commit details
    const headCommit = git.commit();
    console.log(`:: HEAD is at ${headCommit.hash}`);

    let preVerificationRevision;

    if (latestData == null) {
        // Build for {{{commit}}}
        const commitTemplate = buildCommitTemplate({
            hash: headCommit.hash,
            timestamp: Math.floor(
                new Date(headCommit.date).getTime() / 1000
            ),
            author: headCommit.author,
            message: headCommit.message.trim()
        });

        console.log("Saving verification page (latest commit info only)...");
        // Save this to the verification page on-wiki
        console.log(preVerificationRevision = (await axios.post(apiEndpoint, qs.stringify({
            action: "edit",
            format: "json",
            title: `User:${username}/Commit Approval`,
            text: `${
                fs.readFileSync(path.join(__dirname, "msg_verify_head.wikitext"))
                    .toString()
                    .replace(/\{\{\{env:([^}]+)\}\}\}/g, (_, env) => process.env[env])
            }\n${
                fs.readFileSync(path.join(__dirname, "msg_verify_first.wikitext"))
                    .toString()
                    .replace(/\{\{\{commits\}\}\}/g, commitTemplate)
            }\n${
                fs.readFileSync(path.join(__dirname, "msg_verify_tail.wikitext"))
                    .toString()
                    .replace(/\{\{\{users\}\}\}/g, 
                        authorizedUsers
                        .map((v, i) => `${
                            authorizedUsers.length > 1 &&
                            i == authorizedUsers.length - 1 ?
                                " or " : ""
                        }{{u|${v}}}`)
                        .join(authorizedUsers.length > 2 ? ", " : "")
                        .replace(/\s+/g, " ")
                    )
            }`,
            summary: `Preparing verification page for [[User:${
                username
            }/.js]] [[WP:RW/CD|update]] to commit ${
                headCommit.shortHash
            } ([[WP:BOT|bot]])`,
            bot: true,
            token: await grabToken("csrf")
        }))).data);
        console.log(`:: Saved to User:${username}/Commit Approval.`);
    } else {
        console.log("Building commit list...");
        // Get all commits since last push
        const toPush = git.log({
            repo: root,
            after: new Date(latestData.timestamp + 1000),
            fields: ["hash", "abbrevHash", "authorDate", "authorName", "rawBody"]
        })

        if (toPush.length === 0) {
            console.warn("Nothing to push. Stopping here.");
            return;
        }

        // Build for {{{commit}}}
        const commitTemplates = [];

        for (const commit of toPush) {
            console.log(`:: Found commit: ${commit.abbrevHash}...`);
            commitTemplates.push(
                buildCommitTemplate({
                    hash: commit.hash,
                    timestamp: Math.floor(
                        new Date(commit.authorDate).getTime() / 1000
                    ),
                    author: commit.authorName,
                    message: commit.rawBody
                })
            );
        }

        console.log("Saving verification page...");
        // Save this to the verification page on-wiki
        console.log(preVerificationRevision = (await axios.post(apiEndpoint, qs.stringify({
            action: "edit",
            format: "json",
            formatVersion: 2,
            title: `User:${username}/Commit Approval`,
            text: `${
                fs.readFileSync(path.join(__dirname, "msg_verify_head.wikitext"))
                    .toString()
            }\n${
                fs.readFileSync(path.join(__dirname, "msg_verify.wikitext"))
                    .toString()
                    .replace(/\{\{\{commits\}\}\}/g, commitTemplates.join("\n"))
            }\n${
                fs.readFileSync(path.join(__dirname, "msg_verify_tail.wikitext"))
                    .toString()
            }`,
            summary: `Preparing verification page for [[User:${
                username
            }/.js]] [[WP:RW/CD|update]] to commit ${
                headCommit.shortHash
            } ([[WP:BOT|bot]])`,
            bot: true,
            token: await grabToken("csrf")
        }))).data);
        console.log(`:: Saved to User:${username}/Commit Approval.`);
    }

    // Await edits. Check every 10 seconds.
    const verifyStartTime = Date.now();
    let latestVerificationRevision = {
        revid: preVerificationRevision["edit"].newrevid
    };

    let signingInfo = null;

    let signingDone = false;
    const interval = setInterval(async () => {
        console.log(`Checking for revisions (${
            Math.round(((verifyStartTime + signatureWaitTime * 1000) - Date.now()) / 1000)
        }s left)...`);

        // Grab revisions since last check. Bottom is newest.
        const revisionsSince = await axios.get(apiEndpoint, {
            params: {
                action: "query",
                format: "json",
                titles: `User:${username}/Commit Approval`,
                prop: "revisions",
                rvdir: "newer",
                rvprop: [
                    "ids", "timestamp", "user", "content"
                ].join("|"),
                rvslots: "main",
                rvstartid: latestVerificationRevision.revid
            }
        });

        for (
            const revision of Object.values(revisionsSince.data["query"]["pages"])[0]["revisions"]
        ) {
            if (revision.revid === latestVerificationRevision.revid)
                continue;

            if (revision["user"] === username)
                // Ignore
                continue;

            if (!authorizedUsers.includes(revision["user"])) {
                console.log(`:: ${
                    revision["user"]
                } edited the page but is not part of the authorized users list. Disregarding...`);
                continue;
            }

            // Authorized user made an edit on the page. Grab their signature.
            // This asks `signatures` on Toolforge for their raw signature, and
            // then runs a PST in order to parse out the `subst:`s
            const signature = (await axios.post(apiEndpoint, qs.stringify({
                action: "parse",
                format: "json",
                title: `User:${username}/Commit Approval`,
                text: (await axios.get(
                    `https://signatures.toolforge.org/api/v1/check/en.wikipedia.org/${
                        encodeURIComponent(revision["user"])
                    }`
                )).data.signature,
                prop: "text",
                onlypst: 1,
                contentmodel: "wikitext"
            }))).data["parse"]["text"]["*"];
            
            console.log(`:: Expecting signature: ${signature}`);

            const signatureRegexEscaped = signature
                .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

            const content = revision["slots"]["main"]["*"];

            if (!signingDone) {
                const a1Regex = (new RegExp(`<span id="rwci-a1">\\s*(${
                    signatureRegexEscaped
                }) (\\d{2}:.+\\(UTC\\))\\s*<\\/span>`)).exec(content);
                
                if (a1Regex != null && a1Regex[1] && a1Regex[2]) {
                    signingInfo = {
                        user: revision.user,
                        revision: revision.revid,
                        signature: a1Regex[1],
                        date: a1Regex[2]
                    };
                    console.log(`:: ${
                        revision["user"]
                    } has verified themselves at ${signingInfo["date"]}`);

                    signingDone = true;
                }
            }

            // Swap over the latest verification revision.
            latestVerificationRevision = revision;
        }

        if (Math.round(((verifyStartTime + signatureWaitTime * 1000) - Date.now()) / 1000) < 0)
            signingDone = true;
    }, 10000);

    console.log("Awaiting revisions...");

    let waitingInterval;
    await new Promise(r => {
        waitingInterval = setInterval(() => {
            if (signingDone)
                r();
        }, 5);
    });
    clearInterval(waitingInterval);
    clearInterval(interval);

    console.log(":: Revision waiting done.");

    // ========================================================================
    // Saving
    // ========================================================================
    if (!signingInfo) {
        // No approvals. Cancel.
        console.warn("No approvals. Push cancelled.");
        return;
    } else {
        console.log(`Approved by ${signingInfo.user}.`);
        console.log("Making changes to the userscript...");

        console.log((await axios.post(apiEndpoint, qs.stringify({
            action: "edit",
            format: "json",
            title: `User:${username}/.js`,
            text: 
                fs.readFileSync(path.resolve(root, "public", "redwarn.js"))
                    .toString(),
            summary: `[[WP:RW/CD|Updating script]] to commit as of ${
                headCommit.shortHash
            }: "${
                headCommit.message
                    .split("\n")[0]
                    .substr(0, 50)
            }" by ${
                headCommit.author
            } ([[WP:BOT|bot]], triggered by [[User:${
                signingInfo.user
            }|${
                signingInfo.user
            }]] ([[Special:Diff/${
                signingInfo.revision
            }|approval]]))`,
            bot: true,
            token: await grabToken("csrf")
        }))).data);

        console.log(":: Updated. Saving latest commit information...");

        console.log((await axios.post(apiEndpoint, qs.stringify({
            action: "edit",
            format: "json",
            title: `User:${username}/Commit Approval/latest.json`,
            text: JSON.stringify({
                "meta": "This page will be automatically blanked and replaced with the pending commits to be approved when continuous integration is activated.",
                "details": {
                    "hash": headCommit.hash,
                    "message": headCommit.message,
                    "timestamp": new Date(headCommit.date).getTime(),
                    "author": headCommit.author
                }
            }
            ),
            summary: `[[WP:RW/CD|Updating latest commit tracking file]] to commit as of ${
                headCommit.shortHash
            }: "${
                headCommit.message
                    .split("\n")[0]
                    .substr(0, 50)
            }" by ${
                headCommit.author
            } ([[WP:BOT|bot]], triggered by [[User:${
                signingInfo.user
            }|${
                signingInfo.user
            }]] ([[Special:Diff/${
                signingInfo.revision
            }|approval]]))`,
            bot: true,
            token: await grabToken("csrf")
        }))).data);

        console.log(":: Latest commit information saved.");
    }

    console.log("Cleaning up...");

    console.log((await axios.post(apiEndpoint, qs.stringify({
        action: "edit",
        format: "json",
        title: `User:${username}/Commit Approval`,
        text: 
            fs.readFileSync(path.join(__dirname, "msg_verify_done.wikitext"))
                .toString(),
        summary: `[[WP:RW/CD|Cleaning up...]] ([[WP:BOT|bot]])`,
        bot: true,
        token: await grabToken("csrf")
    }))).data);
})();