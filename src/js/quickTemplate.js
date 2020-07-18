rw.quickTemplate = { // Quick template UI and loader

    "packStore" : [],

    "packs" : ()=>{ // Get packs from config and default and merge to packstore
        if (rw.quickTemplate.packStore.length > 0) return rw.quickTemplate.packStore; // return if already set

        if (rw.config.templatePacks == null) { // if templates not set
            rw.config.templatePacks = []; // set to empty
            rw.info.writeConfig(true, ()=>{}); // update config page
        }
        rw.quickTemplate.packStore = rw.quickTemplate.packStore.concat(rw.config.templatePacks);
        return rw.quickTemplate.packStore; // return
    },

    "packCodeToPageName" : packCode=>{ // Convert a pack code to it's real page name
        return "User:" + packCode.split("/")[0] + "/RedWarn_QuickTemplate_packInstall_" + packCode.split("/")[1] + ".js";
    },


    "openSelectPack" : un=>{
        // Assemble buttons for each pack
        let finalBtnStr = "";
        rw.quickTemplate.packs().forEach((pack, i) => {
            if (pack.name == null) return; // skip "undefined by undefined"
            finalBtnStr += `
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" style="width:85%" onclick="window.parent.postMessage('selectPack\``+i+`', '*');">
                `+ pack.name +` by `+ pack.createdBy +`
            </button>
            <!-- EDIT BUTTON -->
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect" style="width:5%" onclick="window.parent.postMessage('editPack\``+i+`', '*');">
                <i class="material-icons">create</i>
            </button>
            <br/><br/>
            `;
        });

        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,4000));
        // Add new pack handler
        addMessageHandler("qTnewPack", ()=>rw.quickTemplate.newPack());

        // Show pack selection dialog
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include quickTemplateSelectPack.html]]]]
        `, 500, 530)).showModal();

        // Pack Selected Handler
        addMessageHandler("selectPack`*", cI=>{
            dialogEngine.closeDialog();

            let i = parseInt(cI.split("`")[1]); // get index from call
            rw.quickTemplate.selectTemplate(un, i); // open select template screen
        });

        // Pack edit handler
        addMessageHandler("editPack`*", cI=>{
            dialogEngine.closeDialog();

            let i = parseInt(cI.split("`")[1]); // get index from call
            rw.quickTemplate.selectTemplate(un, i, true); // open select template screen, true denotes edit
        });
    },

    "selectTemplate" : (un, i, editMode) => {
        if (editMode) un = "(edit mode)";
        let selectedPack = rw.quickTemplate.packs()[i];

        let finalSelectStr = "<hr />"; // final select string
        selectedPack.templates.forEach((template,i)=>{
            finalSelectStr += `
            <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="template-`+ i +`">
                <input type="radio" id="template-`+ i +`" class="mdl-radio__button" name="options" value="`+ i +`">
                <span class="mdl-radio__label">`+ template.title +`</span>
            </label><br>
            <i>`+ template.about +`</i>
            <hr />
            `;
        });

        // Add edit mode handlers
        if (editMode) {
            addMessageHandler("qTdeletePack", ()=>{
                // Confirm
                rw.ui.confirmDialog(`
                Are you sure you want to delete this pack?<br />
                <b>Note:</b> This will only delete the pack from your account. If it is published, this won't unpublish it.
                `,
                    "YES, DELETE.", ()=>{
                        dialogEngine.closeDialog(); // close prompt
                        rw.ui.loadDialog.show("Deleting...");
                        // Now remove at index
                        rw.config.templatePacks.splice(i, 1);
                        // Now refresh and save config
                        rw.info.writeConfig(); // save config, will also refresh
                    },
                    "CANCEL", ()=>{
                        // On cancel just recall
                        dialogEngine.closeDialog();
                        rw.quickTemplate.selectTemplate(un, i, editMode); // reshow, then done!
                    }, 45
                );
            });

            // Handle edit and new

            addMessageHandler("qTNew`*", cI=>{ //create new template
                dialogEngine.closeDialog();

                // Set up vars
                let nTitle = cI.split("`")[1];
                let nAbout = cI.split("`")[2];
                
                // Add to our template array
                rw.config.templatePacks[i].templates.push({
                    "title": nTitle,
                    "about": nAbout,
                    "content": "<!-- Enter your content here! This box fully supports wikitext. Once done, you can check that your template works and looks as expected by clicking the test button. -->"
                });
                // Clear and reload config
                rw.ui.loadDialog.show("Creating...");
                rw.info.writeConfig(true, ()=>{ // save config
                    rw.ui.loadDialog.close();
                    rw.quickTemplate.packStore = []; // clear out packs
                    
                    // Refresh selected pack
                    selectedPack = rw.quickTemplate.packs()[i];
                    // Open editor
                    rw.quickTemplate.editTemplate(i, selectedPack.templates.length - 1); // w pack index and template index
                }); 
            });

            addMessageHandler("qTEdit`*", cI=>{
                // Open editor
                rw.quickTemplate.editTemplate(i, cI.split("`")[1]); // w pack index and template index
            });

            // Publish
            addMessageHandler("qTPublish", ()=>{
                if (selectedPack.packCode == null) { // Pack isn't published
                    rw.ui.confirmDialog("This pack isn't published. If you'd like to let other editors use your pack, click 'Publish Now'",
                    "PUBLISH NOW", ()=>{
                        // Publish new template
                        dialogEngine.closeDialog(); // close dialog
                        rw.quickTemplate.publish(selectedPack, true, i); // true here denotes is new
                    },
                    "CANCEL", ()=>dialogEngine.closeDialog(), 18);

                } else {
                    // Pack is published
                    rw.ui.confirmDialog("This pack is published. If you'd like to update your pack for other editors, click 'Update Now'",
                    "UPDATE NOW", ()=>{
                        // Publish new template
                        dialogEngine.closeDialog(); // close dialog
                        rw.quickTemplate.publish(selectedPack); // just normal update
                    },
                    "CANCEL", ()=>dialogEngine.closeDialog(), 18);
                }
            });
        }
        // END edit mode handlers

        // Now we need to assemble the select screen
        // Show template selection dialog
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include quickTemplateSelectTemplate.html]]]]
        `, 500, 530)).showModal();

        // Continue Handler (not called in edit mode)
        addMessageHandler("qTNext`*", cI2=>{
            let i2 = parseInt(cI2.split("`")[1]); // i from above frame
            rw.quickTemplate.applyTemplate(selectedPack, i2, un); // open apply template screen
        });
    },

    "applyTemplate" : (selectedPack, i2, unI) => {
        let selectedTemplate = selectedPack.templates[i2];
        let contentStr = selectedTemplate.content;
        let un = rw.info.targetUsername(unI);
        let addUnderDate = contentStr.includes("##RW UNDERDATE##");
        // Now we need to assemble inputs for this template


        // Add dialog handlers for preview
        addMessageHandler("generatePreview`*", m=>{
            rw.info.parseWikitext(m.split("`")[1], parsed=>{ // Split to Wikitext and send over to the API to be handled
                dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage({
                    "action": "parseWikiTxt",
                    "result": parsed}, '*'); // push to container for handling in dialog and add https:// to stop image breaking
            });
        });

        // Add handlers for submit
        addMessageHandler("qtDone`*", eD=> {
            let wikiTxtToAdd = atob(eD.split("`")[1]); // params
            
            // MAKE EDIT
            rw.info.addWikiTextToUserPage(rw.info.targetUsername(un), wikiTxtToAdd, addUnderDate, "[[WP:REDWARN/QTPACKS|" + selectedPack.name + " - " + selectedTemplate.title + "]]");
        });

        // Now generate text input code - SYNTAX {{RWTEXT|Label|ID}}
        let finalAdditionalInputs = ``;
        // NORMAL TEXT INPUT
        (m=>{
            if (m != null) { // to stop errors
                m.forEach(match=>{ // for each match to regex
                    let v = match.split("|"); // split at pipe for varibles
                    let label = v[1]; // strip label
                    let id = v[2].split("}")[0]; // strip ID
                    // Now add our textbox
                    finalAdditionalInputs += `
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width:100%">
                        <input class="mdl-textfield__input rwCustomTextInput" type="text" id="${btoa(match)}"> <!-- ID is b64 of what needs to be replaced -->
                        <label class="mdl-textfield__label" for="${btoa(match)}">${label}</label>
                    </div>
                    `;
                });
            }
        })(selectedTemplate.content.match(/{{RWTEXT\|[^}}]*\|[^{{]*}}/g)); // regex here for above function
        
        // Finally, show final submit dialog
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include quickTemplateSubmit.html]]]]
        `, 500, 550)).showModal();
    },

    "newPack" : ()=> {
        // Creates a new pack and saves to config
        // Add toast handler
        addMessageHandler("pushToast`*", m=>rw.visuals.toast.show(m.split('`')[1],false,false,4000));

        addMessageHandler("qTcreateNew`*", cI=>{
            // Handle calls the create new pack
            let packName = cI.split("`")[1];
            rw.config.templatePacks.push(
                {
                    "name" : packName,
                    "createdBy": rw.info.getUsername(),
                    "templates" : []
                }
            ); // add to config
            rw.ui.loadDialog.show("Creating...");
            rw.info.writeConfig(true, ()=>{ // save config
                rw.ui.loadDialog.close();
                rw.quickTemplate.packStore = []; // clear out packs

                // Refresh packs and open selection screen in edit mode
                rw.quickTemplate.selectTemplate("",rw.quickTemplate.packs().length - 1, true); // true here distingishes edit mode
            });
            
        });

        // Finally, show the dialog
        dialogEngine.create(mdlContainers.generateContainer(`
            [[[[include quickTemplateNewPack.html]]]]
        `, 500, 200)).showModal();
    },

    "editTemplate" : (selectedPackI, selectedTemplateI)=>{
        // Used to edit template
        let selectedPack = rw.quickTemplate.packs()[selectedPackI];
        let selectedTemplate = selectedPack.templates[selectedTemplateI];
        let saveHandler = (b64data, callback)=>{ // Save Data handler
            // Set vars
            let title = atob(b64data.split("`")[1]);
            let about = atob(b64data.split("`")[2]);
            let content = atob(b64data.split("`")[3]);
            rw.config.templatePacks[selectedPackI].templates[selectedTemplateI] = {
                "title": title,
                "about": about,
                "content": content
            };
            // Clear and reload config
            rw.ui.loadDialog.show("Saving...");
            rw.info.writeConfig(true, ()=>{ // save config
                rw.ui.loadDialog.close();
                rw.quickTemplate.packStore = []; // clear out packs
                
                // Refresh selected pack
                selectedPack = rw.quickTemplate.packs()[selectedPackI];
                
                // Refresh selected template
                selectedTemplate = selectedPack.templates[selectedTemplateI];

                if (callback != null) callback(); // send callback if set
            }); 
        };

        // Save changes handler
        addMessageHandler("qTSave`*", cI=>{
            saveHandler(cI);
        });

        // Close Editor Handler
        addMessageHandler("qTClose`*", cI=>{
            saveHandler(cI, ()=>dialogEngine.closeDialog());
        });

        // Test Handler
        addMessageHandler("qTTest`*", cI=>{
            saveHandler(cI, ()=> {
                // Open normal apply window with sandbox target
                rw.quickTemplate.applyTemplate(selectedPack, selectedTemplateI, "Sandbox for user warnings");
            });
        });

        // Finally, open the edit template dialog
        dialogEngine.create(mdlContainers.generateContainer(`
            [[[[include quickTemplateEditTemplate.html]]]]
        `, 500, 550)).showModal();
    },

    "publish" : (selectedPack, isNew, selectedPackI)=> { // makes a listing on the WP:REDWARN/QTPACKS page if isnew is set to true
        // Publish new pack
        rw.ui.loadDialog.show("Publishing...");
 
        let packCode = selectedPack.packCode; // get packcode from selected pack
        if (packCode == null) packCode = rw.info.getUsername() + "/" + rw.makeID(10); // Generate a new pack code if not already published

        let packPage = rw.quickTemplate.packCodeToPageName(packCode); // get page to write script to

        // Now, generate script that installs this pack
        let packInstallScript = `
/* <nowiki>
+------------------------------------+
|  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  |
|  Generated automatically.          |
|  DO NOT EDIT THIS FILE OR ADD TO   |
|  YOUR COMMON.JS FILE. DOING SO     |
|  WILL CAUSE SERIOUS ISSUES.        |
+------------------------------------+

Install script (c) Ed. E (User:Ed6767) - license: https://gitlab.com/redwarn/redwarn-web
*/
rw.ui.loadDialog.show("Installing...");
let packSource = JSON.parse(atob("${btoa(JSON.stringify(selectedPack))}")); // Load source from currentpack
rw.config.templatePacks.push(packSource); // Push into config
rw.info.writeConfig(true, ()=>{ // save config
    rw.ui.loadDialog.close();
    rw.quickTemplate.packStore = []; // clear out packs
    
    // Show success dialog
    rw.ui.confirmDialog(
    "Pack installed!",
    "RELOAD PAGE", ()=>window.location.reload(),
    "", ()=>{}, 0);
}); 
// </nowiki>
        `;

        // Script generated, let's continue
        //Commit to script page
        $.post(rw.wikiAPI, {
            "action": "edit",
            "format": "json",
            "token" : mw.user.tokens.get("csrfToken"),
            "title" : packPage,
            "summary" : "Publish Autogenerated QTPack Install [[WP:REDWARN|(RedWarn "+ rw.version +")]]", // summary sign here
            "text": packInstallScript,
            "tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
        }).done(dt => {
            // We done. Check for errors, then callback appropriately
            if (!dt.edit) {
                // Error occured or other issue
                console.error(dt);
                rw.ui.loadDialog.close();
                rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your pack has not been published.");
            } else {
                // Success! 
                if (!isNew) { // if not a new pack, show update done screen and exit
                    rw.loadDialog.close();
                    rw.ui.confirmDialog("Pack updated successfully!", "DONE", ()=>dialogEngine.closeDialog() , "", ()=>{}, 0);
                    return;
                } 
                
                // CONINUES ONLY IF NEW
                // Now make change to config in our preferences re new change
                rw.config.templatePacks[selectedPackI].packCode = packCode; // add packcode to template config
                rw.info.writeConfig(true, ()=>{ // save config
                    rw.quickTemplate.packStore = []; // clear out packs
                    // Now add to QTPacks page
                    $.post(rw.wikiAPI, {
                        "action": "edit",
                        "format": "json",
                        "token" : mw.user.tokens.get("csrfToken"),
                        "title" : "Wikipedia:RedWarn/help/Quick_Template/templates",
                        "summary" : "Publish new pack [[WP:REDWARN|(RedWarn "+ rw.version +")]]", // summary sign here
                        "appendtext": // Add our section wikitxt here
                        `
=== ${selectedPack.name} - by ${selectedPack.createdBy} ===
''No additional info provided - pack owner, please edit this section and add additional info here or your pack may be removed.''
==== Pack Code ====
<code>${packCode}</code>` ,
"tags" : ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
                    }).done(dt2 => {
                        if (!dt.edit) {
                            // Error occured or other issue
                            console.error(dt);
                            rw.ui.loadDialog.close();
                            rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your pack has not been published to the QTPack page, maybe add manually.");
                        } else {
                            // Done! Load QTPack page
                            redirect("https://en.wikipedia.org/wiki/WP:REDWARN/QTPACKS"); // No rw.wikiBase due to lack of page there
                        }
                    });
                }); 
            }
        });
    }
};