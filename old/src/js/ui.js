/**
 * Most of RedWarn's UI elements and functions that require user input are here.
 * @class rw.ui
 */
// Most UI elements
// See also dialog.js (dialogEngine) and mdlContainer.js (mdlContainer)
rw.ui = {
    "revisionBrowser" : url=> {
        // Show new container for revision reviewing
        dialogEngine.create(mdlContainers.generateContainer(`
        <div id="close" class="icon material-icons" style="float:right;">
            <span style="cursor: pointer; padding-right:15px;" onclick="window.parent.postMessage('closeDialog');">
                clear
            </span>
        </div>
        <div class="mdl-tooltip" for="close">
            Close
        </div>
         <iframesrc="`+ url +`" frameborder="0" style="height:95%;"></iframe>
        `, window.innerWidth-70, window.innerHeight-50)).showModal();
    },

    "beginWarn" : (ignoreWarnings, un, pg, customCallback, callback, hideUserInfo, autoSelectReasonIndex)=> { // if customCallback = false, callback(templatestr) (rev12) autoSelectReasonIndex(rev13) for quick rollbacks for vandalism ext..
        // Give user a warning (show dialog)
        
        let autoLevelSelectEnable = (!hideUserInfo) && (rw.userIsNotEC == null) && (rw.config.rwautoLevelSelectDisable != "disable"); // If autolevelselect enabled (always disabled on hideUserInfo options), non-EC always disabled (rw16)

        // Let's continue

        // Assemble rule listbox
        let finalListBox = "<span>";
        let currentHeading = "";
        rw.rules.forEach((rule, i) => {
            // Check if category is different to current heading first
            if (rule.catagory != currentHeading) {
                // Now generate a new heading and section for search to hide
                finalListBox += `</span> <!-- close prior category -->
                <span class="rwNoticeCatagory"> <!-- used for search -->
                <div class="rwNoticeCatagoryHead" style="
                    text-align: center;
                    font-family: Roboto;
                    font-weight: 300;
                    width: 100%;
                    cursor: pointer;
                ">${rule.catagory}</div>`;

                // A new heading is needed
                currentHeading = rule.catagory; // set to ours for detection
            }

            // Add appropriate list format per config
            if (rw.config.rwNoticeListByTemplateName != "enable") {
                // Standard listing by rule description
                let style = "";
                if (rule.name.length > 62) {
                    // Too long to fit
                    style="font-size:14px";
                }
                finalListBox += `<li
                class="mdl-menu__item"
                data-val="`+ i +`"
                onmousedown="refreshLevels(`+i+`);"
                style="`+style +`">
                    ${rule.name} <!-- ${rule.template} (comment for search) -->
                </li>`; // add dataselected if = autoSelectReasonIndex & autoselect is enabled
            } else {
                // List by template name
                let style = "";
                if (rule.name.length > 62) {
                    // Too long to fit
                    style="font-size:14px"; // style here applies to span that will show on hover
                }
                finalListBox += `<li
                class="mdl-menu__item"
                data-val="`+ i +`"
                id="rwTemplateSelect${i}"
                onmousedown="refreshLevels(`+i+`);">
                    ${rule.template} <!-- ${rule.name} (comment for search) -->
                </li>
                <!-- Add script to change to reason on mouseover -->
                <script>$("#rwTemplateSelect${i}").mouseenter(()=>{
                    // Mouse has entered the box
                    $("#rwTemplateSelect${i}").html(\`<span style="${style}">${rule.name}</span>\`); // set to rule name
                });
                $("#rwTemplateSelect${i}").mouseleave(()=>{
                    // Mouse has entered the box
                    $("#rwTemplateSelect${i}").html(\`${rule.template} <!-- ${rule.name} (comment for search) -->\`); // set to default
                });
                </script>
                `; 
            }
        });
        finalListBox += `</span>`; // close final catagory

        // Setup preview handling
        addMessageHandler("generatePreview`*", m=>{
            rw.info.parseWikitext(m.split("`")[1], parsed=>{ // Split to Wikitext and send over to the API to be handled
                dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                    "action": "parseWikiTxt",
                    "result": parsed}, '*'); // push to container for handling in dialog and add https:// to stop image breaking
            });
        });

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false, 5000));

        // Add admin report handler
        addMessageHandler("adminR", ()=>rw.ui.adminReportSelector(un));

        // Add recent page handelr
        addMessageHandler("openRecentPageSelector", ()=>rw.ui.recentlyVisitedSelector.showDialog(p=>{
            // Send page back to container
            dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                "action": "recentPage",
                "result": p.replace(/_/g, ' ')}, '*');
        }));

        // Add submit handler

        addMessageHandler("applyNotice`*", eD=> {
            // i.e applyNotice`user`wikitext`summary
            // TODO: maybe b64 encode?
            let _eD = eD.split("`"); // params
            let user = _eD[1];
            let wikiTxt = _eD[2];
            let rule = _eD[3];
            let template = _eD[4].split("|")[0];
            let warningLevel = "N/A";

            if ((customCallback == null) || (customCallback == false)) { // if not set
                // Map warning level
                (['1', '2', '3', '4', '4im']).forEach(e=>{
                    if (template.includes(e)) warningLevel = e; // if includes this level, add
                });

                console.log({user, wikiTxt, rule, template, warningLevel}); // debug

                // MAKE EDIT - summary with warning info
                let summary = `${
                    ({  
                        "N/A" : "Notice:",
                        "1" : "Note:",
                        "2" : "Caution:",
                        "3" : "Warning:",
                        "4" : "Final Warning:",
                        "4im": "ONLY Warning:"
                    })[warningLevel]
                } ${rule}`;

                // MAKE EDIT
                rw.info.addWikiTextToUserPage(user, wikiTxt, true, summary);
            } else {
                // Send callback
                callback(wikiTxt);
            }
        });

        // Check most recent warning level

        rw.info.lastWarningLevel(rw.info.targetUsername(un), (w, usrPgMonth, userPg)=>{
            let lastWarning = [ // Return HTML for last warning level.
                // NO PAST WARNING
                `
                <span class="material-icons" id="PastWarning" style="cursor:help;position: relative;top: 5px;padding-left: 10px;color:green;">thumb_up</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    No notices this month.
                    </span>
                </div>
                `,

                // NOTICE
                `
                <span class="material-icons" id="PastWarning" style="cursor:help;position: relative;top: 5px;padding-left: 10px;color:blue;">info</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    Has been given a Level 1 notice this month.
                    </span>
                </div>
                `,
                // CAUTION
                `
                <span class="material-icons" id="PastWarning" style="cursor:help;position: relative;top: 5px;padding-left: 10px;color:orange;">announcement</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    Has been given a Level 2 caution this month.
                    </span>
                </div>
                `,
                // Warning- in red. RedWarn, get it? This is the peak of programming humour.
                `
                <span class="material-icons" id="PastWarning" style="cursor:help;position: relative;top: 5px;padding-left: 10px; color:red;">report_problem</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    Has been given a Level 3 warning this month.
                    </span>
                </div>
                `,

                // Final/Only Warning (dark red)
                `
                <span class="material-icons" id="PastWarning" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:#a20000;" onclick="window.parent.postMessage('adminR');">report</span>
                <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning">
                    <span style="font-size:x-small;">
                    Has been given a Level 4 Final or ONLY warning.<br/>
                    Click here to report to admins for vandalism. Review user page first.
                    </span>
                </div>
                `
            ][w];

            // CREATE DIALOG
            // MDL FULLY SUPPORTED HERE (container). 
            dialogEngine.create(mdlContainers.generateContainer(`[[[[include warnUserDialog.html]]]]`, 500, 630)).showModal(); // 500x630 dialog, see warnUserDialog.html for code
        });
            
    }, // end beginWarn

    /**
     * Open the "new talk page message" dialog for the specified username
     *
     * @param {string} un Target username
     * @param {boolean} noRedirect If true, a callback will be used rather than submitting the notice.
     * @param {string} buttonTxt Text to use instead of default "Send Message" for submit button
     * @param {function} callback Callback to use if noRedirect is true
     * @method newMessage
     * @extends rw.ui
     */
    "newMsg" : (un, noRedirect, buttonTxt, callback)=>{
        // New message dialog
        // Setup preview handling
        addMessageHandler("generatePreview`*", m=>{
            rw.info.parseWikitext(m.split("`")[1], parsed=>{ // Split to Wikitext and send over to the API to be handled
                dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                    "action": "parseWikiTxt",
                    "result": parsed}, '*'); // push to container for handling in dialog and add https:// to stop image breaking
            });
        });

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,15000));

        // Add submit handler

        addMessageHandler("applyNotice`*", eD=> {
            // i.e applyNotice`user`wikitext`summary
            // TODO: maybe b64 encode?
            let _eD = eD.split("`"); // params
            let user = _eD[1];
            let wikiTxt = _eD[2];
            let summary = _eD[3];
            if (noRedirect) { // If no redirect, callback
                callback(wikiTxt);
            } else {
                // MAKE EDIT
                rw.info.addWikiTextToUserPage(user, wikiTxt, false, summary); // This requires title.
            }
        });

        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(`[[[[include newMsg.html]]]]`, 500, 390)).showModal(); // 500x390 dialog, see newMsg.html for code
    },


    /**
     * Registers the right-click context menu feature for user links.
     *
     * @method registerContextMenu
     * @extends rw.ui
     */
    "registerContextMenu" : () => { // Register context menus for right-click actions
        // More docs at https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html

        // USER TALK ACTIONS - check if not disabled then continue
        if (rw.config.rwDisableRightClickUser != "disable") $(()=>{
            // REV15 - only trigger on shift+right-click unless if set in settings - If config is set to "Opt2", to open on right-click set in preferences, set below in trigger
            if (rw.config.rwDisableRightClickUser != "Opt2") {
                $('a[href*="/wiki/User_talk:"], a[href*="/wiki/User:"], a[href*="/wiki/Special:Contributions/"]').on('contextmenu', e=>{
                
                    // if shift key not down, don't show the context menu. 
                    if (!e.shiftKey) return; 
                    e.preventDefault();
                    $(e.currentTarget).contextMenu();
                });
            }
            
            $.contextMenu({
                trigger: (rw.config.rwDisableRightClickUser == "Opt2" ? undefined : 'none'), // if set in options, activate as usual
                selector: 'a[href*="/wiki/User_talk:"], a[href*="/wiki/User:"], a[href*="/wiki/Special:Contributions/"]', // Select all appropriate user links
                callback: (act, info)=>{
                    // CALLBACK
                    let hrefOfSelection = $(info.$trigger[0]).attr("href"); // href of userpage or contribs
                    let targetUsername = "";
                    if (hrefOfSelection.includes("/wiki/User_talk:") || hrefOfSelection.includes("/wiki/User:")) {
                        // This is easy because w should just be ablt to spit at last :
                        // We run a regex (rev8 ipv6 fix)
                        /*
                            Find "User_talk"
                            OR "User"
                            Then ":"
                            Or "/"
                            Anything but "/"
                            OR line break
                        */
                        let matches = (hrefOfSelection + "\n").match(/(?:(?:(?:User_talk))|(?:(?:User)(?:\:))|(?:(?:\/)(?:[^\/]*)(?:(?:\n)|(?:\r\n))))/g);
                        // result /User_talk:user, so we removed everything up to the first colon
                        let unURL = matches[0];
                        targetUsername = unURL.replace(unURL.match(/(?:[^\:]*)(?:\:)/g)[0], ""); // Regex first group of colon and remove
                    } else {
                        // Contribs link, go split at last slash
                        targetUsername = (a=>{return a[a.length - 1]})(hrefOfSelection.split("/"));
                    }
                    
                    // Do the action for each action now.
                    ({
                        "usrPg" : un=>redirect(rw.wikiBase+"/wiki/User:"+ un, true),  // Open user page in new tab

                        "tlkPg" : un=>redirect(rw.wikiBase+"/wiki/User_talk:"+ un, true),  // Open talk page in new tab

                        "contribs" : un=>redirect(rw.wikiBase+"/wiki/Special:Contributions/"+ un, true),  // Redirect to contribs page in new tab

                        "accInfo" : un=>redirect(rw.wikiBase+"/wiki/Special:CentralAuth?target="+ un, true),  // Redirect to Special:CentralAuth page in new tab

                        "sendMsg" : un=>rw.ui.newMsg(un), // show new msg dialog

                        "quickWel" : un=>rw.quickTemplate.openSelectPack(un), // Submit Quick Template

                        "newNotice" : un=>rw.ui.beginWarn(false, un), // show new warning dialog

                        "adminReport" : un=>rw.ui.adminReportSelector(un),

                        "usrPronouns": un=>{ // Show a tost with this users prefered pronouns
                            rw.info.getUserPronouns(un, p=>{
                                rw.visuals.toast.show(un + "'s pronouns are "+ p, false, false, 3000);
                            });
                        },

                        "usrEditCount": un=>{ // Show a tost with this users prefered pronouns
                            rw.info.getUserEditCount(un, count=>{
                                if (count == null) count = "an unknown number of"; // stop undefined message 
                                rw.visuals.toast.show(un + " has made "+ count + " edits.", false, false, 3000);
                            });
                        },

                        "usrStanding": un=>{
                            // Show toast with last warning level
                            rw.info.lastWarningLevel(un, level=>{
                                rw.visuals.toast.show(un + " has recieved "+ [
                                    "no warnings",
                                    "a level 1 notice",
                                    "a level 2 caution",
                                    "a level 3 warning",
                                    "a level 4 final or ONLY warning"
                                ][level] + " this month.", false, false, 4000);
                            });
                        },

                        "filterLog": un=>redirect("https://en.wikipedia.org/w/index.php?title=Special:AbuseLog&wpSearchUser="+ un, true),  // Redirect to filter log page in new tab

                        "blockLog": un=>redirect("https://en.wikipedia.org/w/index.php?title=Special:Log/block&page=User:"+ un, true),  // Redirect to block log page in new tab

                        "allLog": un=>redirect("https://en.wikipedia.org/wiki/Special:Log/"+ un, true)  // Redirect to filter log page in new tab

                    })[act](targetUsername.trim());
                    
                },
                items: { // TODO: add extra options like logs ext. ext.
                    "usrPg": {name: "User Page"},
                    "tlkPg": {name: "Talk Page"},
                    "aAsubmenu": {
                        "name": "Quick Actions", 
                        "items": {
                            "sendMsg": {name: "New Message"},
                            "newNotice": {name: "Warn User"},
                            "quickWel": {name: "Quick Template"},
                            "adminReport": {name: "Report to Admin"}
                        }
                    },
                    "aIsubmenu": {
                        "name": "Account info", 
                        "items": {
                            "contribs": {name: "Contributions"},
                            "accInfo": {name: "Central Auth"},
                            "usrPronouns": {"name": "Pronouns"},
                            "usrEditCount": {"name": "Edit Count"},
                            "usrStanding": {"name": "Highest Warning"},
                            "filterLog" : {name: "Edit Filter Log"},
                            "blockLog" : {name: "Block Log"},
                            "allLog" : {name: "All Logs"}
                        }
                    }  
                }
            });
        }); // END USER ACTIONS CONTEXT MENU

        // TODO: add more, like Quick Template options ext.. and right-click on article link to begin rollback ext.


    }, // end context menus

    
    /**
     * Requests the speedy deletion of a page. Not currently used and will not currently work without adding speedyDeleteReasons.js into build.php
     *
     * @param {string} pg Page name
     * @method requestSpeedyDelete
     * @extends rw.ui
     */
    "requestSpeedyDelete" : (pg)=>{
        // Open Speedy Deletion dialog for first selection, i.e I'm requesting the speedy deletion of..
        // Programming this is proving to be very boring.
        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,15000));

        addMessageHandler("csdR`*", rs=>{
            // Reason recieved.
            let reason = eval(rs.split("`")[1]);
            let reasonTitle = reason.title;
            let additionalInfoReq = reason.input != ""; // if special info needed
            let additionalInfo = "";
            if (additionalInfoReq) {
                if (rs.split("`")[2] == "undefined") {
                    // No reason specified
                    additionalInfo = "Not specified.";
                } else {
                    additionalInfo = rs.split("`")[2]; // set to the additional info
                }
            }
            console.log(`Deleting under: `+ reasonTitle +`
            `+ reason.input + additionalInfo + ` (redwarn)
            `);
        }); 

        let finalStr = ``;
        for (const key in speedyDeleteReasons) {
            speedyDeleteReasons[key].forEach((e,i)=>{
                let style = "";
                if ((key + e.title).length > 62) {
                    // Too long to fit
                    style="font-size:10px;";
                }
                finalStr += `<li class="mdl-menu__item" data-val='speedyDeleteReasons["`+ key + `"][`+ i +`]' onmousedown="refreshLevels('speedyDeleteReasons[\\\'`+ key + `\\\'][`+ i +`]');" style="`+ style +`">`+ key + e.title +`</li>`;;
            });
        }
        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(`[[[[include speedyDeletionp1.html]]]]`, 500, 450)).showModal(); // 500x300 dialog, see speedyDeletionp1.html for code
    },

    /**
     * Opens RedWarn preferences
     *
     * @method openPreferences
     * @extends rw.ui
     */
    "openPreferences" : () => { // Open Preferences page
        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,15000));

        addMessageHandler("config`*", rs=>{ // On config change
            // New config recieved
            let config = JSON.parse(atob(rs.split("`")[1])); // b64 encoded json string
            //Write to our config
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    const element = config[key];
                    rw.config[key] = element; // add or change value
                }
            }

            // Push change
            rw.info.writeConfig();
        }); 

        addMessageHandler("resetConfig", rs=>{
            // Reset config recieved, set config back to default
            rw.info.getConfig(()=>{}, true); // TRUE HERE MEANS RESET TO DEAULT
        });

        // Add install quick template handler
        addMessageHandler("installQTP", ()=>{
            // Show warning and confirm
            rw.ui.confirmDialog(`
            <b>WARNING:</b> Only install packs from users you trust. Installing a quick template pack gives the installer full access to your account to write to RedWarn's config files.
            <br/><br/>
            To install, click "install from pack code" and paste the code into the browser dialog that appears.
            `, "Install from pack code", ()=>{
                // Time to install
                importScript(rw.quickTemplate.packCodeToPageName(prompt("Please enter the pack code, then click OK to install:"))); // using mediawiki importscript which does it from pagename
            },
            "CANCEL", ()=>dialogEngine.closeDialog(), 98);
        });

        // Add new QTPack handler
        addMessageHandler("newQTP", ()=>rw.quickTemplate.newPack());

        // Add load new theme handler
        addMessageHandler("newThemeDialog", ()=>rw.ui.loadDialog.show("Changing theme..."));
        addMessageHandler("loadDialogClose", ()=>rw.ui.loadDialog.close());

        // Lock scrolling
        dialogEngine.freezeScrolling();

        // Open preferences page with no padding, full screen
        dialogEngine.create(mdlContainers.generateContainer(`[[[[include preferences.html]]]]`, window.innerWidth, window.innerHeight, true), true).showModal(); // TRUE HERE MEANS NO PADDING.
    },

    /**
     * Opens the AIV report dialog
     *
     * @param {string} un Username to report
     * @param {boolean} doNotShowDialog If set to true, will be set to just generate slim HTMl and handlers
     * @method openAdminReport
     * @extends rw.ui
     */
    "openAdminReport" : (un, doNotShowDialog)=> { // Open admin report dialog
        // Setup AIV page for development or production
        const aivPage = (rw.debugMenu == null ? "Wikipedia:Administrator_intervention_against_vandalism" : "User:Ed6767/sandbox"); 

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,2500));

        // On report
        addMessageHandler("AIVreport`*", m=>{
            let reportContent = m.split('`')[1]; // report content
            let target = m.split('`')[2]; // target username
            let targetIsIP = rw.info.isUserAnon(target); // is the target an IP? (2 different types of reports)
            console.log("reporting "+ target + ": "+ reportContent);
            console.log("is ip? "+ (targetIsIP ? "yes" : "no"));
            rw.visuals.toast.show("Reporting "+ target +"...", false, false, 2000); // show toast
            // Submit the report.   
            $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+aivPage+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
                // Grab text from latest revision of AIV page
                // Check if exists
                let revisionWikitext =  latestR.query.pages[0].revisions[0].slots.main.content; // Set wikitext
                if (revisionWikitext.toLowerCase().includes(target.toLowerCase())) {// If report is already there
                    rw.visuals.toast.show("This user has already been reported.", false, false, 5000); // show already reported toast
                    return; // Exit
                }

                // Let's continue
                // We don't need to do anything special. Just shove our report at the bottom of the page, although, may be advisiable to change this if ARV format changes
                let textToAdd = "*" + (targetIsIP ? "{{IPvandal|" : "{{vandal|") + target + "}} " + reportContent; // DANGER! WIKITEXT (here is fine. be careful w changes.) - if target IP give correct template, else normal
                let finalTxt = revisionWikitext + "\n\n" + textToAdd; // compile final string
                // Now we just submit
                $.post(rw.wikiAPI, {
                    "action": "edit",
                    "format": "json",
                    "token" : mw.user.tokens.get("csrfToken"),
                    "title" : aivPage,
                    "summary" : `Reporting [[Special:Contributions/${target}|${target}]] [[w:en:WP:RW|(RW ${rw.version})]]`, // summary sign here
                    "text": finalTxt,
                    "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                }).done(dt => {
                    // We done. Check for errors, then callback appropriately
                    if (!dt.edit) {
                        // Error occured or other issue
                        console.error(dt);
                        dialogEngine.dialog.showModal(); // reshow dialog
                        rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. Try reporting again."); // That's it
                    } else {
                        // Success! No need to do anything else.
                        rw.visuals.toast.show("User reported.", false, false, 5000); // we done
                    }
                });
            });
        }); // END ON REPORT EVENT

        // Check matching user
        if (rw.info.targetUsername(un) == rw.info.getUsername()) {
            // Usernames are the same, give toast.
            if (doNotShowDialog !== true) rw.visuals.toast.show("You can not report yourself, nor can you test this feature except in a genuine case.", false, false, 7500);
            return `Sorry, you cannot report yourself, nor can you test this feature except in a genuine case.`; // DO NOT continue.
        }

        const dialogContent = `[[[[include adminReport.html]]]]`;

        // Push a message if report has already been made
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+aivPage+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of AIV page
            // Check if exists
            let revisionWikitext =  latestR.query.pages[0].revisions[0].slots.main.content; // Set wikitext
            if (revisionWikitext.toLowerCase().includes(rw.info.targetUsername(un).replace(/_/g, ' ').toLowerCase())) {// If report is already there
                setTimeout(()=>dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage("AIVReportExist"), 500); // let dialog know after 500ms to allow dialog to open
            }
        });


        if (doNotShowDialog !== true) {
            // See adminReport.html for code
            dialogEngine.create(mdlContainers.generateContainer(dialogContent, 500, 410)).showModal();
        } else {
            // Return the code for use elsewhere
            return dialogContent;
        }
    },

    /**
     * Opens a confirmation dialog with one or two buttons
     *
     * @param {string} content Dialog content
     * @param {string} pBtnTxt Primary button text
     * @param {function} pBtnClick Callback when primary button clicked
     * @param {string} sBtnTxt Secondary button text (Will not show if empty)
     * @param {function} sBtnClick Secondary button callback
     * @param {number} extraHeight Extra height to add to the dialog in pixels
     * @param {boolean} noExtraLines Removes line breaks from the dialog
     * @method confirmDialog
     * @extends rw.ui
     */
    "confirmDialog": (content, pBtnTxt, pBtnClick, sBtnTxt, sBtnClick, extraHeight, noExtraLines) => { // noExtraLines removes the <br/> tags
        // Confirm dialog (yes, no, ext...)
        addMessageHandler("sBtn", sBtnClick);
        addMessageHandler("pBtn", pBtnClick);
        dialogEngine.create(mdlContainers.generateContainer(`[[[[include confirmDialog.html]]]]`, 500, 80 + extraHeight)).showModal();
    },

    /**
     * Shows the feedback dialog to leave bug reports and feedback
     *
     * @param {string} extraInfo
     * @method reportBug
     * @extends rw.ui
     */
    "reportBug" : extraInfo=> {
        // Open feedback dialog, basically same as newmsg
        // Setup preview handling
        addMessageHandler("generatePreview`*", m=>{
            rw.info.parseWikitext(m.split("`")[1], parsed=>{ // Split to Wikitext and send over to the API to be handled
                dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                    "action": "parseWikiTxt",
                    "result": parsed}, '*'); // push to container for handling in dialog and add https:// to stop image breaking
            });
        });

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,15000));

        // Add submit handler

        addMessageHandler("applyNotice`*", eD=> {
            // i.e applyNotice`user`wikitext`summary
            // TODO: maybe b64 encode?
            let _eD = eD.split("`"); // params
            let user = _eD[1];
            let wikiTxt = _eD[2];
            let summary = _eD[3];
            // MAKE EDIT
            rw.info.addWikiTextToUserPage(user, wikiTxt, true, summary); // Save under date
        });

        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(`[[[[include sendFeedback.html]]]]`, 500, 390)).showModal(); // 500x390 dialog, see sendFeedback.html for code
    },

    /**
     * Opens the administrator report venue selector for the specified username
     *
     * @param {string} un Username to report
     * @method adminReportSelector
     * @extends rw.ui
     */
    "adminReportSelector" : un=> { // DON'T FORGET TO USE un ATTR!
        un = rw.info.targetUsername(un); // get target
        // Handle events
        addMessageHandler("openAIV", ()=>rw.ui.openAdminReport(un)); // AIV report
        addMessageHandler("openUAA", ()=>rw.ui.beginUAAReport(un)); // UAA report

        // Open the admin report selector dialog
        dialogEngine.create(mdlContainers.generateContainer(`[[[[include adminReportSelector.html]]]]`, 250, 280)).showModal();
    },

    /**
     * Opens the UAA report dialog for a specified user
     *
     * @param {string} un Username to report
     * @param {boolean} htmlOnly For expanding elements, adds handlers but returns HTML
     * @method beginUAAReport
     * @extends rw.ui
     */
    "beginUAAReport" : (un, htmlOnly)=> { // Report to UAA

        // Check if IP - if so, exit
        if (rw.info.isUserAnon(un)) {
            if (htmlOnly) return "As IPs don't have usernames, you can't report them to UAA.";
            rw.ui.confirmDialog("As IPs don't have usernames, you can't report them to UAA.", "OKAY", ()=>dialogEngine.closeDialog() , "", ()=>{}, 0);
            return; // stop
        }

        const uaaPage = (rw.debugMenu == null ? "Wikipedia:Usernames_for_administrator_attention" : "User:Ed6767/sandbox"); // set UAA based on debug mode

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,2500));

        // On report
        addMessageHandler("UAA`*", m=>{
            let reportContent = m.split('`')[1]; // report content
            let target = m.split('`')[2]; // target username
            console.log("reporting "+ target + ": "+ reportContent);
            rw.visuals.toast.show("Reporting "+ target +"...", false, false, 2000); // show toast
            // Submit the report. MUST REPLACE WITH REAL AIV WHEN DONE AND WITH SANDBOX IN DEV!   

            $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+uaaPage+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
                // Grab text from latest revision of AIV page
                // Check if exists
                let revisionWikitext =  latestR.query.pages[0].revisions[0].slots.main.content; // Set wikitext
                if (revisionWikitext.toLowerCase().includes(target.toLowerCase())) {// If report is already there
                    rw.visuals.toast.show("This user has already been reported.", false, false, 5000); // show already reported toast
                    return; // Exit
                }

                // Let's continue
                // We don't need to do anything special. Just shove our report at the bottom of the page, although, may be advisiable to change this if ARV format changes
                let textToAdd = "*" + "{{user-uaa|1=" + target + "}} &ndash; " + reportContent; // DANGER! WIKITEXT (here is fine. be careful w changes.) - if target IP give correct template, else normal
                let finalTxt = revisionWikitext + "\n\n" + textToAdd; // compile final string
                // Now we just submit
                $.post(rw.wikiAPI, {
                    "action": "edit",
                    "format": "json",
                    "token" : mw.user.tokens.get("csrfToken"),
                    "title" : uaaPage,
                    "summary" : `Reporting [[Special:Contributions/${target}|${target}]] [[w:en:WP:RW|(RW ${rw.version})]]`, // summary sign here
                    "text": finalTxt,
                    "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                }).done(dt => {
                    // We done. Check for errors, then callback appropriately
                    if (!dt.edit) {
                        // Error occured or other issue
                        console.error(dt);
                        dialogEngine.dialog.showModal(); // reshow dialog
                        rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. Try reporting again."); // That's it
                    } else {
                        // Success! No need to do anything else.
                        rw.visuals.toast.show("User reported.", false, false, 5000); // we done
                    }
                });
            });
        }); // END ON REPORT EVENT

        // Check matching user
        if (rw.info.targetUsername(un) == rw.info.getUsername()) {
            // If HTML only
            if (htmlOnly) return `You can not report yourself, nor can you test this feature except in a genuine case.`;

            // Usernames are the same, give toast.
            rw.visuals.toast.show("You can not report yourself, nor can you test this feature except in a genuine case.", false, false, 7500);
            return; // DO NOT continue.
        }
        
        const dialogContent = `[[[[include uaaReport.html]]]]`;

        // Push a message if report has already been made
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+uaaPage+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of AIV page
            // Check if exists
            let revisionWikitext =  latestR.query.pages[0].revisions[0].slots.main.content; // Set wikitext
            if (revisionWikitext.toLowerCase().includes(rw.info.targetUsername(un).replace(/_/g, ' ').toLowerCase())) {// If report is already there
                setTimeout(()=>dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage("UAAReportExist"), 500); // let dialog know after 500ms to allow dialog to open
            }
        });


        if (htmlOnly) return dialogContent; // return dialog if HTMl only

        // See uaaReport.html for code
        dialogEngine.create(mdlContainers.generateContainer(dialogContent, 500, 410)).showModal();
    },

    /**
     * Opens extended options that can be opened from any page (preferences, oversight and TAS reporting)
     * @param {string} un Username for reports. Can also be revision ID (todo)
     * @method openExtendedOptionsDialog
     * @extends rw.ui
     */
    "openExtendedOptionsDialog" : un=>{
        rw.ui.loadDialog.show("Please wait...");
        // Get email info before loading and showing dialog (for OS and TAS reporting)
        $.getJSON(rw.wikiAPI+"?action=query&meta=userinfo&uiprop=email&format=json", r=>{

            // HTML for tabs

            // USER THINGS ONLY - try and catch as will error out on non-user pages
            let adminReportContent = `[[[[include genericError.html]]]]`; // placeholder
            try {
                adminReportContent = rw.ui.openAdminReport(null, true); // this sets up our handlers and generates the appropraite HTML
            } catch (e) {adminReportContent+=`<hr><pre>${e.stack}</pre>`;}

            // UAA report
            let uaaReportContent = `[[[[include genericError.html]]]]`; // placeholder
            try {
                uaaReportContent = rw.ui.beginUAAReport(rw.info.targetUsername(), true); // this sets up our handlers and generates the appropraite HTML
            } catch (e) {uaaReportContent+=`<hr><pre>${e.stack}</pre>`;}

            // Event handlers
            addMessageHandler("redwarnPref", ()=>dialogEngine.closeDialog(()=>rw.ui.openPreferences())); // open preferences for button press
            addMessageHandler("redwarnTalk", ()=>redirect("https://en.wikipedia.org/wiki/Wikipedia_talk:RedWarn", true));

            // Email to TAS THIS IS LIVE!!
            addMessageHandler("TASEmail`*", e=>dialogEngine.closeDialog(()=>rw.info.sendEmail("Emergency", atob(e.split("`")[1]))));

            // Email to OS - THESE ARE LIVE 
            addMessageHandler("OSEmail`*", e=>dialogEngine.closeDialog(()=>rw.info.sendEmail("Oversight", atob(e.split("`")[1]))));

            const isUserPage = mw.config.get("wgRelevantPageName").includes("User:") || mw.config.get("wgRelevantPageName").includes("User_talk:");
            const isOnRevPage = window.location.href.includes("diff=") || window.location.href.includes("oldid="); // for reporting revisions

            let rollbackOptsHTML = "";
            // Generate rollback options if on rev page 
            if (isOnRevPage) rollbackOptsHTML = rw.rollback.getDisabledHTMLandHandlers(); // generates our HTML and all assosicated handlers for us


            // Email information for TAS and OS reports
            const emailInfo = r.query.userinfo;

            // Close loading dialog#
            rw.ui.loadDialog.close();

            // Make dialog
            dialogEngine.create(mdlContainers.generateContainer(`[[[[include extendedOptions.html]]]]`, 500, 500)).showModal(); // todo: also shrink more when not on user page or revision page
        });

    },

    // CLASSES from here 

    /**
     * A static loading dialog while processes occur. Seperate from dialogEngine.
     * @class rw.ui.loadDialog
     */
    "loadDialog" : {
        // Loading dialog
        "hasInit" : false, 
        "init" : text=> {
            if (!rw.ui.loadDialog.hasInit) { // Only continue if we haven't already appended our container div
                $("body").append(`
                <div id="rwUILoad">
                </div>
                `);
            }
            $("#rwUILoad").html(`
            <dialog class="mdl-dialog" id="rwUILoadDialog" style="border-radius: 7px;">
                ` + mdlContainers.generateContainer(`[[[[include loadingSpinner.html]]]]`, 300, 30) +`
            </dialog>
            `); // Create dialog with content from loadingSpinner.html

            rw.ui.loadDialog.dialog = document.querySelector('#rwUILoadDialog'); // set dialog var

            // Firefox issue fix
            if (! rw.ui.loadDialog.dialog.showModal) {
                dialogPolyfill.registerDialog(rw.ui.loadDialog.dialog);
            }

            rw.ui.loadDialog.hasInit = true;
        },


        /**
         * Opens a loading dialog with the given text
         *
         * @param {string} text
         * @method show
         * @extends rw.ui.loadDialog
         */
        "show" : text=> { // Init and create a new loading dialog
            rw.ui.loadDialog.init(text); // init
            rw.ui.loadDialog.setText(text); // set our text
            // Show dialog
            rw.ui.loadDialog.dialog.showModal();
            // We done
        },

        /**
         * Changes the text of the current loading dialog
         *
         * @param {string} text
         * @method setText
         * @extends rw.ui.loadDialog
         */
        "setText" : text=> $("#rwUILoadDialog > iframe")[0].contentWindow.postMessage(text, '*'), // Set text of loading by just sending the message to the container

        /**
         * Closes the current loading dialog
         *
         * @method close
         * @extends rw.ui.loadDialog
         */
        "close": ()=>{ // Close the dialog and animate
            $("#rwUILoadDialog")
            .addClass("closeAnimate")
            .on("webkitAnimationEnd", ()=>{
                // Animation finished
                rw.ui.loadDialog.dialog.close();
            });
        } 
    },

    /**
     * A dialog used to select a page from a users 20 recently visited pages
     * 
     * @class rw.ui.recentlyVisitedSelector
     */
    "recentlyVisitedSelector" : { // Used to select recently visited page from a dropdown dialog
        "dialog" : null,
        "init" : content=>{
            if ($("#rwRecentVistedSelectContainer").length < 1) {
                // container hasn't already been init
                $("body").append(`
                <div id="rwRecentVistedSelectContainer">
                </div>
                `);
            }
            // let's continue
            $("#rwRecentVistedSelectContainer").html(`
            <dialog class="mdl-dialog" id="rwUIRVisDialog">
                ` + content +`
            </dialog>
            `);

            rw.ui.recentlyVisitedSelector.dialog = document.querySelector('#rwUIRVisDialog'); // set dialog var

            // Firefox issue fix
            if (! rw.ui.recentlyVisitedSelector.dialog.showModal) {
                dialogPolyfill.registerDialog(rw.ui.recentlyVisitedSelector.dialog);
            }
        },

        /**
         * Shows the selection dialog and calls back when user has made their selection
         *
         * @param {function} callback callback(selectedPageTitle)
         * @method showDialog
         * @extends rw.ui.recentlyVisitedSelector
         */
        "showDialog" : callback=>{ // Show dialog and callback(selected article)
            // Assemble revent visits listbox
            let recentlyVisited = JSON.parse(window.localStorage.rwRecentlyVisited);

             // Check if empty, if so, show dialog and exit
             if ((recentlyVisited == null) || (recentlyVisited.length < 1)) {
                rw.ui.confirmDialog("There are no recent pages to show.", "OKAY", ()=>dialogEngine.closeDialog(), "", ()=>{}, 0);
                return; //exit, don't callback as not complete
            }

            // Let's continue
            let finalRVList = "";
            recentlyVisited.forEach((page, i) => {
                finalRVList += `
                <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="spI${i}">
                    <input type="radio" id="spI${i}" class="mdl-radio__button" name="selectedPageIndex" value="${i}">
                    <span class="mdl-radio__label">${page.replace(/_/g, ' ')}</span>
                </label>
                <hr />
                `;
            });
            
            // Add close handler
            addMessageHandler("closeRecentPageDialog", ()=>rw.ui.recentlyVisitedSelector.close());

            // Add continue handler
            addMessageHandler("RecentPageDialogSel`*", m=>{
                let selectedI = m.split("`")[1];
                callback(recentlyVisited[selectedI]); // send callback
            });
            
            // Now show dialog
            rw.ui.recentlyVisitedSelector.init(mdlContainers.generateContainer(`[[[[include recentPageSelect.html]]]]`, 420, 500)); // 420 hahahaha
            rw.ui.recentlyVisitedSelector.dialog.showModal();
        },

        /**
         * Closes the currently open dialog
         *
         * @method close
         * @extends rw.ui.recentlyVisitedSelector
         */
        "close" : () => {
            // Close dialog
            $(rw.ui.recentlyVisitedSelector.dialog)
            .addClass("closeAnimate")
            .on("webkitAnimationEnd", ()=>{
                // Animation finished
                rw.ui.recentlyVisitedSelector.dialog.close();
            });
        }
    }
}