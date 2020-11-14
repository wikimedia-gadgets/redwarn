/**
 * RedWarn's multiple action tool
 * @class rw.multiAct
 */
rw.multiAct = { // Multi action screen
    /**
     * Initalise the multiple action tool buttons on a revision history page
     * @method initHistoryPage
     * @extends rw.multiAct
     */
    "initHistoryPage" : ()=> {
        // If on history page, add button to mass warn between edits
        if(window.location.href.includes("/index.php?title=") && window.location.href.includes("&action=history")) {
            // On history page, add button
            $(".mw-history-compareselectedversions").append(`
            <button class="mw-ui-button rwMAThist">Use the Multiple Action Tool between selected revisions</button>
            `);
            // Result handler
            let userObj = {};
            let editCount = 0;
            let userCount = 0;
            let resultHandler = r=>{
                // Done
                console.log(r);
                let revs = Object.values(r.query.pages)[0].revisions
                revs.forEach(rev=>{ // For each revision
                    let user = rev.user;
                    // Summary - revID: summary (click revid to open diff in new tab)
                    let summary = "<a target='_blank' href='https://en.wikipedia.org/w/index.php?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName"))
                                    +"&diff="+ rev.revid +"&oldid="+ rev.parentid +"&diffmode=source'>"+ rev.revid +"</a>: " +
                                    ((rev.comment != null && rev.comment.length > 0) ? rev.comment : "<i>No summary provided</i>"); 
                
                    // If user not in userObj, add
                    if (!(user in userObj)) {
                        userObj[user] = {
                            "edits" : 0,
                            "summaries": []
                        };
                        userCount += 1;
                    };

                    // Now add our info
                    userObj[user].edits += 1;
                    userObj[user].summaries.push(summary);
                    editCount += 1;
                });
                // Check if continue
                if (r.continue != null) {
                    // Still more to do, so resubmit
                    let latestID = $('#mw-history-compare').find('input[name="diff"]:checked').val(); 
                    let oldestID = $('#mw-history-compare').find('input[name="oldid"]:checked').val(); 
                    $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&format=json&titles="+
                        mw.config.get("wgRelevantPageName")+"&rvprop=ids%7Cuser%7Ccomment&rvstartid="+
                        latestID+"&rvendid="+oldestID + "&rvcontinue="+ r.continue.rvcontinue,
                    resultHandler); // continueee
                } else {
                    // We're done.
                    rw.ui.loadDialog.close(); // close load dialog
                    rw.multiAct.open(userObj); // open with userobj
                    userObj = {}; // clear to prevent 1 edit... 2 edits.. 3 edits ext.
                }
            }

            $(".rwMAThist").click(e=>{ // On click handler - don't use ID as there are two buttons
                e.preventDefault(); // stop the default redirect
                rw.ui.loadDialog.show("Please wait..."); // Show loading dialog
                // Load all revisions between oldid and diff - remember we are checking between this range
                let latestID = $('#mw-history-compare').find('input[name="diff"]:checked').val(); 
                let oldestID = $('#mw-history-compare').find('input[name="oldid"]:checked').val(); 
                // Get all revisions 
                $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&format=json&titles="+
                    mw.config.get("wgRelevantPageName")+"&rvprop=ids%7Cuser%7Ccomment&rvstartid="+
                    latestID+"&rvendid="+oldestID,
                resultHandler);
            });
        }
    },

    /**
     * Open the multiple action tool using the specified user object
     *
     * @param {object} userObj Object in format of {username1: {edits: [(array of revIDs)]}, username2: ..., username3: ...}
     * @method open
     * @extends rw.multiAct
     */
    "open" : userObj=>{ // userobj format or just {}
        // To prevent a new user from mass spamming loads of users, extendedconfirmed only
        rw.info.featureRestrictPermissionLevel("extendedconfirmed", ()=>{
            // Generate list
            let listHTML = ``;
            for (const usr in userObj) {
                if (userObj.hasOwnProperty(usr)) {
                    if (usr.toLowerCase().includes("bot")) continue; // skip bots
                    if (usr.toLowerCase() == "undefined" || usr == null) continue; // don't do undefined, bug
                    const userInfo = userObj[usr];
                    // Append table row
                    listHTML += `
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">`+ usr +`</td>
                        <td>
                        <a href="#" onclick="window.parent.postMessage(\`summaries `+ usr +`\`);"><strong>` + userInfo.edits + ` edit` + (userInfo.edits > 1 ? "s" : "") +`</strong></a><br/>
                        </td>
                        <td id="editCount-`+usr+`">-
                        <script>
                            // Adds handler for this edit count
                            addMessageHandler("editCount-`+ usr +`\`*", e=>{
                                $(document.getElementById("editCount-`+usr+`")).text(e.split("\`")[1]);
                            });
                        </script>
                        </td> <!-- user edit count, loaded on page -->
                        <!-- Highest notice -->
                        <td id="PWcontainer-`+usr+`">
                        <span class="material-icons" id="PastWarning-`+usr+`" style="cursor:help;position: relative;top: 5px;padding-left: 10px;color:black;">help</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+usr+`">
                            <span style="font-size:x-small;">
                                Level is unknown or loading
                            </span>
                        </div>
                        <script>
                            // Adds handler for this past level
                            addMessageHandler("PastWarning-`+ usr +`\`*", e=>{
                                $(document.getElementById("PWcontainer-`+usr+`")).html(e.split("\`")[1]);

                                // Now set onclick for the icon
                                $(document.getElementById("PastWarning-`+ usr +`")).click(()=>window.parent.postMessage(\`RWMAviewUserPg\\\``+ usr +`\`)); // push request upstairs on click
                                
                                // Now register all tooltips (fine if comp. handler undefined bc others will handle)
                                for (let item of document.getElementsByClassName("mdl-tooltip")) {
                                    componentHandler.upgradeElement(item); 
                                }

                                // Update progressbar from object keys
                                setProgress(`+ Object.keys(userObj).indexOf(usr) +`, `+ (Object.keys(userObj).length - 1) +`);
                            });
                        </script>
                        </td>
                        <td>-</td> <!-- text to add -->
                        <td>-</td> <!-- under date -->
                        </tr>
                    </tr>
                    `;
                    // Add event handler for edit click
                    addMessageHandler("summaries "+ usr, ()=>{
                        let revList = ``;
                        userInfo.summaries.forEach(el=>{
                            revList += el + "<hr/>";
                        });
                        rw.ui.confirmDialog(`
                        <h2 style="font-weight: 200;font-size:45px;line-height: 48px;">Related Changes</h2>
                        <div style="height:400px;overflow:auto;">
                        `+ revList +
                        `</div>`,
                        "CLOSE", ()=>dialogEngine.closeDialog(),
                        "", ()=>{}, 500);
                    });


                    // Add event handler for notice dialog
                    addMessageHandler("RWMATnewNotice", ()=>{
                        rw.ui.beginWarn(true, "(RedWarn MAT)", mw.config.get("wgRelevantPageName"), "APPLY TO CHECKED", r=>{
                            // Now push to iframe
                            rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage(
                                "applyToChecked`" + btoa(r) +
                                "`Yes`Warn User"
                                , '*');
                        }, true); // Show Warn User dialog, true at end hides user info
                    });

                    // Event Handler for new msg
                    addMessageHandler("RWMATnewMsg", ()=>{
                        rw.ui.newMsg("(RedWarn MAT)", true, "APPLY TO CHECKED", r=>{ // new talk page message dialog
                            // Now push to iframe
                            rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage(
                                "applyToChecked`" + btoa(r) +
                                "`No`New Message"
                                , '*');
                        });
                    });

                    // TODO: event handler for quick template

                    // Event handler for Commit Changes Confirmation Dialog
                    addMessageHandler("RWMATcommitSelectedConfirm`*", cI=>{
                        let userCount = cI.split("`")[1];
                        // Show confirm dialog
                        rw.ui.confirmDialog(`
                        Are you sure you want to complete actions for <b>`+ userCount + ` user` + (userCount > 1 ? "s" : "") +`</b>?`,
                        "CONFIRM", ()=>{
                            dialogEngine.closeDialog(); // close dialog
                            rw.ui.loadDialog.show("Editing talk pages..."); // loading dialog
                            rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage(
                                "confirmSelected", '*'); // Set the wheels in motion
                        },
                        "CANCEL", ()=>{
                            dialogEngine.closeDialog(); // close dialog on cancel
                        }
                        ,0);
                    });

                    // Now where the business happens
                    let actionsToTake = []; // array of objects

                    // Assemble array handler
                    addMessageHandler("RWMATToAdd`*", cI=>{
                        actionsToTake.push({
                            "user" : cI.split("`")[3],
                            "underDate" : cI.split("`")[2] == "true",
                            "wikiTxt" : atob(cI.split("`")[1])
                        });
                    });

                    // Actuall edit handler
                    addMessageHandler("RWMATfinishedandcommit", ()=>{
                        // Assemble commit handler
                        let editHandler = i=>{
                            let action = actionsToTake[i];
                            // Time to make the actual contrib
                            rw.info.addWikiTextToUserPage(action.user, action.wikiTxt, action.underDate, "Complete [[WP:REDWARN/MAT|MAT]] action", false, false, ()=>{
                                // Check we can continue
                                if (i == actionsToTake.length - 1) {
                                    // We done
                                    rw.ui.loadDialog.close();

                                    // Notify of completion
                                    rw.ui.confirmDialog(`
                                    Actions complete!`,
                                    "CLOSE", ()=>{
                                        dialogEngine.closeDialog(); // close dialog
                                    },
                                    "", ()=>{},0);
                                } else {
                                    // Continue
                                    editHandler(i+1);
                                }
                            });
                        };
                        
                        editHandler(0); // start it all
                    });
                }
            }

            // Open screen - do not use dialogEngine as other dialogs use this - allow for overlay
            // Generate container
            let content = mdlContainers.generateContainer(`[[[[include multipleAction.html]]]]`, document.body.offsetWidth, document.body.offsetHeight);
            // Dialog gubbins
            // Init if needed
            if ($("#MAdialogContainer").length < 1) {
                // Need to init
                $("body").prepend(`
                    <div id="MAdialogContainer">
                    </div>
                `);
                // Add close event
                addMessageHandler("closeDialogMA", ()=>{rw.multiAct.dialog.close();}); // closing
            }
            
            $("#MAdialogContainer").html(`
            <dialog class="mdl-dialog" id="rwMAdialog">
                `+ content +`
            </dialog>
            `);


            rw.multiAct.dialog = document.querySelector('#rwMAdialog'); // set dialog

            $("#rwMAdialog").attr("style", "padding:inherit;"); // set no padding
            // Firefox issue fix
            if (! rw.multiAct.dialog.showModal) {
                dialogPolyfill.registerDialog(rw.multiAct.dialog);
            }

            rw.multiAct.dialog.showModal(); // Show dialog

            // Now load all the edit counts and last warning levels
            let usernames = Object.keys(userObj);
            let userPages = {};

            // Add userpage preview handler
            addMessageHandler("RWMAviewUserPg`*", cI=>{
                let userPgWikiTxt = userPages[cI.split("`")[1]]; // get wikitext from obj
                // Parse wikitext (show loading dialog first)
                rw.ui.loadDialog.show("Parsing userpage...");
                rw.info.parseWikitext(userPgWikiTxt, parsed=>{ // Request
                    rw.ui.loadDialog.close(); // close load dialog
                    // Show preview dialog
                    rw.ui.confirmDialog(`
                        <style>
                            h2 {
                                font-size: 20px;
                                line-height: 0px;
                            }
                            .mw-editsection {
                                display: none;
                            }
                        </style>

                        <div style="height:500px;overflow:auto;">
                            `+parsed+`
                        </div>
                    `,
                    "CLOSE", ()=>dialogEngine.closeDialog(),
                    "", ()=>{}, 500);
                });
            });

            // Last Warn level and userpg handler (done as essentially foreach, called from editcount)
            let lastWarnLevelHandler = (i, callback) => { // LAST WARNING
                let un = usernames[i];
                rw.info.lastWarningLevel(rw.info.targetUsername(un), (w, usrPgMonth, userPg)=>{
                    let lastWarning = [ // Return HTML for last warning level.
                        // NO PAST WARNING
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:green;">thumb_up</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            No notices this month.
                            </span>
                        </div>
                        `,
        
                        // NOTICE
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:blue;">info</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            Has been given a Level 1 notice<br/>this month.
                            </span>
                        </div>
                        `,
                        // CAUTION
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:orange;" >announcement</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            Has been given a Level 2 caution<br/>this month.
                            </span>
                        </div>
                        `,
                        // Warning- in red. RedWarn, get it? This is the peak of programming humour.
                        /// Haha, whoops? This joke has turned up twice. Who'd ever think they'd see reused code?
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px; color:red;" >report_problem</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            Has been given a Level 3 warning<br/>this month.
                            </span>
                        </div>
                        `,
        
                        // Final/Only Warning (dark red)
                        `
                        <span class="material-icons" id="PastWarning-`+un+`" style="cursor:pointer;position: relative;top: 5px;padding-left: 10px;color:#a20000;" >report</span>
                        <div class="mdl-tooltip mdl-tooltip--large" for="PastWarning-`+un+`">
                            <span style="font-size:x-small;">
                            Has been given a Level 4 Final<br/>or ONLY warning.
                            </span>
                        </div>
                        `
                    ][w];

                    // Set userpage var for preview
                    userPages[un] = userPg;

                    // Now push to iframe
                    rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage("PastWarning-"+ un + "`" + lastWarning, '*');
                    callback(); // Send callback
                });
            };

            let editCounterHandler = (i, isRetry)=>{ // EDIT COUNT
                if (rw.info.isUserAnon(usernames[i])){ // skip edits by anon IPs as they will not return, just set lastwarnlevel
                    lastWarnLevelHandler(i, ()=>{
                        editCounterHandler(i + 1);
                    });
                    return;
                } 
                rw.info.getUserEditCount(usernames[i], cI=>{
                    // Push to iframe
                    // Set c to blank space if edit count undefined or edit count with number sorted if is
                    let c = cI == null ? "-" : cI.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // regex adds commas to number to make more readable
                    rw.multiAct.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage("editCount-"+ usernames[i] + "`" + c, '*');
                    
                    // Make sure there wasn't an issue, if so redo, and if redo fails just continue
                    if ((cI == null) && !isRetry) {
                        editCounterHandler(i, true); // do it again with retry flag
                        return;
                    }
                    // Now last warning handler
                    lastWarnLevelHandler(i, ()=>{
                        // Make sure there is a next
                        if (i != usernames.length - 1) {
                            editCounterHandler(i + 1); // do it again with next user
                        } // else we done!
                    });
                });
            };

            editCounterHandler(0); // call and begin load

        }, ()=>{
            // When no perms
            rw.ui.confirmDialog(`
            Sorry, but to prevent misuse you have to be an extended confirmed user to use the multiple action tool. Check back later!
            `,
            "OKAY", ()=>dialogEngine.closeDialog(),
            "", ()=>{}, 23);
        });
    }
};