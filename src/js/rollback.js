rw.rollback = { // Rollback features - this is where the business happens, people!
    "clickHandlers" : {}, // set in code
    
    "icons" : [ // rev14, icon IDs and everything for current rollback - from left to right - usually loaded from config
        // WARNING: CHANGING ORDER WILL MESS UP CONFIGS.
        // DEFAULT ENABLED ICONS
        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback vandalism",
            "color" : "red", // css colour
            "icon" : "delete_forever",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info? false = quick rollback, otherwise not
            "summary" : "[[WP:VANDAL|Vandalism]]", // Set summary
            "ruleIndex" : 0 // used for autowarn
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback unexplained content removal",
            "color" : "orange", // css colour
            "icon" : "format_indent_increase",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:CRV|Unexplained content removal]]", // Set summary
            "ruleIndex" : 3 // used for autowarn
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback non-constructive edit",
            "color" : "gold", // css colour
            "icon" : "work_outline",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "non-constructive" // Set summary
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Rollback",
            "color" : "blue", // css colour
            "icon" : "replay",
            "actionType" : "rollback",
            "promptReason" : true, // add extra info?
            "summary" : "" // Set summary
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Assume Good Faith and Rollback",
            "color" : "green", // css colour
            "icon" : "thumb_up",
            "actionType" : "rollback",
            "promptReason" : true, // add extra info?
            "summary" : "Reverting [[WP:AGF|good faith]] edits" // Set summary
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Preview Rollback",
            "color" : "black", // css colour
            "icon" : "compare_arrows",
            "actionType" : "func",
            "action" : ()=>rw.rollback.preview() // Callback
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick Template",
            "color" : "black", // css colour
            "icon" : "library_add",
            "actionType" : "func",
            "action" : ()=>rw.rollback.welcomeRevUsr() // Callback
        },

        {
            "enabled": true, // true is a default rollback icon, false can be added via preferences
            "name" : "More Options",
            "color" : "black", // css colour
            "icon" : "more_vert",
            "actionType" : "func",
            "action" : ()=>rw.rollback.selectFromDisabled() // Callback
        },

        // END DEFAULT ENABLED ICONS
        // DEFAULT DISABLED ICONS

        // RED
        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback 3RR",
            "color" : "red", // css colour
            "icon" : "filter_3",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:3RR]]", // Set summary
            "ruleIndex" : 84 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback personal attacks towards another editor",
            "color" : "red", // css colour
            "icon" : "offline_bolt",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Personal attack towards another editor ([[WP:NPA]])", // Set summary
            "ruleIndex" : 22 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback copyright violation",
            "color" : "red", // css colour
            "icon" : "copyright",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Likely [[WP:COPYVIO|copyright violation]]", // Set summary
            "ruleIndex" : 79 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback BLP violation",
            "color" : "red", // css colour
            "icon" : "face",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Fails [[WP:BLP]]", // Set summary
            "ruleIndex" : 5 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback advertising/promotional",
            "color" : "red", // css colour
            "icon" : "monetization_on",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Using Wikipedia for [[WP:NOTADVERTISING|advertising and/or promotion]] is not permitted.", // Set summary
            "ruleIndex" : 16 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback unnecessary or inappropriate external links",
            "color" : "red", // css colour
            "icon" : "link_off",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Addition of unnecessary/inappropriate [[WP:EL|external links]]", // Set summary
            "ruleIndex" : 19 // used for autowarn
        },

        // ORANGE
        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback no reliable source",
            "color" : "orange", // css colour
            "icon" : "history_edu",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:RS|Not providing a reliable source]]", // Set summary
            "ruleIndex" : 15 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback disruptive editing",
            "color" : "orange", // css colour
            "icon" : "error",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Disruptive editing", // Set summary
            "ruleIndex" : 1 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback factual errors",
            "color" : "orange", // css colour
            "icon" : "menu_book",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "likely [[WP:PROVEIT|factual errors]]", // Set summary
            "ruleIndex" : 7 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback joke edit",
            "color" : "orange", // css colour
            "icon" : "child_care",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Joke edit", // Set summary
            "ruleIndex" : 10 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback NPOV issues",
            "color" : "orange", // css colour
            "icon" : "campaign",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "per [[WP:NPOV]]", // Set summary
            "ruleIndex" : 17 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback talk in article",
            "color" : "orange", // css colour
            "icon" : "announcement",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "Please use the article [[WP:TPHELP|talk page]] or [[WP:FIXIT|be bold]] and fix the problem", // Set summary
            "ruleIndex" : 66 // used for autowarn
        },

        // BLUE
        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback manual of style issues",
            "color" : "blue", // css colour
            "icon" : "brush",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:MOS|Manual of Style]] issues", // Set summary
            "ruleIndex" : 31 // used for autowarn
        },

        {
            "enabled": false, // true is a default rollback icon, false can be added via preferences
            "name" : "Quick rollback test edits",
            "color" : "blue", // css colour
            "icon" : "build",
            "actionType" : "rollback",
            "promptReason" : false, // add extra info?
            "summary" : "[[WP:SANDBOX|test edits]]", // Set summary
            "ruleIndex" : 2 // used for autowarn
        }
    ],

    "loadIcons" : () => { // Adds icons to a diff page - see rw.rollback.icons to set defaults here.
        let isLatest = $("#mw-diff-ntitle1").text().includes("Latest revision"); // is this the latest revision diff page?
        let isLeftLatest = $("#mw-diff-otitle1").text().includes("Latest revision"); // is the left side the latest revision? (rev13 bug fix)

        let currentRevIcons = "";

        // Load Rollback current rev icons (rev14)
        rw.rollback.icons.forEach((icon,i) => {
            let elID = "rwRollback_" + i; // generate an ID for the new icons

            // Establish element with all the info
            if (icon.enabled) currentRevIcons += `
            <div id="${elID}" class="icon material-icons">
                <span style="cursor: pointer;
                            font-size:28px;
                            padding-right:5px;
                            color:${icon.color};"
                onclick="rw.rollback.clickHandlers.${elID}();">
                    ${icon.icon}
                </span>
            </div>
            <div class="mdl-tooltip mdl-tooltip--large" for="${elID}">
                ${icon.name} 
            </div>
            `;

            // Add click handler
            let clickHandler = ()=>{};

            if (icon.actionType == "func") {
                // Function callback
                clickHandler = icon.action;
            } else if (icon.actionType == "rollback") {
                // Rollback on click
                if (!icon.promptReason) {
                    // quick rollback
                    clickHandler = ()=>rw.rollback.apply(icon.summary, null, icon.ruleIndex); // if icon.ruleIndex is undef it'll be ignored anyway
                } else {
                    // Ask for a reason
                    clickHandler = ()=>rw.rollback.promptRollbackReason(icon.summary);
                }
            }

            // Now add the handler to the handlers object (because the elements aren't on page yet)
            rw.rollback.clickHandlers[elID] = clickHandler; // we done
        });

        // RESTORE THIS VERSION ICONS. DO NOT FORGET TO CHANGE BOTH FOR LEFT AND RIGHT

        // On left side
        // DO NOT FORGET TO CHANGE BOTH!!
        $('.diff-otitle').prepend(isLeftLatest ? currentRevIcons : `
        <div id="rOld1" class="icon material-icons"><span style="cursor: pointer; font-size:28px; padding-right:5px; color:purple;"
            onclick="rw.rollback.promptRestoreReason($('#mw-diff-otitle1 > strong > a').attr('href').split('&')[1].split('=')[1]);"> <!-- the revID on left -->
                history
            </span>
        </div>
        <div class="mdl-tooltip mdl-tooltip--large" for="rOld1">
            Restore this version
        </div>
        `
        ); 

        // On the right side
        $('.diff-ntitle').prepend(isLatest ? currentRevIcons : `
        <div id="rOld2" class="icon material-icons"><span style="cursor: pointer; font-size:28px; padding-right:5px; color:purple;"
            onclick="rw.rollback.promptRestoreReason($('#mw-diff-ntitle1 > strong > a').attr('href').split('&')[1].split('=')[1]);"> <!-- the revID on right -->
                history
            </span>
        </div>
        <div class="mdl-tooltip mdl-tooltip--large" for="rOld2">
            Restore this version
        </div>
        `); // if the latest rev, show the accurate revs, else, don't 
        
        setTimeout(()=>{
            // Register all tooltips after 50ms (just some processing time)
            for (let item of document.getElementsByClassName("mdl-tooltip")) {
                rw.visuals.register(item); 
            } 
        },100);
    },

    "selectFromDisabled" : ()=>{
        // Open a new dialog with all the disabled icons so user can select one. Click handlers are already registered, so we just call rw.rollback.clickHandlers.[elID]();
        // Load Rollback current rev icons (rev14)
        let finalIconStr = "";
        rw.rollback.icons.forEach((icon,i) => {
            if (icon.enabled) return; // if icon is enabled, we can skip
            let elID = "rwRollback_" + i; // get the ID for the new icons

            // Establish element with all the info
            finalIconStr += `
            <div id="${elID}" class="icon material-icons">
                <span style="cursor: pointer;
                            font-size:28px;
                            padding-right:5px;
                            color:${icon.color};"
                onclick="window.parent.postMessage('rwRollbackBtn${elID}');">
                    ${icon.icon}
                </span>
            </div>
            <div class="mdl-tooltip" for="${elID}">
                ${icon.name} 
            </div>
            `;

            // Add click event handler
            addMessageHandler("rwRollbackBtn"+ elID, ()=>{
                dialogEngine.closeDialog(); // close dialog
                rw.rollback.clickHandlers[elID](); // send our callback
            });
        });
        
        // Now show dialog - we don't need a special one
        rw.ui.confirmDialog(`
        <div style="width:410px;text-align:center;height:66px;overflow:auto;margin:auto;"> <!-- outer container for icons -->
            ${finalIconStr}
        </div>
        `, "CLOSE", ()=>dialogEngine.closeDialog(),
        "", ()=>{}, 25, true); // true here removes extra linebreaks
    },

    "getRollbackrevID" : ()=>{ // Get the revision ID of what we want to rollback
        let isNLatest = $("#mw-diff-ntitle1").text().includes("Latest revision");
        let isOLatest = $("#mw-diff-otitle1").text().includes("Latest revision"); 
        if (isNLatest) {
            // Return the revID of the edit on the right
            return $('#mw-diff-ntitle1 > strong > a').attr('href').split('&')[1].split('=')[1];
        } else if (isOLatest) {
            return $('#mw-diff-otitle1 > strong > a').attr('href').split('&')[1].split('=')[1];
        } else {
            // BUG!
            rw.ui.confirmDialog("A very weird error occured. (rollback getRollbackRevID failed via final else!)",
            "REPORT BUG", ()=>rw.ui.sendFeedback("rollback getRollbackRevID failed via final else! related URL: "+ window.location.href) ,
            "", ()=>{}, 0);
        }
    },

    "preview" : () => { // Redirect to the preview of the rollback in a new tab (compare page)
        rw.ui.loadDialog.show("Loading preview...");
        // Check if latest, else redirect
        rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), rw.rollback.getRollbackrevID(), un=>{
            // Fetch latest revision not by user
            rw.info.latestRevisionNotByUser(mw.config.get("wgRelevantPageName"), un, (content, summary, rID) => {
                // Got it! Now open preview dialog
               
                // Add handler for when page loaded
                let url = WIKICWD+"/w/index.php?title="+ mw.config.get("wgRelevantPageName") +"&diff="+ rID +"&oldid="+ mw.util.getParamValue("diff") +"&diffmode=source#rollbackPreview";
                redirect(url); // goto in current tab
            });
        });
    },

    "apply" : (reason, callback, defaultWarnIndex)=> { // if callback set, no UW prompt will be shown, but a callback instead
        
        // Now do
        // bug fix rev10, get revid from html
        // added rev13 if has rollback perms and set to use in settings, use that - prompt first time
        rw.ui.loadDialog.show("Reverting...");
        rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), rw.rollback.getRollbackrevID(), (un, crID)=>{
            // Set handlers for each method
            let pseudoRollbackCallback = ()=>{ // pseudoRollback 
                // Fetch latest revision not by user
                rw.info.latestRevisionNotByUser(mw.config.get("wgRelevantPageName"), un, (content, summary, rID) => {
                    // Got it! Now set page content to summary
                    // Push UNDO using CSRF token
                    $.post(WIKICWD+"/w/api.php", {
                        "action": "edit",
                        "format": "json",
                        "token" : mw.user.tokens.get("csrfToken"),
                        "title" : mw.config.get("wgRelevantPageName"),
                        "summary" : summary + ": " + reason + " [[WP:REDWARN|(RedWarn "+ rw.version +")]]", // summary sign here
                        "undo": crID, // current
                        "undoafter": rID // restore version
                    }).done(dt => {
                        // We done. Check for errors, then callback appropriately
                        if (!dt.edit) {
                            // Error occured or other issue
                            console.error(dt);
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. Your rollback has not been applied.");
                        } else {
                            // Success!
                            rw.ui.loadDialog.close();
                            // Wait a bit (100ms) to stop loadDialog glitch
                            setTimeout(()=>{
                                // If callback set, call it and exit, else continue
                                if (callback != null) {callback(); return;}

                                // Now show warning dialog but w correct info
                                rw.ui.beginWarn(false, un, mw.config.get("wgRelevantPageName"), null, null, null, (defaultWarnIndex != null ? defaultWarnIndex : null));
                                rw.visuals.toast.show("Rollback complete.", "DON'T WARN AND VIEW", ()=>{
                                    rw.info.isLatestRevision(mw.config.get('wgRelevantPageName'), 0, ()=>{});
                                }, 5000); // clicking undo takes to the closest revision, has to be here to overlay the dialog
                            }, 100); // done!
                        }
                    });
                });
            };
            
            let rollbackCallback = ()=>{ // using rollback API
                // PUSH ROLLBACK
                $.post(WIKICWD+"/w/api.php", {
                        "action": "rollback",
                        "format": "json",
                        "token" : rw.info.rollbackToken,
                        "title" : mw.config.get("wgRelevantPageName"),
                        "summary" : "Rollback edit(s) by [[Special:Contributions/"+ un +"|"+ un +"]] ([[User_talk:"+ un +"|talk]]): " + reason + " [[WP:REDWARN|(RedWarn "+ rw.version +")]]", // summary sign here
                        "user": un // rollback user
                    }).done(dt => {
                        // THESE CALLBACKS ARE NO INTERCHANGABLE!
                        // We done. Check for errors, then callback appropriately
                        if (!dt.rollback) {
                            // Error occured or other issue
                            console.error(dt);
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. Your rollback has not been applied.");
                        } else {
                            // Success!
                            rw.ui.loadDialog.close();
                            // Wait a bit (100ms) to stop loadDialog glitch
                            setTimeout(()=>{
                                // If callback set, call it and exit, else continue
                                if (callback != null) {callback(); return;}

                                // Now show warning dialog but w correct info
                                rw.ui.beginWarn(false, un, mw.config.get("wgRelevantPageName"), null, null, null, (defaultWarnIndex != null ? defaultWarnIndex : null));
                                rw.visuals.toast.show("Rollback complete.", "DON'T WARN AND VIEW", ()=>{
                                    rw.info.isLatestRevision(mw.config.get('wgRelevantPageName'), 0, ()=>{});
                                }, 5000); // clicking undo takes to the closest revision, has to be here to overlay the dialog
                            }, 100); // done!
                        }
                    });
            };

            // Check config for rollback perms
            rw.info.featureRestrictPermissionLevel("rollbacker", ()=>{
                // Check if config is set or not
                if (rw.config.rollbackMethod == null) {
                    rw.ui.confirmDialog(`
                    You have rollback permissions!
                    Would you like to use the faster rollback API in future or continue using a rollback-like setting?
                    You can change this in your preferences at any time.`,
                    "USE ROLLBACK", ()=>{
                        dialogEngine.closeDialog();
                        rw.config.rollbackMethod = "rollback";
                        rw.info.writeConfig(true, ()=>rollbackCallback()); // save config and callback
                    },
                    "KEEP USING ROLLBACK-LIKE",()=>{
                        dialogEngine.closeDialog();
                        rw.config.rollbackMethod = "pseudoRollback";
                        rw.info.writeConfig(true, ()=>pseudoRollbackCallback()); // save config and callback
                    },45);
                } else {
                    // Config set, complete callback - remember, this is feature restricted so we won't get here without RB perms
                    if (rw.config.rollbackMethod == "rollback") { // Rollback selected
                        rollbackCallback(); // Do rollback
                    } else {
                        pseudoRollbackCallback(); // rollback-like
                    }
                }
            }, ()=>pseudoRollbackCallback()); // if no perms follow pseudo rollback
        });
    },

    "restore" : (revID, reason) => {
        // Restore revision by ID
        rw.ui.loadDialog.show("Restoring...");
        // Ask API for latest revision
        $.getJSON(WIKICWD+"/w/api.php?action=query&prop=revisions&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&rvslots=*&rvprop=ids%7Cuser&formatversion=2&format=json", r=>{
            // We got the response
            let crID = r.query.pages[0].revisions[0].revid;
            // Ask API for the restore revision
            $.getJSON(WIKICWD+"/w/api.php?action=query&prop=revisions&rvprop=user&rvstartid="+ revID +"&rvendid="+ revID +"&titles="+ encodeURI(mw.config.get("wgRelevantPageName")) +"&formatversion=2&rvslots=*&format=json", r=>{
                let revUsr = r.query.pages[0].revisions[0].user; // get user
                let summary = "Restoring revision "+ revID + " by " + revUsr; // gen our summary
                // Now we've got that, we just need to submit. the undo
                $.post(WIKICWD+"/w/api.php", {
                        "action": "edit",
                        "format": "json",
                        "token" : mw.user.tokens.get("csrfToken"),
                        "title" : mw.config.get("wgRelevantPageName"),
                        "summary" : summary + (reason != null ? ": " + reason : "") + " [[WP:REDWARN|(RedWarn "+ rw.version +")]]", // summary sign here
                        "undo": crID, // current
                        "undoafter": revID // restore version
                    }).done(dt => {
                        // Request done. Check for errors, then go to the latest revision
                        if (!dt.edit) {
                            // Error occured or other issue
                            console.error(dt);
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. This edit has not been restored.");
                        } else {
                            rw.info.isLatestRevision(mw.config.get('wgRelevantPageName'), 0, ()=>{}); // we done, go to the latest revision
                        }
                    });
            });
        });
    },

    "promptRollbackReason" : reason=> {
        rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), rw.rollback.getRollbackrevID(),un=>{ // validate is latest
            // Show dialog then rollback
            // Add submit handler

            addMessageHandler("reason`*", rs=>rw.rollback.apply(rs.split("`")[1])); // When reason recieved, submit rollback

            // CREATE DIALOG
            // MDL FULLY SUPPORTED HERE (container). 
            dialogEngine.create(mdlContainers.generateContainer(`
            [[[[include rollbackReason.html]]]]
            `, 500, 120)).showModal(); // 500x120 dialog, see rollbackReason.html for code
        });
    },

    "promptRestoreReason" : revID=> {
        // Prompt for reason to restore. very sim to rollback reason
        let reason = ""; // Needed for rollback reason page - do not remove

        // Add submit handler
        addMessageHandler("reason`*", rs=>rw.rollback.restore(revID, rs.split("`")[1])); // When reason recieved, submit rollback

        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include rollbackReason.html]]]]
        `, 500, 120)).showModal(); // 500x120 dialog, see rollbackReason.html for code
    },

    "welcomeRevUsr" :() => {
        // Send welcome to user who made most recent revision
        rw.visuals.toast.show("Please wait...", false, false, 1000);
        rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), rw.rollback.getRollbackrevID(), un=>{
            // We got the username, send the welcome
            rw.quickTemplate.openSelectPack(un);
        });
    },


    // CONTRIBS PAGE

    "contribsPageIcons" : ()=>{ // Adds rollback/restore links
        
        // For each (current) tag
        $("span.mw-uctop").each((i, el)=>{
            // Add rollback options (${i} inserts i at that point to ensure it is a unique ID)
            $(el).html(`current 
            <span id="rw-currentRev${i}" style="cursor:default"> <!-- Wrapper -->
                <span style="font-family:Roboto;font-weight:400;"> &nbsp; <!-- Styling container -->
                    <!-- Links -->
                    <a style="color:green;cursor:pointer;" id="rw-currentRevPrev${i}" onclick="rw.rollback.contribsPageRollbackPreview(${i});">prev</a> &nbsp;
                    <a style="color:red;cursor:pointer;" id="rw-currentRevRvv${i}" onclick="rw.rollback.contribsPageRollbackVandal(${i});">rvv</a> &nbsp;
                    <a style="color:blue;cursor:pointer;" id="rw-currentRevRb${i}" onclick="rw.rollback.contribsPageRollback(${i});">rb</a>

                    <!-- Tooltips -->
                    <div class="mdl-tooltip" data-mdl-for="rw-currentRevPrev${i}">
                        Preview Rollback
                    </div>
                    <div class="mdl-tooltip" data-mdl-for="rw-currentRevRvv${i}">
                        Quick rollback Vandalism
                    </div>
                    <div class="mdl-tooltip" data-mdl-for="rw-currentRevRb${i}">
                        Rollback
                    </div>
                </span>
            </span>
            `);
        });

        // Now register tooltips
        setTimeout(()=>{
            // Register all tooltips after 50ms (just some processing time)
            for (let item of document.getElementsByClassName("mdl-tooltip")) {
                rw.visuals.register(item); 
            } 
        },100);
    },

    "contribsPageRollbackPreview" : i=>{
        // Get revision ID
        let revID = $("#rw-currentRev"+ i).closest("li").attr("data-mw-revid");
        let pageName =  $("#rw-currentRev"+ i).closest("li").find("a.mw-changeslist-date").attr("title");
        console.log(revID);
        console.log(pageName);
        rw.ui.loadDialog.show("Loading preview...");
        // Now verify is still latest
        rw.info.isLatestRevision(pageName, revID, un=>{
            // Is latest revision! Let's continue
            // Fetch latest revision not by user
            rw.info.latestRevisionNotByUser(pageName, un, (content, summary, rID) => {
                // Assemble URL
                let url = WIKICWD+"/w/index.php?title="+ pageName +"&diff="+ rID +"&oldid="+ revID +"&diffmode=source#rollbackPreview";
                redirect(url, true); // open URL in new tab
                rw.ui.loadDialog.close(); // close load dialog
            });
        }, ()=>{
            rw.ui.loadDialog.close(); // close load dialog
            // Isn't the latest revision, set note to match
            $("#rw-currentRev"+ i).html(
                `<span style="font-family:Roboto;color:red;">No longer the latest revision.</span>`
            );
        });
    },

    "contribsPageRollbackVandal" : i=>{
        // Get revision ID
        let revID = $("#rw-currentRev"+ i).closest("li").attr("data-mw-revid");
        let pageName =  $("#rw-currentRev"+ i).closest("li").find("a.mw-changeslist-date").attr("title");
        console.log(revID);
        console.log(pageName);
        
        $("#rw-currentRev"+ i).html(
            `<span style="font-family:Roboto;color:green;">reverting...</span>`
        );
        
        // Now verify is still latest
        rw.info.isLatestRevision(pageName, revID, un=>{
            // Is latest revision! Let's continue
            
            // Overwrite function and values used on diff pages as we aren't on a diff page
            rw.rollback.getRollbackrevID = ()=>{return revID;}; 
            mw.config.values.wgRelevantPageName = pageName;
            rw.rollback.apply("vandalism (from contribs page)", ()=>{ // apply the rollback
                // Rollback complete!
                $("#rw-currentRev"+ i).html(
                    `<span style="font-family:Roboto;color:green;">reverted!</span>`
                );
            }); 
        }, ()=>{
            // Isn't the latest revision, set note to match
            $("#rw-currentRev"+ i).html(
                `<span style="font-family:Roboto;color:red;">No longer the latest revision.</span>`
            );
        });
    },

    "contribsPageRollback" : i=>{
        // First, prompt for reason
        let reason = ""; // Needed for rollback reason page - do not remove

        // Add submit handler
        addMessageHandler("reason`*", rs=>{ // On submit
            let rollbackReason = rs.split("`")[1];
            // Get revision ID
            let revID = $("#rw-currentRev"+ i).closest("li").attr("data-mw-revid");
            let pageName =  $("#rw-currentRev"+ i).closest("li").find("a.mw-changeslist-date").attr("title");
            console.log(revID);
            console.log(pageName);
            
            $("#rw-currentRev"+ i).html(
                `<span style="font-family:Roboto;color:green;">reverting...</span>`
            );
            
            // Now verify is still latest
            rw.info.isLatestRevision(pageName, revID, un=>{
                // Is latest revision! Let's continue
                
                // Overwrite function and values used on diff pages as we aren't on a diff page
                rw.rollback.getRollbackrevID = ()=>{return revID;}; 
                mw.config.values.wgRelevantPageName = pageName;
                rw.rollback.apply(reason + " (from contribs page)", ()=>{ // apply the rollback
                    // Rollback complete!
                    $("#rw-currentRev"+ i).html(
                        `<span style="font-family:Roboto;color:green;">reverted!</span>`
                    );
                }); 
            }, ()=>{
                // Isn't the latest revision, set note to match
                $("#rw-currentRev"+ i).html(
                    `<span style="font-family:Roboto;color:red;">No longer the latest revision.</span>`
                );
            });
        });

        // CREATE DIALOG
        // MDL FULLY SUPPORTED HERE (container). 
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include rollbackReason.html]]]]
        `, 500, 120)).showModal(); // 500x120 dialog, see rollbackReason.html for code   
    }
};
