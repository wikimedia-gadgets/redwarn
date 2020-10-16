/**
 * Handles rendering top icons/menu
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
        "showsOnUserPages": true,
        "showsOnUneditablePages": false,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    }, 
    {
        "title": "Quick Template",
        "shortTitle": "Template",
        "icon": "library_add", // material icon
        "callback": ()=>rw.quickTemplate.openSelectPack(), // when clicked
        "showsOnUserPages": true,
        "showsOnUneditablePages": false,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    }, 
    {
        "title": "Warn User",
        "shortTitle": "Warn",
        "icon": "report", // material icon
        "callback": ()=>rw.ui.beginWarn(), // when clicked
        "showsOnUserPages": true,
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
        "showsOnUserPages": true,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },

    {
        "title": "Alert on Change",
        "shortTitle": "Alert",
        "icon": "notification_important", // material icon
        "callback": ()=>rw.info.changeWatch.toggle(), // when clicked
        "showsOnUserPages": true,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },

    {
        "title": "Latest Revision",
        "shortTitle": "Latest",
        "icon": "watch_later", // material icon
        "callback": ()=>rw.info.isLatestRevision(mw.config.get('wgRelevantPageName'), 0, ()=>{}), // when clicked
        "showsOnUserPages": true,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    },
    
    {
        "title": "More Options",
        "shortTitle": "More",
        "icon": "more_vert", // material icon
        "callback": ()=>rw.ui.openExtendedOptionsDialog(), // when clicked
        "showsOnUserPages": true,
        "showsOnUneditablePages": true,
        "colorModifier": null, // if not empty will be used for things like turning notif bell green, for this would have to call a redraw func unless we add a defined class for each
        "enabled": true // to show in main screen or more options screen
    }


    // MORE OPTIONS DEFAULTS STAY IN MORE OPTIONS - NO WAY TO MOVE THEM OUT OR CHANGE ORDER

  ],

  "generateHTML" : ()=>{
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
        if (icon.enabled && (((icon.showsOnUserPages && pageIsUserPage && pageIsUserPage && pageIsEditable) || (icon.showsOnUneditablePages && !pageIsEditable)))) finalHTML += `
        <div id="${iconID}" class="icon material-icons"><span style="cursor: pointer;">${icon.icon}</span></div>
        <div class="mdl-tooltip mdl-tooltip--large" for="${iconID}">
            ${icon.title}
        </div>
        `;
    });

    return finalHTML;
  },

  "addHandlers" : ()=>{ // add handlers once icons have been rendered
    if (mw.config.get("wgNamespaceNumber") < 0) return; // if on special page, skip
    const pageIsUserPage = mw.config.get("wgRelevantPageName").includes("User:") || mw.config.get("wgRelevantPageName").includes("User_talk:");
    const pageIsEditable = mw.config.get("wgIsProbablyEditable");
    rw.topIcons.icons.forEach((icon, i)=>{
        // Generate an ID for click handlers and tooltip
        const iconID = "rwTopIcon"+ i;
        // Add click handler
        if (icon.enabled && (((icon.showsOnUserPages && pageIsUserPage && pageIsUserPage && pageIsEditable) || (icon.showsOnUneditablePages && !pageIsEditable)))) 
        $(`#${iconID}`).click(icon.callback);
    });
  }
};