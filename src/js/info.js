// API calls ext.
rw.info = { // API
    // Rollback token
    "rollbackToken" : "",
    "getRollbackToken" : () => {
        // Ran on load to allow for ?action=rollback request
        rw.info.featureRestrictPermissionLevel("rollbacker", ()=>{
            $.getJSON(rw.wikiAPI + "?action=query&meta=tokens&type=rollback&format=json", r=>{
                rw.info.rollbackToken = r.query.tokens.rollbacktoken; // Set from response
            });
        },()=>{});
    },
    "targetUsername": un=>{
        if (un) {return un;} // return username if defined
        return mw.config.values.wgRelevantUserName},
    "getUsername":  ()=>{return mw.config.values.wgUserName},

    "isUserAnon" : un=> {
        // Detect if user is an IP address
        let regEx = un.match(/([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\d{1,3}\.){3}\d{1,3}/g); // this regex matches all ipv4 and ipv6 addresses. thanks: http://regexlib.com/UserPatterns.aspx?authorId=3e359e7e-cff5-4149-ba94-7baeae099d9c
        return (regEx != null); // If matches is not null then yes
    },

    "getConfig": (callback, resetToDefault) => { // IF RESETTODEFAULT IS TRUE IT WILL DO IT
        
        let defaultConfig = { // Default config on reset or anything like that
            "lastVersion" : rw.version
        };

        if (resetToDefault) {rw.config = defaultConfig; rw.info.writeConfig(); return;} // If reset to default, do it

        if (rw.config) {callback();} // if config loaded, no need to reload


        // gets user config from their page. 
        let user = rw.info.getUsername();
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles=User:"+user+"/redwarnConfig.js&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of talk page
            // Check if exists
            let revisionWikitext = "";
            if (!latestR.query.pages[0].missing) { // If page isn't missing, i.e exists
                revisionWikitext = latestR.query.pages[0].revisions[0].slots.main.content;
            } else {
                // Config doesn't exist  we need to make it
                console.log("creating config file");
                rw.config = defaultConfig;
                rw.info.writeConfig(()=>{if (callback != null) callback();}); // write new config file and callback if possible, else, add welcome screen here
                return;
            }

            // Now that's done, verify config file / load it
            try {
                eval(revisionWikitext); // exec script

                if (!rw.config) throw "no config";

                // Process template packs (b64encoded string)
                if (rw.config.templatePacks != null) {
                    rw.config.templatePacks = JSON.parse(atob(rw.config.templatePacks));
                    // Verify
                    if (typeof rw.config.templatePacks == "string") rw.config.templatePacks = JSON.parse(atob(rw.config.templatePacks)); // if issue, throw error and return to default
                }

                // Load rollback icons
                if (rw.config.rwRollbackIcons != null) {
                    // More info in preferences.html and rollback.html
                    let newRwIcons = []; // object containing the new object
                    rw.config.rwRollbackIcons.forEach(icon=>{ // for each icon
                        // Add to ours at the new location
                        newRwIcons[icon.shift] = rw.rollback.icons[icon.index];
                        // Now modify for each modifier in modify object
                        for (const key in icon.modify) {
                            if (icon.modify.hasOwnProperty(key)) {
                                const value = icon.modify[key];
                                newRwIcons[icon.shift][key] = value; // apply modifier
                            }
                        }

                        // Set original index for preferences
                        newRwIcons[icon.shift].originalIndex = icon.index; // DO NOT set this to iconIndex as iconIndex is for rendering - this is for config and preferences ONLY
                    });

                    // Now update rwrollbackicons
                    rw.rollback.icons = newRwIcons;
                }

            } catch (err) {
                // Corrupt config file
                console.log(rw.config);
                rw.config = defaultConfig;
                console.error(err);
                // Reset config file to defaults
                rw.info.writeConfig(true, ()=>rw.ui.confirmDialog(`Sorry, but an issue has caused your RedWarn preferences to be reset to default. Would you like to report a bug?`, 
                "Open Feedback and Support", ()=>{
                    rw.ui.sendFeedback(`<!-- DO NOT EDIT BELOW THIS LINE! THANK YOU -->
                    rwConfig load - Error info: <code><nowiki>
                    ` +err + `</nowiki></code>
                    [[User:`+user+`/redwarnConfig.js|Open user rwConfig.js]]
                    `);
                },
                
                "DISMISS", ()=>{
                    dialogEngine.closeDialog();
                }, 20));   
            }
            

            callback(); // we done
        });
    },

    "writeConfig": (noRedirect, callback)=> { // CALLBACK ONLY IF NOREDIRECT IS TRUE.
        let rwConfigTemplate = rw.config.templatePacks; // for restore
        // Handle templates (saved as b64 string)
        if (rw.config.templatePacks != null) rw.config.templatePacks = btoa(JSON.stringify(rw.config.templatePacks));
        if (!noRedirect) rw.ui.loadDialog.show("Saving preferences...");
        // Write config to the users page and refresh
        let finalTxt = `
/*<nowiki>                                                    
This is your RedWarn configuration file. It is recommended that you don't edit this yourself and use RedWarn prefrences instead.
It is writen in JSON formatting and is excecuted every time RedWarn loads.

If somebody has asked you to add code to this page, DO NOT do so as it may comprimise your account and will be reverted as soon as any configuration value changes.

!!! Do not edit below this line unless you understand the risks! If rw.config isn't defined, this file will be reset. !!!
*/
rw.config = `+ JSON.stringify(rw.config) +"; //</nowiki>"; // generate config text
        $.post(rw.wikiAPI, {  // LOCALISATION ISSUE!!
                "action": "edit",
                "format": "json",
                "token" : mw.user.tokens.get("csrfToken"),
                "title" : "User:"+ rw.info.getUsername() + "/redwarnConfig.js",
                "summary" : "Updating user configuration [[WP:REDWARN|(RedWarn "+ rw.version +")]]", // summary sign here
                "text": finalTxt,
                "tags" : (rw.wikiBase.includes("en.wikipedia.org") ? "RedWarn" : null) // Only add tags if on english wikipedia
            }).done(dt => {
                // We done. Check for errors, then callback appropriately
                if (!dt.edit) {
                    // Error occured or other issue
                    console.error(dt);
                    rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your changes have not been saved.");
                } else {
                    // Success!
                    if (noRedirect) {rw.config.templatePacks = rwConfigTemplate; callback(); return;}; // DO NOT continue if no redirect is requested
                    window.location.hash = "#configChange";
                    window.location.reload(); // we done
                }
            });
    },

    "featureRestrictPermissionLevel": (l, callback, callbackIfNot)=> {
        // Restrict feature to users in this group
        mw.user.getGroups(g=>{
            let hasPerm = g.includes(l);
            if (!hasPerm) hasPerm = g.includes("sysop"); // admins override all feature restrictions if we don't have them
            
            if ((l == "confirmed") && !hasPerm) {hasPerm = g.includes("autoconfirmed");} // Due to 2 types of confirmed user, confirmed and autoconfirmed, we have to check both
            if (hasPerm) {
                // Has the permission needed
                if (callback) {
                    callback();
                }
            } else {
                if (callbackIfNot) {
                    // Make no perm callback
                    callbackIfNot();
                } else {
                    // Show no perm toast
                    rw.visuals.toast.show("Your account doesn't have permission to do that yet.", false, false, 5000);
                }
            }
        });
    },

    "getRelatedPage" : (pg)=> { // TODO - APPEND &VANARTICLE LIKE TWINKLE FOR THIS!
        if (pg) {return pg;} // return page if defined
        try {
            let x = mw.util.getParamValue('vanarticle');
            if (x != null) {return x;} else {return "";}
        } catch (er) {
            // If none
            return "error";
        }  
    },

    "parseWikitext" : (wikiTxt, callback) => { // Uses Wikipedia's API to turn Wikitext to string. NEED TO USE POST IF USERPAGE IS LARGE EXT..
        $.post(rw.wikiAPI, {
            "action": "parse",
            "format": "json",
            "contentmodel" : "wikitext",
            "prop": "text",
            "pst": true,
            "assert": "user",
            "text": wikiTxt,
            "tags" : (rw.wikiBase.includes("en.wikipedia.org") ? "RedWarn" : null) // Only add tags if on english wikipedia
        }).done(r => {
            let processedResult = r.parse.text['*'].replace(/\/\//g, "https://").replace(/href=\"\/wiki/g, `href=rw.wikiBase+"/wiki`); // regex replace w direct urls
            callback(processedResult); // make callback w HTML
        });
    },

    "lastWarningLevel" : (user, callback)=> { // callback(wLevel. thisMonthsNotices, userPg) 0 none 1 notice 2 caution 3 warning 4 final warning
        // Get the last warning level of a user this month
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles=User_talk:"+user+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of talk page
            // Check if exists
            let revisionWikitext = "";
            if (!latestR.query.pages[0].missing) { // If page isn't missing, i.e exists
                revisionWikitext = latestR.query.pages[0].revisions[0].slots.main.content;
            } else {
                // Return that record is clean as no past warnings due to page not existing
                callback(0, "Talk page doesn't exist.", "Talk page doesn't exist."); // exit
                return;
            }
            let wikiTxtLines = revisionWikitext.split("\n");
            // let's continue
            // Returns date in == Month Year == format and matches
            let currentDateHeading = ((d)=>{return "== " + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + " " + (1900 + d.getYear()) + " =="})(new Date);
            
            // rev13, add alt without space
            let currentAltDateHeading = ((d)=>{return "==" + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + " " + (1900 + d.getYear()) + "=="})(new Date);
            
            let pageIncludesCurrentDate = wikiTxtLines.includes(currentDateHeading);
            let pageIncludesCurrentAltDate = wikiTxtLines.includes(currentAltDateHeading);

            if ((!pageIncludesCurrentDate) && (!pageIncludesCurrentAltDate)) {
                // No warnings this month
                callback(0, "No notices for this month.", revisionWikitext);
                return;
            } else if ((!pageIncludesCurrentDate) && (pageIncludesCurrentAltDate)) currentDateHeading = currentAltDateHeading; // If ==Date== is there but == Date == isn't, use ==Date== instead.

            let highestWarningLevel = 0; // Set highest to nothing so if there is a date title w nothing in then that will be reported 
            let thisMonthsNotices = ""; // for dialog
            // For each line
            for (let i = wikiTxtLines.indexOf(currentDateHeading) + 1; i < wikiTxtLines.length; i++) {
                if (wikiTxtLines[i].startsWith("==")) {
                    // New section
                    break; // exit the loop
                }

                // Check if it contains logo for each level
                thisMonthsNotices += wikiTxtLines[i]; // Add to this months
                if (wikiTxtLines[i].match(/(File:|Image:)Stop hand nuvola.svg/gi)) { // Level 4 warning
                    // This is the highest warning level. We can leave now
                    highestWarningLevel = 4;
                    break; // exit the loop
                }

                // Not using elseif in case of formatting ext..

                if (wikiTxtLines[i].match(/(File:|Image:)(Nuvola apps important.svg|Ambox warning pn.svg)/gi)) { // Level 3 warning
                    highestWarningLevel = 3; // No need for if check as highest level exits
                }

                if (wikiTxtLines[i].match(/(File:|Image:)Information orange.svg/gi)) { // Level 2 warning 
                    if (highestWarningLevel < 3) {
                        // We can set
                        highestWarningLevel = 2;
                    }
                }

                if (wikiTxtLines[i].match(/(File:|Image:)Information.svg/gi)) { // Level 1 notice
                    if (highestWarningLevel < 2) {
                        // We can set
                        highestWarningLevel = 1;
                    }
                }
            } // End for loop

            callback(highestWarningLevel, thisMonthsNotices, revisionWikitext); // We done

        });
    },// End lastWarningLevel

    "addWikiTextToUserPage" : (user, text, underDate, summary, blacklist, blacklistToast, callback) => {
        if ((user == null) || (user.toLowerCase() == "undefined")) {
            // Stop it from being sent to User:undefined
            // TODO: Add callback because likely bug
            rw.visuals.toast.show("Sorry, an error occured. (user undef.)");
            return;
        }
        if (callback == null) rw.ui.loadDialog.show("Saving message..."); // show load if no callback
        // Add text to a page. If underdate true, add it under a date marker
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles=User_talk:"+user+"&rvslots=*&rvprop=content&formatversion=2&format=json", latestR=>{
            // Grab text from latest revision of talk page
            // Check if exists
            let revisionWikitext = "";
            if (!latestR.query.pages[0].missing) { // If page isn't missing, i.e exists
                revisionWikitext = latestR.query.pages[0].revisions[0].slots.main.content;
            } // else we keep to ""
            let wikiTxtLines = revisionWikitext.split("\n");
            let finalTxt = "";

            // Check blacklist (if defined)
            if (blacklist) {
                if (revisionWikitext.includes(blacklist)) {
                    // Don't continue and show toast
                    rw.ui.loadDialog.close();
                    rw.visuals.toast.show(blacklistToast, false, false, 5000);
                    return;
                }
            }

            // let's continue
            // Returns date in == Month Year == format and matches
            let currentDateHeading = ((d)=>{return "== " + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + " " + (1900 + d.getYear()) + " =="})(new Date);
            let pageIncludesCurrentDate = wikiTxtLines.includes(currentDateHeading);
            // rev13, add alt without space (i.e ==Month Year==)
            let currentAltDateHeading = ((d)=>{return "==" + ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()] + " " + (1900 + d.getYear()) + "=="})(new Date);
            let pageIncludesCurrentAltDate = wikiTxtLines.includes(currentAltDateHeading);

            if ((!pageIncludesCurrentDate) && (pageIncludesCurrentAltDate)) { // If ==Date== is there but == Date == isn't, use ==Date== instead.
                currentDateHeading = currentAltDateHeading;
                pageIncludesCurrentDate = true;
            } 
            
            // Let's continue :)
            if (underDate) {
                if (pageIncludesCurrentDate) {
                    // Locate and add text in section

                    // Locate where the current date section ends so we can append ours to the bottom
                    let locationOfLastLine = wikiTxtLines.indexOf(currentDateHeading) + 1; // in case of date heading w nothing under it
                    for (let i = wikiTxtLines.indexOf(currentDateHeading) + 1; i < wikiTxtLines.length; i++) {
                        if (wikiTxtLines[i].startsWith("==")) { 
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
                    console.log(locationOfLastLine);
                    if (locationOfLastLine == wikiTxtLines.length - 1) {
                        // To prevent to end notices squishing against eachother
                        // Same as without, but we just include the date string at bottom of page
                        wikiTxtLines.push(["\n" + text]);
                    } else {
                        wikiTxtLines.splice(locationOfLastLine, 0, ["\n" + text]); // Add notice to array at correct position. Note the "" at the start is for a newline to seperate from prev content
                    }
                } else { // Page doesn't have current date
                    // Same as without, but we just include the date string at bottom of page
                    wikiTxtLines.push(["\n" + currentDateHeading + "\n" + text]);
                }
            } else {
                // No need to add to date. Just shove at the bottom of the page
                wikiTxtLines.push([text]);
            }

            // Process final string
            wikiTxtLines.forEach(ln => finalTxt = finalTxt + ln + "\n"); // Remap to lines
            console.log(finalTxt);

            // Push edit using CSRF token
            $.post(rw.wikiAPI, {
                "action": "edit",
                "format": "json",
                "token" : mw.user.tokens.get("csrfToken"),
                "title" : "User_talk:"+ user,
                "summary" : summary + " [[WP:REDWARN|(RedWarn "+ rw.version +")]]", // summary sign here
                "text": finalTxt,
                "tags" : (rw.wikiBase.includes("en.wikipedia.org") ? "RedWarn" : null) // Only add tags if on english wikipedia
            }).done(dt => {
                // We done. Check for errors, then callback appropriately
                if (!dt.edit) {
                    // Error occured or other issue
                    console.error(dt);
                    rw.ui.loadDialog.close();
                    rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your message has not been sent.");
                    // Reshow dialog
                    dialogEngine.dialog.showModal();
                } else {
                    // Success! 
                    if (callback != null) {callback(); return;}; // callback and stop if set, else..

                    // Redirect to complete page
                    let reloadNeeded = window.location.href.includes(rw.wikiBase+"/wiki/User_talk:"+ user); // if we are already on the talk page we need to refresh as this would just change the hash
                    redirect(rw.wikiBase+"/wiki/User_talk:"+ user + "#noticeApplied-" + dt.edit.newrevid + "-" + dt.edit.oldrevid); // go to talk page
                    if (reloadNeeded) {location.reload();}
                    // We done
                }
            });
        }); 
    }, // end addTextToUserPage

    "quickWelcome" : un=>{
        // Quickly welcome the current user
        // Check if registered or unregistered user
        if (rw.info.isUserAnon(rw.info.targetUsername(un))) {
            // IP Editor - send IP welcome
            rw.info.addWikiTextToUserPage(rw.info.targetUsername(un), "\n"+ rw.welcomeIP() +" " + rw.sign() +"\n", false, "Welcome! (IP)");
        } else {
            // Registered user
            rw.info.addWikiTextToUserPage(rw.info.targetUsername(un), "\n"+ rw.welcome() +" " + rw.sign() +"\n", false, "Welcome!");
        }
    },

    // Used for rollback
    "isLatestRevision" : (name, revID, callback, noRedirectCallback) => { // callback(username) only if successful!! in other cases, will REDIRECT to latest revison compare page
        // Check if revsion is the latest revision
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(name) +"&rvslots=*&rvprop=ids%7Cuser&formatversion=2&format=json", r=>{
            // We got the response
            let latestRId = r.query.pages[0].revisions[0].revid;
            let parentRId = r.query.pages[0].revisions[0].parentid;
            let latestUsername = r.query.pages[0].revisions[0].user;
            if (latestRId == revID) {
                // Yup! Send the callback
                callback(latestUsername, latestRId);
            } else {
                // Nope :(
                // Check for a noredirect callback, if so, call and return
                if (noRedirectCallback != null) {noRedirectCallback(); return;}
                
                // Load the preview page of the latest one
                try {if (dialogEngine.dialog.open) {return;}} catch (error) {} // DO NOT REDIRECT IF DIALOG IS OPEN.
                // Redirect and open in new tab if requested
                redirect(rw.wikiIndex + "?title="+ encodeURIComponent(name) +"&diff="+ latestRId +"&oldid="+ parentRId +"&diffmode=source#redirectLatestRevision", (rw.config.rwLatestRevisionOption == "newtab"));
            }
        });
    },

    "latestRevisionNotByUser" : (name, username, callback) => { // CALLBACK revision, summaryText, rId
        // Name is page name, username is bad username
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(name) +"&rvslots=*&rvprop=ids%7Cuser%7Ccontent&rvexcludeuser="+ username +"&formatversion=2&format=json", r=>{
            // We got the response
            let _r;
            try {
                _r = r.query.pages[0].revisions[0]; // get latest revision
                if (_r == null) { throw "can't be null"; } // if empty error
            } catch (error) {
                // Probably no other edits. Redirect to history page and show the notice
                redirect(rw.wikiIndex + "?title="+ encodeURIComponent(name) +"&action=history#rollbackFailNoRev");
                return; // exit
            }
            
            let latestContent = _r.slots.main.content;
            let summary = "Reverting edit(s) by [[Special:Contributions/"+ username +"|"+ username +"]] ([[User_talk:"+ username +"|talk]]) to rev. "+ _r.revid +" by " +_r.user;
            callback(latestContent, summary, _r.revid, _r.parentid);
        });
    },

    "stripWikiTxt" : wikiTxt=> {
        // VERY BASIC Convert WikiText to string
        try {
            wikiTxt = wikiTxt.replace(/<!--[^>]*-->/g, ""); // Strip html comments
            wikiTxt.match(/\[\[(?:[^\]\]]*)\]\]/g).forEach(t=>{ // match [[*]]
                txtToKeep = (a=>{return a[a.length - 1];})(t.split("|")).replace("]]", ""); // Last | iin the string then rm the end
                wikiTxt = wikiTxt.replace(t, txtToKeep); // now replace
            });
            wikiTxt = wikiTxt.replace(/'''/g, ""); // rm bold
            wikiTxt = wikiTxt.replace(/''/g, ""); // rm italic
        } catch (err) {} // Probably no wikitxt there
         return wikiTxt;
    },

    "getUserPronouns" : (user, callback)=> {
        // Trying mediawiki api here rather than a jquery get
        new mw.Api().get({
            action: 'query',
            list: 'users',
            usprop: 'gender',
            ususers: user
        }).then(r=>{
            let gender = r.query.users[0].gender;
            callback((gender == "male") ? "he/him" : ((gender == "female") ? "she/her" : "they/them")); // callback with our pronouns
        });
    },

    "getUserEditCount" : (user, callback)=> {
        // Trying mediawiki api here rather than a jquery get
        new mw.Api().get({
            action: 'query',
            list: 'users',
            usprop: 'editcount',
            ususers: user
        }).then(r=>{
            callback(r.query.users[0].editcount); // edit count
        });
    },

    "changeWatch" : {
        // Watches for changes on a page, always latest version and notifies
        "active" : false,
        "timecheck" : "",
        "lastRevID": "",
        "toggle" : ()=> {
            if (!rw.info.changeWatch.active) {
                // We're not active, make UI changes
                // Request notification perms
                if (Notification.permission !== 'granted') Notification.requestPermission();

                $("#rwSpyIcon").css("color", "green");
                rw.visuals.toast.show("Alerts Enabled - please keep this tab open.");
                rw.info.changeWatch.active = true;

                // Get latest rev id
                $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&rvslots=*&rvprop=ids&formatversion=2&format=json", r=>{
                    // We got the response, set our ID
                    rw.info.changeWatch.lastRevID = r.query.pages[0].revisions[0].revid;
                    rw.info.changeWatch.timecheck = setInterval(()=>{ // Check for new revision every 5 seconds
                        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&rvslots=*&rvprop=ids&formatversion=2&format=json", r2=>{
                            // Got response, compare
                            if (rw.info.changeWatch.lastRevID != r2.query.pages[0].revisions[0].revid) {
                                // New Revision! Redirect.
                                clearInterval(rw.info.changeWatch.timecheck); // clear updates
                                let latestRId = r2.query.pages[0].revisions[0].revid;
                                let parentRId = r2.query.pages[0].revisions[0].parentid;

                                if (windowFocused) {
                                    // Redirect and don't do anything else
                                    redirect(rw.wikiIndex + "?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&diff="+ latestRId +"&oldid="+ parentRId +"&diffmode=source#watchLatestRedirect");
                                } else {
                                    // Push notification
                                    document.title = "**New Edit!** " + document.title; // Add alert to title
                                    if (Notification.permission !== 'granted') {
                                        Notification.requestPermission();
                                    } else {
                                        let notification = new Notification('New Change to ' + mw.config.get("wgRelevantPageName"), {
                                            icon: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
                                            body: 'Click here to view',
                                        });
                                        notification.onclick = function() {
                                            window.focus(); // When focused, we'll redirect anyways
                                            this.close(); // focus our tab and close notif
                                        };

                                        window.onfocus = function(){
                                            // Redirect on focus
                                            redirect(rw.wikiIndex + "?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&diff="+ latestRId +"&oldid="+ parentRId +"&diffmode=source#watchLatestRedirect");
                                        };
                                    }
                                } 
                            }
                        });
                    }, 5000);
                });
            } else {
                clearInterval(rw.info.changeWatch.timecheck); // clear updates
                $("#rwSpyIcon").css("color", ""); // clear colour from icon
                rw.visuals.toast.show("Alerts Disabled.");
                rw.info.changeWatch.active = false;
            }
        }
    }
    
};