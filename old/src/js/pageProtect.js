rw.pageProtect = { // Used for [[WP:RFPP]]
    "rfppPage" : "Wikipedia:Requests_for_page_protection", // !!! FOR PRODUCTION USE Wikipedia:Requests_for_page_protection ELSE USE User:Ed6767/sandbox/rwTests/rpp !!!
    // THIS MODULE IS NOW LIVE!!!

    // Define protection levels
    "editProtectionLevels" : { //edit protection - SET IN ORDER AS DISTINGUISHES BETWEEN UPGRADE AND DOWNGRADE
        "unprotected" : { // unprotected
            "title" : "Page is not edit protected",
            "name" : "no protection",
            "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Semi-protection-unlocked.svg/320px-Semi-protection-unlocked.svg.png"
        },

        "pendingChanges" : {
            // Edits only
            "title" : "Page is pending changes protected",
            "name" : "pending changes protection",
            "image" : "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Pending-protection-shackle.svg/240px-Pending-protection-shackle.svg.png"
        },

        "autoconfirmed" : {
            "title" : "Page is semi-protected",
            "name" : "semi-protection",
            "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Semi-protection-shackle.svg/240px-Semi-protection-shackle.svg.png"
        },

        "extendedconfirmed" : {
            "title" : "Page is extended protected",
            "name" : "extended protection",
            "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Extended-protection-shackle.svg/240px-Extended-protection-shackle.svg.png"
        },

        "templateeditor" : { // template protection
            "title" : "Page is template protected",
            "name" : "template protection",
            "image" : "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Template-protection-shackle.svg/240px-Template-protection-shackle.svg.png"
        },

        "sysop" : {
            "title" : "Page is fully protected",
            "name" : "full protection",
            "image" : "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Full-protection-shackle.svg/240px-Full-protection-shackle.svg.png"
        },

        "cascading" : {
            // Cascading protection
            "title" : "Page is cascade protected",
            "name" : "cascade protection",
            "image" : "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Cascade-protection-shackle.svg/240px-Cascade-protection-shackle.svg.png"
        }
    },

// for move protection add smallprint: move protection limit: x

    "getCurrentPageProtection" : callback=>{ // Callback {edit: level, move:level}
        // Request protection level from mediawiki
        $.getJSON(rw.wikiAPI + "?action=query&format=json&prop=info%7Cflagged&inprop=protection&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")), r=>{
            let pageInfo = r.query.pages[Object.keys(r.query.pages)[0]];

            let editProtection = "unprotected";
            let moveProtection = "unprotected";

            pageInfo.protection.forEach(protection => {
                if ((editProtection == "unprotected") && (protection.type == "edit")) editProtection = protection.level; // set edit protection level
                if ((moveProtection == "unprotected") && (protection.type == "move")) moveProtection = protection.level; // set move protection level
                if ((protection.cascade != null) && (protection.type == "edit")) editProtection = "cascading"; // cascading edit protection
            });

            // Detect pending changes protection
            if (pageInfo.flagged != null) {
                if (pageInfo.flagged.protection_level != null) editProtection = "pendingChanges";
            }

            callback({"edit": editProtection, "move": moveProtection}); // done, send callback
        });
    },

    "open" : ()=>{ // Open page protection dialog for this page
        // Get current page protection level
        rw.pageProtect.getCurrentPageProtection(protection=>{
            let protectionInfo = rw.pageProtect.editProtectionLevels[protection.edit];

            // Create the list of levels
            let finLevelListStr = ``;
            for (let levelKey in rw.pageProtect.editProtectionLevels) {
                if (rw.pageProtect.editProtectionLevels.hasOwnProperty(levelKey)) {
                    let level = rw.pageProtect.editProtectionLevels[levelKey];
                    finLevelListStr += `
                    <!-- Add image -->
                    <img src="${level.image}" style="height: 24px;padding-right:10px;" />

                    <!-- Radiobutton -->
                    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="${levelKey}" id="${levelKey}_outer">
                        <input type="radio" id="${levelKey}" class="mdl-radio__button" name="options" value="1" ${(levelKey == protection.edit) ? `disabled style="cursor:help"` : ``}> <!-- Disable if our current -->
                        <span class="mdl-radio__label">${level.name.charAt(0).toUpperCase() + level.name.slice(1)}</span> <!-- Capitalise first letter -->
                    </label>
                    <!-- Add tooltip if disabled -->
                    ${(levelKey == protection.edit) ? `
                    <div class="mdl-tooltip mdl-tooltip--large" for="${levelKey}_outer">
                        This is the current protection level.
                    </div>
                    ` : ``} <!-- END TOOLTIP -->
                    <hr />
                    `;
                }
            }

            // Add event handlers

            // Add toast handler
            addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,2500));

            // SUBMIT HANDLER
            addMessageHandler("submitRFPP`*", m=>{
                // Get info from string in
                let requestLevel = m.split("`")[1];
                let requestProtect = rw.pageProtect.editProtectionLevels[requestLevel];
                let changeCoreReason = m.split("`")[2];
                let changeExtraInfo = m.split("`")[3];
                let requestDuration = m.split("`")[4];
                let requestType = "";
                // Distingush whether or not this is an upgrade or download request
                if (Object.keys(rw.pageProtect.editProtectionLevels).indexOf(requestLevel) > Object.keys(rw.pageProtect.editProtectionLevels).indexOf(protection.edit)) {
                    // Is upgrade request
                    requestType = "upgrade";
                } else {
                    requestType = "downgrade";
                }

                // Let's submit - show load dialog
                rw.ui.loadDialog.show("Submitting request...");

                // TIME TO EDIT :)

                // generate heading to add under for upgrade or downgrade
                let headingToInsertUnder = "== "+ (requestType == "upgrade" ? "Current requests for increase in protection level" : "Current requests for reduction in protection level") +" ==";

                // Assemble text to add per page template
                let text = `=== [[:${mw.config.get("wgRelevantPageName").replace(/_/g, ' ')}]] ===
* {{pagelinks|${mw.config.get("wgRelevantPageName").replace(/_/g, ' ')}}}
'''${(requestProtect.name == "no protection" ? "Unprotection" : requestDuration + " " + requestProtect.name)}:''' ${(changeCoreReason == "Other rationale" ? "" : changeCoreReason + `. `)}${changeExtraInfo} `+ rw.sign();

                // New req current page.
                $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(rw.pageProtect.rfppPage) +"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
                    // Grab text from latest revision of talk page
                    // Check if exists
                    let revisionWikitext = "";
                    if (!latestR.query.pages[0].missing) { // If page isn't missing, i.e exists
                        revisionWikitext = latestR.query.pages[0].revisions[0].slots.main.content;
                    } else {
                        // Bug!
                        rw.ui.loadDialog.text("ERR: RFPP page nonexist!");return; // send basic and EXIT as unlikely to be seen expect by dev
                    }
                    let wikiTxtLines = revisionWikitext.split("\n");
                    let finalTxt = "";

                    // Check if page already reported
                    if (revisionWikitext.includes(mw.config.get("wgRelevantPageName").replace(/_/g, ' '))) {
                        // Don't continue and show toast
                        rw.ui.loadDialog.close();
                        rw.visuals.toast.show("It looks like an RFPP request already exists for this page.", false, false, 5000);
                        return;
                    }

                    // Now submit under heading
                    // Locate where the current section is and add ours
                    let locationOfLastLine = wikiTxtLines.indexOf(headingToInsertUnder) + 1; // in case of date heading w nothing under it
                    for (let i = wikiTxtLines.indexOf(headingToInsertUnder) + 1; i < wikiTxtLines.length; i++) {
                        if (wikiTxtLines[i].startsWith("== ")) {
                            // New section
                            locationOfLastLine = i - 1; // the line above is therefore the last
                            console.log("exiting loop: " +wikiTxtLines[locationOfLastLine]);
                            break; // exit the loop
                        } else if (i == wikiTxtLines.length - 1) {
                            // End of page, let's break and set location of last line.
                            locationOfLastLine = i;
                            break; // exit loop
                        }
                    }

                    if (locationOfLastLine == wikiTxtLines.length - 1) {
                        // To prevent to end notices squishing against eachother
                        // Same as without, but we just include the date string at bottom of page
                        wikiTxtLines.push(["\n" + text]);
                    } else {
                        wikiTxtLines.splice(locationOfLastLine, 0, ["\n" + text]); // Add notice to array at correct position. Note the "" at the start is for a newline to seperate from prev content
                    }

                    // Process final string
                    wikiTxtLines.forEach(ln => finalTxt = finalTxt + ln + "\n"); // Remap to lines
                    console.log(finalTxt);

                    // Push edit using CSRF token
                    $.post(rw.wikiAPI, {
                        "action": "edit",
                        "format": "json",
                        "token" : mw.user.tokens.get("csrfToken"),
                        "title" : rw.pageProtect.rfppPage,
                        "summary" : `Requesting protection change for [[${mw.config.get("wgRelevantPageName").replace(/_/g, ' ')}]] [[w:en:WP:RW|(RW ${rw.version})]]`, // summary sign here
                        "text": finalTxt,
                        "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                    }).done(dt => {
                        // We done. Check for errors, then callback appropriately
                        if (!dt.edit) {
                            // Error occured or other issue
                            console.error(dt);
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your RFPP has not been sent.");
                            // Reshow dialog
                            dialogEngine.dialog.showModal();
                        } else {
                            // Success!
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("RFPP requested.");
                        }
                    });


                });
            });

            // Open dialog
            dialogEngine.create(mdlContainers.generateContainer(
                rw.static.getHTML("requestPageProtect", {
                    title: protectionInfo.title,
                    finLevelListStr: finLevelListStr
                })
            , 600, 630)).showModal();
        });
    }
};