/**
 * RedWarn's pending changes review feature
 * @class rw.PendingChangesReview
 */
rw.PendingChangesReview = {
    /**
     * If on a review page, and user in "reviewer" group, this initalies review controls
     *
     * @method reviewPage
     * @extends rw.PendingChangesReview
     */
    "reviewPage" : ()=> {
        // Check config if disabled
        if (rw.config.rwDisablePendingChanges == "disable") return; // if disabled, exit
        
        // Pending changes buttons and warning (ONLY on review pages) 
        if (($("#mw-fr-reviewform").length > 0) && !($("#mw-fr-reviewformlegend").text().includes("Re-review"))) {
            rw.info.featureRestrictPermissionLevel("reviewer", ()=>{ // Restrict to pending changes reviewers
                // Add to accept header
                $('.flaggedrevs_reviewform').prepend(`
                <div style="text-align:center;width:100%;">
                    <div id="rReviewAccept" class="icon material-icons">
                        <span style="cursor: pointer; color:green;font-size:56px;">
                            done
                        </span>
                    </div>
                    <div class="mdl-tooltip mdl-tooltip--large" for="rReviewAccept">
                        Accept these changes
                    </div>
                    <div id="rReviewDeny" class="icon material-icons"><span style="cursor: pointer; padding-left:20px; color:red;font-size:56px;">
                            close
                        </span>
                    </div>
                    <div class="mdl-tooltip mdl-tooltip--large" for="rReviewDeny">
                        Revert changes
                    </div>
                </span>
                <br>
                `);
                // Hide original review box
                $(".fr-rating-controls").hide();
                // Handlers
                // ON ACCEPT
                let acceptHandler = ()=>{
                    // When accept button clicked.
                    rw.PendingChangesReview.confirmLatestRev(()=>{
                        rw.PendingChangesReview.getPendingChangesUsers((usr, count, users, userCount)=>{

                            // SUBMIT HANDLER, SCROLL DOWN FOR DIALOG
                            addMessageHandler("reason`*", reasonIn=> {
                                let comment = reasonIn.split("`")[1]; // params
                                // Time to submit 302 success, 200 FAIL
                                rw.ui.loadDialog.show("Accepting...");
                                $.ajax({
                                    url  : 'https://en.wikipedia.org/w/index.php?title=Special:RevisionReview&action=submit',
                                    type : 'post',
                                    data : {
                                        "action": "approve",
                                        "title": "Special:RevisionReview",
                                        "wpApprove" : 1,
                                        "target" : mw.config.get("wgRelevantPageName"),
                                        "wpEditToken" : mw.user.tokens.get("csrfToken"),
                                        "refid" : $("#mw-fr-input-refid").attr("value"),
                                        "oldid" : $("#mw-fr-input-oldid").attr("value"),
                                        "changetime" : $("#mw-fr-input-changetime").attr("value"),
                                        "userreviewing" : $("#mw-fr-input-reviewing").attr("value"),
                                        "templateParams": "",
                                        "imageParams": "",
                                        "fileVersion": "",
                                        "validatedParams": $('input[name ="validatedParams"]').attr("value"),
                                        "wpReason" : comment + " ([[w:en:Wikipedia:RedWarn|RedWarn "+ rw.version + "]])",
                                        "wpSubmit": "Accept revision"
                                }}).done((r, sT, x)=>{ // TODO: ADD AUTOWARNING, DETECT CHANGE AND OTHER
                                    rw.ui.loadDialog.close();
                                    // Review response (this gens a new dom thing then we get the content text and error in first p), get response of 302 or 200 with below else error
                                    //<b>Revision of <a href="/wiki/Joel_Osteen" title="Joel Osteen">Joel Osteen</a> flagged. (<a class="external text" href="https://en.wikipedia.org/w/index.php?title=Special:ReviewedVersions&amp;page=Joel_Osteen">view reviewed versions</a>)</b>
                                    if (x.status == 200){
                                        // We done :)
                                        let parser = new DOMParser();
                                        let el = parser.parseFromString(r, 'text/html');
                                        let resultStr = el.getElementById("mw-content-text").getElementsByTagName("p")[0].innerText;
                                        if (resultStr.includes("Revision of") && resultStr.includes("flagged")) {
                                            // Success!
                                            // Reload the page with tags
                                            rw.ui.loadDialog.show("Reloading...");
                                            window.location.hash = "#rwPendingAccept";
                                            window.location.reload();
                                        } else {
                                            // Probably error
                                            rw.visuals.toast.show("Sorry, an error occured and your review has not been submitted.", false, false, 5000);
                                        }
                                    } else {
                                        // Error
                                        rw.visuals.toast.show("Sorry, an error occured and your review has not been submitted.", false, false, 5000);
                                    }
                                    
                                });
                            });
                            
                            // SHOW DIALOG
                            let reviewAction = "Accept "+ count +" Revision"+ ((count > 1) ? "s" : ""); // i.e accept 1 revision / accept 2 revisions
                            let reviewCaption = `
                            <strong>You are about to accept `+ count +` edit`+ ((count > 1) ? "s" : "") + ` by `+ userCount +` user`+ ((userCount > 1) ? "s" : "") + `</strong>
                            <br/><br/>
                            Enter an optional comment, then confirm your review by clicking 'Submit Review' or by pressing ENTER.`;
                            let autoAccept = rw.config.rwDisableReviewAutoAccept != "disable" ? "true" : "false";
                            dialogEngine.create(mdlContainers.generateContainer(`[[[[include pendingReviewReason.html]]]]`, 500, 350)).showModal();
                        });
                    });
                };
                $("#rReviewAccept").click(acceptHandler);
                // END ACCEPT

                // ON DENY

                let denyHandler = ()=>{
                    // When DENY button clicked.
                    rw.PendingChangesReview.confirmLatestRev(()=>{
                        rw.PendingChangesReview.getPendingChangesUsers((usr, count, users, userCount)=>{
                            
                            addMessageHandler("reason`*", reasonIn=> { // ON REASON RECIEVED
                                // Generate revert string
                                let revertString = "Reverting "+ count +" pending edit"+ ((count > 1) ? "s" : "") + " by ";
                                // Build list of users (feeding in object keys)
                                revertString += (a=>{
                                    a.forEach((v,i)=>{ // Wrap contribs link around usernammes
                                        a[i] = "[[Special:Contributions/"+ v + "|"+ v +"]]";
                                    });
                                    // Build x, y and z list
                                    a.length == 1 ? a[0] : [ a.slice(0, a.length - 1).join(", "), a[a.length - 1] ].join(" and ");
                                    return a;
                                })(Object.keys(users));
                                revertString += " to last accepted version by [[Special:Contributions/"+ usr +"|"+ usr +"]]";

                                let comment = reasonIn.split("`")[1]; // params
                                rw.ui.loadDialog.show("Reverting...");
                                $.ajax({
                                    url  : 'https://en.wikipedia.org/w/index.php?title=Special:RevisionReview&action=submit',
                                    type : 'post',
                                    data : { // send request (reversed from form)
                                    "action": "reject",
                                    "title": "Special:RevisionReview",
                                    "wpReject" : 1,
                                    "wpRejectConfirm" : 1,
                                    "target" : mw.config.get("wgRelevantPageName"),
                                    "wpEditToken" : mw.user.tokens.get("csrfToken"),
                                    "refid" : $("#mw-fr-input-refid").attr("value"),
                                    "oldid" : $("#mw-fr-input-oldid").attr("value"),
                                    "changetime" : $("#mw-fr-input-changetime").attr("value"),
                                    "userreviewing" : $("#mw-fr-input-reviewing").attr("value"),
                                    "templateParams": "",
                                    "imageParams": "",
                                    "fileVersion": "",
                                    "validatedParams": $('input[name ="validatedParams"]').attr("value"),
                                    "wpReason" : revertString+ (comment.length > 0 ? ": "+ comment : "") + " ([[w:en:Wikipedia:RedWarn|RedWarn "+ rw.version + "]])",
                                    "wpSubmit": "Revert these changes"
                                }}).done((r,sT,x)=>{
                                    // Cannot reject these changes because someone already accepted some (or all) of the edits.
                                    rw.ui.loadDialog.close();
                                    let successHandler = ()=>{
                                        // On success
                                        rw.multiAct.open(users); // open MAT
                                    };
                                    if (x.status == 302) {
                                        // Redirect, so success!
                                        dialogEngine.closeDialog();
                                        successHandler();
                                    } else {
                                        // Oops, likely error (DENY ONLY)
                                        let parser = new DOMParser();
                                        let el = parser.parseFromString(r, 'text/html');
                                        let resultStr = el.getElementById("mw-content-text").getElementsByTagName("p")[0].innerHTML;
                                        if (resultStr.includes("Cannot reject these changes because someone already accepted some (or all) of the edits")) {
                                            // Show the issue 
                                            rw.PendingChangesReview.confirmLatestRev(()=>successHandler(), true); // true here note a different wording
                                        } else if (r.toLowerCase().includes("internal error")) {
                                            rw.visuals.toast.show("Sorry, an error occured and your review has not been submitted");
                                        } else {
                                            // Likely success
                                            successHandler();
                                        }

                                    }
                                });
                            });

                            let reviewAction = "Revert "+ count +" Revision"+ ((count > 1) ? "s" : "");
                            let reviewCaption = `
                            <strong>You are about to revert `+ count +` edit`+ ((count > 1) ? "s" : "") + ` by `+ userCount +` user`+ ((userCount > 1) ? "s" : "") + `</strong>
                            <br/><br/>
                            If you are not reverting vandalism, please enter a summary for the revert.
                            Confirm your review by clicking 'Submit Review' or by pressing ENTER.
                            `;
                            let autoAccept = rw.config.rwEnableReviewAutoRevert == "enable" ? "true" : "false";
                            dialogEngine.create(mdlContainers.generateContainer(`[[[[include pendingReviewReason.html]]]]`, 500, 350)).showModal();
                        });
                    });
                };

                $("#rReviewDeny").click(denyHandler);

                // END DENY
            }, ()=>{});
        } else if (($("#mw-fr-reviewform").length > 0) && ($("#mw-fr-reviewformlegend").text().includes("Re-review"))) {
            // Re-review page, all here is just unaccept
            // Add to accept header
            $('.flaggedrevs_reviewform').prepend(`
            <div style="text-align:center;width:100%;">
                <div id="rReviewUnAccept" class="icon material-icons"><span style="cursor: pointer; padding-left:20px; color:red;font-size:56px;">
                        close
                    </span>
                </div>
                <div class="mdl-tooltip mdl-tooltip--large" for="rReviewUnAccept">
                Unaccept changes
                </div>
            </span>
            <br>
            `);
            // Hide original review box
            $(".fr-rating-controls").hide();
            // Handlers
            $("#rReviewUnAccept").click(()=>{
                addMessageHandler("reason`*", reasonIn=> { // ON REASON RECIEVED 
                    // Dumbest one of all, just send, reload and hope for the best
                    let comment = reasonIn.split("`")[1];
                    rw.ui.loadDialog.show("Unaccepting...");
                    $.post("https://en.wikipedia.org/w/index.php?title=Special:RevisionReview&action=submit", {
                        "action": "submit",
                        "title": "Special:RevisionReview",
                        "wpUnapprove" : 1,
                        "target" : mw.config.get("wgRelevantPageName"),
                        "wpEditToken" : mw.user.tokens.get("csrfToken"),
                        "refid" : $("#mw-fr-input-refid").attr("value"),
                        "oldid" : $("#mw-fr-input-oldid").attr("value"),
                        "changetime" : $("#mw-fr-input-changetime").attr("value"),
                        "userreviewing" : $("#mw-fr-input-reviewing").attr("value"),
                        "templateParams": "",
                        "imageParams": "",
                        "fileVersion": "",
                        "validatedParams": $('input[name ="validatedParams"]').attr("value"),
                        "wpReason" : "Unapproving"+ (comment.length > 0 ? ": "+ comment : "") + " ([[w:en:Wikipedia:RedWarn|RedWarn "+ rw.version + "]])",
                        "wpSubmit": "Unaccept revision"
                    }).done(r=>{
                        window.location.hash = "#rwReviewUnaccept";
                        window.location.reload();
                    });
                });

                let reviewAction = "Unaccept Revision";
                let reviewCaption = `
                <strong>You are about to unaccept this revision.</strong>
                <br/><br/>
                If you are not reverting vandalism, please enter a summary for the revert.
                Confirm your review by clicking 'Submit Review' or by pressing ENTER.
                `;
                let autoAccept = rw.config.rwEnableReviewAutoRevert == "enable" ? "true" : "false";
                dialogEngine.create(mdlContainers.generateContainer(`[[[[include pendingReviewReason.html]]]]`, 500, 350)).showModal();

            });
        }
    }, // end init

    /**
     * Confirm that we are still confirming this revision - if not, the user will be prompted whether they still wish to initate the callback.
     *
     * @param {function} callback
     * @param {boolean} isFailedRevert Whether or not this function was initiated via a failed revert for a different dialog wording.
     * @method confirmLatestRev
     * @extends rw.PendingChangesReview
     */
    "confirmLatestRev" : (callback, isFailedRevert)=> { // Verify that this confirm is the latest revision
        $.getJSON("https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&rvslots=*&rvprop=ids%7Cuser%7Ccomment&formatversion=2&format=json", r=>{
            // We got the response
            let latestRId = r.query.pages[0].revisions[0].revid;
            let parentRId = r.query.pages[0].revisions[0].parentid;
            let latestUsername = r.query.pages[0].revisions[0].user;
            let latestComment = r.query.pages[0].revisions[0].comment;
            // Get restore ID from right side review
            if ($('#mw-diff-ntitle1 > strong > a').attr('href').split('&')[1].split('=')[1] == latestRId) {callback();} else { // If latest revision send callback else show dialog
                rw.ui.confirmDialog(`
                <span>
                    <strong>`+ (!isFailedRevert ? `This is not the latest revision and may have been reverted by another reviewer.` :
                    `This edit could not be reverted as another editor has reverted it.`)
                    +`</strong> Would you like to review the latest revision`+ (isFailedRevert ? " or continue to the multiple action screen anyway" : "") +`?
                </span>
                <hr/>
                <span style="font-size:small;font-style: italic;height:340px;overflow:auto;">
                    Latest revision by `+ latestUsername +`: `+ latestComment +`
                </span>
                `,
                "GO TO LATEST REVISION", ()=>{
                    dialogEngine.closeDialog();
                    rw.ui.loadDialog.show("Redirecting...");
                    // Redirect to latest version
                    redirect("https://en.wikipedia.org/w/index.php?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&diff="+ latestRId +"&oldid="+ parentRId +"&diffmode=source#redirectLatestRevision");
                },
                "CONTINUE ANYWAY", ()=>{
                    dialogEngine.closeDialog();
                    callback();
                }, isFailedRevert? 135 : 115); // continue anyway: close and callback
            }
        });
    },

    /**
     * Calls back with the past 10 users who have had pending edits
     *
     * @param {function} callback callback(lastAcceptedUser, countofEdits, rwMultiActuserObject, userCount)
     * @method getPendingChangesUsers
     * @extends rw.PendingChangesReview
     */
    "getPendingChangesUsers" : callback=> { // CALLBACK(last accepted usr, count, obj, userCount)
        // Get all revisions between last accepted and this one
        $.getJSON("https://en.wikipedia.org/w/api.php?action=query&prop=revisions&format=json&titles="+
                    mw.config.get("wgRelevantPageName")+"&rvprop=ids%7Cuser%7Ccomment&rvstartid="+
                    $("#mw-fr-input-oldid").attr("value")+"&rvendid="+$("#mw-fr-input-refid").attr("value"),
        r=>{
            // Done
            let revs = Object.values(r.query.pages)[0].revisions
            let lastAcceptedUser = revs.pop().user; // Remove & Return Last item as is the last accepted - Remove last user as not pending
            let userObj = {};
            let editCount = 0;
            let userCount = 0;
            revs.forEach(rev=>{ // For each revision
                let user = rev.user;
                // Summary - revID: summary (click revid to open diff in new tab)
                let summary = "<a target='_blank' href='https://en.wikipedia.org/w/index.php?title="+ encodeURIComponent(mw.config.get("wgRelevantPageName"))
                                +"&diff="+ rev.revid +"&oldid="+ rev.parentid +"&diffmode=source'>"+ rev.revid +"</a>: " + rev.comment; 
            
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
            // We're done. Callback
            callback(lastAcceptedUser, editCount, userObj, userCount);
        });
    }
}