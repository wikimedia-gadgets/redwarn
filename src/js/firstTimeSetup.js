/**
 * rw.firstTimeSetup provides a welcome and first time setup screen for new users
 * @class rw.firstTimeSetup
 */
rw.firstTimeSetup = {
    /**
     * Launches the first time setup wizard
     * @method launch
     * @extends rw.firstTimeSetup
     */
    "launch": () => {
        addMessageHandler("config`*", rs => { // On config change
            // New config recieved
            let config = JSON.parse(deserialize(rs.split("`")[1])); // b64 encoded json string
            //Write to our config
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    const element = config[key];
                    rw.config[key] = element; // add or change value
                }
            }

            // Push change
            rw.ui.loadDialog.show("Saving...");
            rw.info.writeConfig(false);
        });

        addMessageHandler("resetConfig", rs => {
            // Reset config received, set config back to default
            rw.info.getConfig(() => { }, true); // TRUE HERE MEANS RESET TO DEFAULT
        });

        // Add load new theme handler
        addMessageHandler("newThemeDialog", () => rw.ui.loadDialog.show("Changing theme..."));
        addMessageHandler("loadDialogClose", () => rw.ui.loadDialog.close());

        // Add reload handler
        addMessageHandler("reload", () => window.location.reload());

        // Lock scrolling
        dialogEngine.freezeScrolling();

        // Open preferences page with no padding, full screen
        dialogEngine.create(mdlContainers.generateContainer(`[[[[include firstTimeSetup.html]]]]`, window.innerWidth, window.innerWidth, true), true).showModal(); // TRUE HERE MEANS NO PADDING.
    }
};
