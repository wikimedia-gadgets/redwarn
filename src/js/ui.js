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
        `, document.body.offsetWidth-70, document.body.offsetHeight-50)).showModal();
    },

    "beginWarn" : (ignoreWarnings, un, pg, customCallback, callback, hideUserInfo, autoSelectReasonIndex)=> { // if customCallback = false, callback(templatestr) (rev12) autoSelectReasonIndex(rev13) for quick rollbacks for vandalism ext..
        // Give user a warning (show dialog)
        
        let autoLevelSelectEnable = (!hideUserInfo) && (rw.config.rwautoLevelSelectDisable != "disable"); // If autolevelselect enabled (always disabled on hideUserInfo options)

        if ((rw.info.targetUsername(un) == rw.info.getUsername()) && !ignoreWarnings) {
            // Usernames are the same, show dialog
            rw.ui.confirmDialog("Whoops! You cannot warn yourself here. If you'd like to test, use a sandbox.", "OKAY", ()=>dialogEngine.closeDialog(), "", ()=>{}, 0);
            return; // DO NOT continue.
        }

        // Let's continue

        // Assemble rule listbox
        let finalListBox = "<span>";
        let currentHeading = "";
        rules.forEach((rule, i) => {
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
        addMessageHandler("adminR", ()=>rw.ui.openAdminReport(un));

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
            let summary = _eD[3];
            if ((customCallback == null) || (customCallback == false)) { // if not set
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

                // Final/Only Warning (dark red) TODO: Click opens admin report pannel.
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
            dialogEngine.create(mdlContainers.generateContainer(`
            [[[[include warnUserDialog.html]]]]
            `, 500, 630)).showModal(); // 500x630 dialog, see warnUserDialog.html for code
        });
            
    }, // end beginWarn

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
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include newMsg.html]]]]
        `, 500, 390)).showModal(); // 500x390 dialog, see newMsg.html for code
    },

    "registerContextMenu" : () => { // Register context menus for right-click actions
        // More docs at https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html

        // USER TALK ACTIONS - check if not disabled then continue
        if (rw.config.rwDisableRightClickUser != "disable") $(()=>{
            $.contextMenu({
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
                        "usrPg" : un=>redirect(WIKICWD+"/wiki/User:"+ un, true),  // Open user page in new tab

                        "tlkPg" : un=>redirect(WIKICWD+"/wiki/User_talk:"+ un, true),  // Open talk page in new tab

                        "contribs" : un=>redirect(WIKICWD+"/wiki/Special:Contributions/"+ un, true),  // Redirect to contribs page in new tab

                        "accInfo" : un=>redirect(WIKICWD+"/wiki/Special:CentralAuth?target="+ un, true),  // Redirect to Special:CentralAuth page in new tab

                        "sendMsg" : un=>rw.ui.newMsg(un), // show new msg dialog

                        "quickWel" : un=>rw.quickTemplate.openSelectPack(un), // Submit Quick Template

                        "newNotice" : un=>rw.ui.beginWarn(false, un), // show new warning dialog

                        "adminReport" : un=>rw.ui.openAdminReport(un),

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
                            "sendMsg": {name: "New Talk Page Message"},
                            "newNotice": {name: "New Notice"},
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
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include speedyDeletionp1.html]]]]
        `, 500, 450)).showModal(); // 500x300 dialog, see speedyDeletionp1.html for code
    },

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


        // Open preferences page with no padding, full screen
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include preferences.html]]]]
        `, document.body.offsetWidth, document.body.offsetHeight), true).showModal(); // TRUE HERE MEANS NO PADDING.
    },

    "openAdminReport" : (un)=> { // Open admin report dialog
        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,2500));

        // On report
        addMessageHandler("report`*", m=>{
            let reportContent = m.split('`')[1]; // report content
            let target = m.split('`')[2]; // target username
            let targetIsIP = rw.info.isUserAnon(target); // is the target an IP? (2 different types of reports)
            console.log("reporting "+ target + ": "+ reportContent);
            console.log("is ip? "+ (targetIsIP ? "yes" : "no"));
            rw.visuals.toast.show("Reporting "+ target +"...", false, false, 2000); // show toast
            // Submit the report. MUST REPLACE WITH REAL AIV WHEN DONE AND WITH SANDBOX IN DEV!    
            //let aivPage = "User:Ed6767/sandbox"; // dev
            let aivPage = "Wikipedia:Administrator_intervention_against_vandalism"; // PRODUCTION! 

            $.getJSON(WIKICWD+"/w/api.php?action=query&prop=revisions&titles="+aivPage+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
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
                $.post(WIKICWD+"/w/api.php", {
                    "action": "edit",
                    "format": "json",
                    "token" : mw.user.tokens.get("csrfToken"),
                    "title" : aivPage,
                    "summary" : `Reporting [[Special:Contributions/${target}|${target}]] [[WP:REDWARN|(RedWarn ${rw.version})]]`, // summary sign here
                    "text": finalTxt
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
            rw.visuals.toast.show("You can not report yourself, nor can you test this feature except in a genuine case.", false, false, 7500);
            return; // DO NOT continue.
        }


        // See adminReport.html for code
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include adminReport.html]]]]
        `, 500, 410)).showModal();
    },

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
            <dialog class="mdl-dialog" id="rwUILoadDialog">
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

        "show" : text=> { // Init and create a new loading dialog
            rw.ui.loadDialog.init(text); // init
            rw.ui.loadDialog.setText(text); // set our text
            // Show dialog
            rw.ui.loadDialog.dialog.showModal();
            // We done
        },

        "setText" : text=> $("#rwUILoadDialog > iframe")[0].contentWindow.postMessage(text, '*'), // Set text of loading by just sending the message to the container

        "close": ()=>{ // Close the dialog and animate
            $("#rwUILoadDialog")
            .addClass("closeAnimate")
            .on("webkitAnimationEnd", ()=>{
                // Animation finished
                rw.ui.loadDialog.dialog.close();
            });
        } 
    },

    "confirmDialog": (content, pBtnTxt, pBtnClick, sBtnTxt, sBtnClick, extraHeight, noExtraLines) => { // noExtraLines removes the <br/> tags
        // Confirm dialog (yes, no, ext...)
        addMessageHandler("sBtn", sBtnClick);
        addMessageHandler("pBtn", pBtnClick);
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include confirmDialog.html]]]]
        `, 500, 80 + extraHeight)).showModal();
    },

    "sendFeedback" : extraInfo=> {
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
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include sendFeedback.html]]]]
        `, 500, 390)).showModal(); // 500x390 dialog, see sendFeedback.html for code
    },

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
            <dialog class="mdl-dialog" id="rwUILoadDialog">
                ` + content +`
            </dialog>
            `); // Create dialog with content from loadingSpinner.html

            rw.ui.recentlyVisitedSelector.dialog = document.querySelector('#rwUILoadDialog'); // set dialog var

            // Firefox issue fix
            if (! rw.ui.recentlyVisitedSelector.dialog.showModal) {
                dialogPolyfill.registerDialog(rw.ui.recentlyVisitedSelector.dialog);
            }
        },

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
            rw.ui.recentlyVisitedSelector.init(mdlContainers.generateContainer(`
            [[[[include recentPageSelect.html]]]]
            `, 420, 500)); // 420 hahahaha
            rw.ui.recentlyVisitedSelector.dialog.showModal();
        },

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