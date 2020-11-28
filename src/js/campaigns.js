// Used to show WikiText headers to users, that can be dimissed.
rw.campaigns = {
    "load" : ()=>{ // the only function that handles everything
        // Request campaign info from User:Ed6767/redwarn/campaign.json
        $.getJSON("https://en.wikipedia.org/w/index.php?title=User:Ed6767/redwarn/campaign.json&action=raw&ctype=text/json", c=>{
            if (c.active && rw.config["campaign_"+ c.id] == null) { // only show if active and not dismissed
                // Finally, add a notification above the string
                $("#rwPGIconContainer").append(`
                <div id="rwCampaignTopicon" class="icon material-icons"><span style="cursor: pointer; color:blue;">
                new_releases
                </span></div>
                <div class="mdl-tooltip mdl-tooltip--large" for="rwCampaignTopicon">
                    Announcement from the RedWarn team!
                </div>
                `);

                // Now register that
                for (let item of document.getElementsByClassName("mdl-tooltip")) {
                    rw.visuals.register(item); 
                }

                // Now add onclick handler
                $("#rwCampaignTopicon").click(()=>{
                    // Show dialog with campaign info
                    rw.ui.confirmDialog(c.text,
                    "READ MORE <small>(in new tab)</small>", ()=>{
                        // Open in new tab with campaign details
                        dialogEngine.closeDialog(()=>redirect(c.actionTarget, true));

                        // Save
                        rw.config["campaign_"+ c.id] = "opened"; // setting this value hides this campaign
                        rw.info.writeConfig(true, ()=>{}); // save config
                    },
                    "DISMISS", ()=>{
                        dialogEngine.closeDialog();//this thing turns it off, but will still be shown on page until refresh ext.

                        // Save info
                        rw.config["campaign_"+ c.id] = "dismissed"; // setting this value hides this campaign
                        rw.info.writeConfig(true, ()=>{}); // save config

                        rw.visuals.toast.show("This message will be dismissed next time RedWarn loads.");
                    },c.dialogHeight);
                });
            }
        });  
    }
};