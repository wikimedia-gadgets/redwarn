// only enabled when debug mode is on
rw.debugMenu = {
    "init": ()=>{
        if (rw.config.debugMode != "enable") {
            // Only init if debug mode specifically enabled
            rw.debugMenu = undefined;
            rw.debugMode = false;
            return;
        }
        // Add debug icons
        rw.topIcons.icons.push({
            "title": "Debug Menu",
            "shortTitle": "Debug",
            "icon": "bug_report", // material icon
            "callback": ()=>{
                try {
                    rw.debugMenu.open();
                } catch (error) {
                    alert("The debug menu isn't available in production mode");
                }
            }, // when clicked
            "showsOnlyOnUserPages": false,
            "showsOnUneditablePages": true,
            "colorModifier": "red", // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
            "enabled": true // to show in main screen or more options screen
        },
        
        {
            "title": "Go to User Warning sandbox",
            "shortTitle": "UWSB",
            "icon": "person_outline", // material icon
            "callback": ()=>{
                redirect("https://en.wikipedia.org/wiki/User_talk:Sandbox_for_user_warnings");
            }, // when clicked
            "showsOnlyOnUserPages": false,
            "showsOnUneditablePages": true,
            "colorModifier": "blue", // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
            "enabled": true // to show in main screen or more options screen
        }
        );
    },

    "open": ()=>{
        dialogEngine.create(`[[[[include debugMenu.html]]]]`).showModal();
    }
};