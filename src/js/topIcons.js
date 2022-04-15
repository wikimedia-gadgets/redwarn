/**
 * Handles rendering top icons/menu. See also init.js, specifically rw.init.pageIcons()
 * @class rw.topIcons
 */
rw.topIcons = {
  "icons" : [ // array of availible icons - CHANGING ORDER WILL MESS UP CONFIGS

    // Userpage only icons
    {
        "title": "New Message",
        "shortTitle": "Message",
        "icon": "send", // material icon
        "callback": ()=>rw.ui.newMsg(), // when clicked
        "showsOnlyOnUserPages": true,
        "showsOnUneditablePages": false,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    }, 
    {
        "title": "Quick Template",
        "shortTitle": "Template",
        "icon": "library_add", // material icon
        "callback": ()=>rw.quickTemplate.openSelectPack(), // when clicked
        "showsOnlyOnUserPages": true,
        "showsOnUneditablePages": false,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    }, 
    {
        "title": "Warn User",
        "shortTitle": "Warn",
        "icon": "report", // material icon
        "callback": ()=>rw.ui.beginWarn(), // when clicked
        "showsOnlyOnUserPages": true,
        "showsOnUneditablePages": false,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },
    // Report user has moved elsewhere, original form still exists but is now under more options

    // On any page
    {
        "title": "Manage Page Protection",
        "shortTitle": "Protect",
        "icon": "lock", // material icon
        "callback": ()=>rw.pageProtect.open(), // when clicked
        "showsOnlyOnUserPages": false,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },

    {
        "title": "Alert on Change",
        "shortTitle": "Alert",
        "icon": "notification_important", // material icon
        "callback": ()=>rw.info.changeWatch.toggle(), // when clicked
        "showsOnlyOnUserPages": false,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true, // to show in main screen or more options screen
        "className": "rwSpyIcon" // for adding custom classes, to modify change this and the colour modifier
    },

    {
        "title": "Latest Revision",
        "shortTitle": "Latest",
        "icon": "watch_later", // material icon
        "callback": ()=>rw.info.isLatestRevision(mw.config.get('wgRelevantPageName'), 0, ()=>{}), // when clicked
        "showsOnlyOnUserPages": false,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },
    
    {
        "title": "More Options",
        "shortTitle": "More",
        "icon": "more_vert", // material icon
        "callback": ()=>rw.ui.openExtendedOptionsDialog(), // when clicked
        "showsOnlyOnUserPages": false,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },


    // MORE OPTIONS DEFAULTS STAY IN MORE OPTIONS - NO WAY TO MOVE THEM OUT OR CHANGE ORDER


    // HIDDEN BY DEFAULT

    // RPM STATS
    {
        "title": "Vandalism Statistics",
        "shortTitle": "Stats",
        "icon": "insights", // material icon
        "callback": ()=>redirect("https://redwarn.toolforge.org/tools/rpm/", true), // when clicked
        "showsOnlyOnUserPages": false,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": false // to show in main screen or more options screen
    }
  ],

  "generateHTML" : arrayMode=>{ // ARRAY MODE RETURNS AN ORDERED ARRAY OF [{txt: shortTitle + class, id: "rw-topiconi"}]
    if (mw.config.get("wgNamespaceNumber") < 0) return ``; // if on special page, skip

    // Check if more options is disabled, if so, open a dialog to prompt if user wishes to keep this option
    if ((rw.topIcons.icons.find(o => o.title === 'More Options').enabled == false) && rw.config.rwMORemovedWarning == null) {
        rw.ui.confirmDialog(`<b>Warning:</b> It looks like you've removed the "More Options" button from your favourites.
        This could make areas of RedWarn, such as RedWarn preferences and other features inaccessible without scripting knowledge,
        or blanking your RedWarn config. Would you like to open RedWarn preferences to correct this irregularity, or keep your changes?`,
            "OPEN REDWARN PREFERENCES", ()=>{
                dialogEngine.closeDialog(()=>rw.ui.openPreferences());
            },
            "<small>KEEP, I UNDERSTAND THE RISKS</small>", ()=>{
                dialogEngine.closeDialog();//this thing turns it off
                rw.visuals.toast.show("This dialog will not show again.");//display a toast
                rw.config.rwMORemovedWarning = "dismissed"; // hides the dialog in future
                rw.info.writeConfig(true, ()=>{}); // save config
                
            },80);
    }

    // Generate HTML from icons and user config
    let finalHTML = ``;
    let finalArr = [];
    const pageIsUserPage = mw.config.get("wgRelevantPageName").includes("User:") || mw.config.get("wgRelevantPageName").includes("User_talk:");
    const pageIsEditable = mw.config.get("wgIsProbablyEditable");
    // Now generate the HTML
    rw.topIcons.icons.forEach((icon, i)=>{
        // Generate an ID for click handlers and tooltip
        const iconID = "rwTopIcon"+ i;
        // if icon enabled and (icon shows on user page and page is userpage and is editable, or icon shows on uneditable pages and page isn't editable)
        // FOR NORMAL ICONS ONLY, other twinkle style menu handled elsewhere
        if ( // to think: maybe split in to logic function so we don't have fragmentation?
            (
                icon.enabled && ( // if icon.enabled AND...
                    (icon.showsOnlyOnUserPages && pageIsUserPage) || // icon shows only on userpages AND page is user page, OR...
                    (pageIsEditable && !icon.showsOnlyOnUserPages) || // page is editable, AND the icon does not show only on user pages, OR...
                    (!pageIsEditable && icon.showsOnUneditablePages) // page is NOT editable, AND the icon shows on uneditable pages
                )
            )
        ) { // then...
            if (arrayMode !== true) { // if array mode not explictly set, we generate HTML
                finalHTML += `
                <div id="${iconID}" class="icon material-icons"><span style="cursor: pointer;${icon.colorModifier == null ? `` : `color:`+ icon.colorModifier}" class="${icon.className}">
                ${icon.icon}
                </span></div>
                <div class="mdl-tooltip mdl-tooltip--large" for="${iconID}">
                    ${icon.title}
                </div>
                `;
            } else {
                // Arraymode, add to the array
                finalArr.push({
                    "txt": icon.shortTitle,
                    "id": iconID
                });
            }
        }
    });

    return (arrayMode === true ? finalArr : finalHTML); // return final array or final html appropriately
  },

  "addHandlers" : ()=>{ // add handlers once icons have been rendered
    if (mw.config.get("wgNamespaceNumber") < 0) return; // if on special page, skip
    if (mw.config.get("wgPageName") === "Main_Page") return; // if on Main Page, skip
    const pageIsUserPage = mw.config.get("wgRelevantPageName").includes("User:") || mw.config.get("wgRelevantPageName").includes("User_talk:");
    const pageIsEditable = mw.config.get("wgIsProbablyEditable");
    rw.topIcons.icons.forEach((icon, i)=>{
        // Generate an ID for click handlers and tooltip
        const iconID = "rwTopIcon"+ i;
        // Add click handler
        if ((icon.enabled && ((icon.showsOnlyOnUserPages && pageIsUserPage) || (pageIsEditable && !icon.showsOnlyOnUserPages) || (!pageIsEditable && icon.showsOnUneditablePages)))) {
            $(`#${iconID}`).click(icon.callback);
        }
    });
  },

  "getHiddenHTML" : ()=> { // for more options menu, also registers handlers
    if (mw.config.get("wgNamespaceNumber") < 0) return ``; // if on special page, skip

    // Generate HTML from icons and user config
    let finalHTML = ``;
    const pageIsUserPage = mw.config.get("wgRelevantPageName").includes("User:") || mw.config.get("wgRelevantPageName").includes("User_talk:");
    const pageIsEditable = mw.config.get("wgIsProbablyEditable");
    // Now generate the HTML
    rw.topIcons.icons.forEach((icon, i)=>{
        // Generate an ID for click handlers and tooltip
        const iconID = "rwTopIcon"+ i;
        // if icon enabled and (icon shows on user page and page is userpage and is editable, or icon shows on uneditable pages and page isn't editable)
        // FOR NORMAL ICONS ONLY, other twinkle style menu handled elsewhere
        if ((!icon.enabled && ((icon.showsOnlyOnUserPages && pageIsUserPage) || (pageIsEditable && !icon.showsOnlyOnUserPages) || (!pageIsEditable && icon.showsOnUneditablePages))) && icon.title != "More Options") {
            finalHTML += `
                <div class="mdl-button mdl-js-button" style="width:100%; text-align: left;${icon.colorModifier == null ? `` : `color:`+ icon.colorModifier}" onclick="window.parent.postMessage('${iconID}', '*');">
                    <span class="material-icons" style="padding-right:20px">${icon.icon}</span>${icon.title}
                </div>
                <hr style="margin:0"/>
            `;

            // Now add click handler, close dialog then callback
            addMessageHandler(iconID, ()=>dialogEngine.closeDialog(icon.callback));
        }
    });

    return finalHTML;
  }
};
