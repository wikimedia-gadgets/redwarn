/**
 * rw.firstTimeSetup provides a welcome and first time setup screen for new users
 * @class rw.firstTimeSetup
 */
rw.firstTimeSetup = {
    /**
     * Launches the first time setup wizzard
     * @method launch
     * @extends rw.firstTimeSetup
     */
    "launch" : ()=>{
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

        // Add load new theme handler
        addMessageHandler("newThemeDialog", ()=>rw.ui.loadDialog.show("Changing theme..."));
        addMessageHandler("loadDialogClose", ()=>rw.ui.loadDialog.close());

        // Lock scrolling
        dialogEngine.freezeScrolling();

        // Open preferences page with no padding, full screen
        dialogEngine.create(mdlContainers.generateContainer(`
        [[[[include firstTimeSetup.html]]]]
        `, window.innerWidth, window.innerHeight, true), true).showModal(); // TRUE HERE MEANS NO PADDING.
    }
};