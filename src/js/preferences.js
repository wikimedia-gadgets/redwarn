// Used to handle the new preferences screen in RW16
rw.preferences = {
    "options" : [ // Holds all the preferences in JSON format in order, some options, such as reoganising icons, are templates and can be referred to

        // CARDS HERE
        {
            "cardTitle" : "Appearance",
            "supportingImage" : "https://upload.wikimedia.org/wikipedia/commons/d/d3/Golden_Gate_Bridge_at_sunset_1.jpg",
            "content" : { // values here

                // Colour theme
                "colTheme" : { // config value as title
                    // UI text
                    "optionTitle" : "Theme",
                    "supportingText": "Customise RedWarn by setting your theme.",
                    "customHTMLOpt": `onchange="updateColourTheme();"`, // update within the UI for all

                    // Config options
                    "options" : { // human readable: actual value - END HUMAN READABLE WITH * for default option
                        "WikiBlue*" : "blue-indigo",
                        "Sunshine" : "amber-yellow",
                        "Purple Power" : "purple-deep_purple",
                        "RedWarn Minimal": "blue_grey-red",
                        "Lime Forrest": "brown-light_green",
                        "Orange Juice": "orange-deep_orange",
                        "Candy Floss": "pink-red"
                    }
                }, // end

                // Page icon locations 
                "dialogAnimation" : { // config value as title
                    // UI text
                    "optionTitle" : "Dialog Animation",
                    "supportingText": "Change the animation used when a RedWarn dialog opens/closes.",

                    // Config options
                    "options" : { 
                        "Default*" : "default",
                        "Spinny" : "spinny",
                        "Mega" : "mega",
                        "Disable Animation": "none"
                    }
                }, // end

                // Page icon locations 
                "pgIconsLocation" : { // config value as title
                    // UI text
                    "optionTitle" : "Location of RedWarn icons",
                    "supportingText": "Change the location of where the RedWarn page icons appear. Depending on your Skin, your preferences may or may not be honored.",

                    // Config options
                    "options" : { 
                        "After Page Icons*" : "default",
                        "Page Sidebar/Navigation": "sidebar"
                    }
                }, // end


                // TODO: add icons modifiers controls here
                

                // Patrol appearence, we'll just remove, not really sure people change these settings
            }
        },
        {   
            "cardTitle" : "Behaviour",
            "supportingImage" : "https://upload.wikimedia.org/wikipedia/commons/d/d3/Golden_Gate_Bridge_at_sunset_1.jpg",
            "content" : {
                // User right-click settings
                "rwDisableRightClickUser" : { // config value as title
                    // UI text
                    "optionTitle" : "Open quick user action menu with...",
                    "supportingText": "Change the way the menu that allows you to access options such as viewing a users pronouns, warning a user and other tools when you right-click on a user link or signiture. Some browsers, such as Firefox, may override the default option of opening the menu on Shift+Right-click.",

                    // Config options
                    "options" : { 
                        "Open when I hold shift and right-click a user link*" : "enable",
                        "Open when I right-click a user link": "Opt2",
                        "Disable quick user action menu": "disable"
                    }
                },

                // Warn user automation
                "rwautoLevelSelectDisable" : {
                    "optionTitle" : "Automation",
                    "supportingText": "Enable or disable RedWarn's automation features, such as automatically choosing a warning level and template for you. Please note to reduce abuse, if you are not yet extended-confirmed, your preference will not be honored until you reach that level. If you have a legitimate alternate account, <a href='https://en.wikipedia.org/wiki/Wikipedia:Requests_for_permissions/Extended_confirmed'>you can request to be extended-confirmed.</a>",

                    // Config options
                    "options" : { 
                        "Enable*" : "enable",
                        "Disable": "disable"
                    }
                },

                // On rollback completion
                "rwRollbackDoneOption" : {
                    "optionTitle" : "Once a rollback is complete...",
                    "supportingText": "Change what automatically occurs when a rollback is successful. Selecting \"Warn User\" is recommended for most users.",

                    // Config options
                    "options" : { 
                        "Let me choose*" : "none",
                        "Warn User (recommended)": "RWRBDONEwarnUsr",
                        "Write a new user talk page message": "RWRBDONEnewUsrMsg",
                        "Open the Quick Template menu": "RWRBDONEwelcomeUsr",
                        "Go to the latest revision": "RWRBDONEmrevPg"
                    }
                },

                // On rollback completion
                "rwLatestRevisionOption" : {
                    "optionTitle" : "When I am redirected to the latest revision...",
                    "supportingText": "Change what happens when you click the \"Latest Revision\" button, or you are automatically redirected to the latest revision. Please note that the new tab option may be blocked by your browser pop-up blocker.",

                    // Config options
                    "options" : { 
                        "Redirect me in the current tab*" : "stayintab",
                        "Open a new tab for the latest revision": "newtab"
                    }
                },

                // Warn user dialog with
                "rwNoticeListByTemplateName" : {
                    "optionTitle" : "When selecting a user template, let me see...",
                    "supportingText": "Change what you see when selecting a warning template in the warn user dialog. If you choose to see template names by default, the descriptions will show when you hover your mouse over a template name.",

                    // Config options
                    "options" : { 
                        "Template descriptions (e.g. Vandalism)*" : "disable",
                        "Template name (i.e. uw-vandalism)": "enable"
                    }
                },

                // Rollback method

                "rollbackMethod" : {
                    "optionTitle" : "Rollback method",
                    "supportingText": "Change the way RedWarn reverts edits. Rollback-like uses the undo feature to revert vandalism, alike to Twinkle and other tools. Meanwhile, rollback uses MediaWiki's \"rollback\" link feature. Both of these are identical in use, although rollback is much faster and more reliable. <br/> TL/DR: If you have a rollback-enabled account, the using the rollback option is highly recommended. If you do not have a rollback-enabled account and select the latter option, your preference will not be honored.",

                    // Config options
                    "options" : { 
                        "Rollback-like (slower)*" : "rollbackLike",
                        "Rollback (faster, requires permissions)": "rollback"
                    }
                },

                // Pending changes
                "rwDisablePendingChanges" : {
                    "optionTitle" : "Pending change review",
                    "supportingText": "Choose whether to use RedWarn or the built-in tools for reviewing pending changes.",

                    // Config options
                    "options" : { 
                        "Use RedWarn*" : "enable",
                        "Use built-in tools": "disable"
                    }
                },

                // Pending changes auto accept
                "rwDisableReviewAutoAccept" : {
                    "optionTitle" : "Pending change review - auto accept",
                    "supportingText": "Choose wheter to automatically dismiss the reason prompt and accept revisions after five seconds. Override this countdown by interacting with the dialog",

                    // Config options
                    "options" : { 
                        "Enable*" : "enable",
                        "Disable": "disable"
                    }
                },

                // auto reject
                "rwEnableReviewAutoRevert" : {
                    "optionTitle" : "Pending change review - auto revert",
                    "supportingText": "Choose wheter to automatically dismiss the reason prompt and revert revisions after five seconds. Override this countdown by interacting with the dialog",

                    // Config options
                    "options" : { 
                        "Enable" : "enable",
                        "Disable*": "disable"
                    }
                },

                // developer safe mode
                "debugMode" : {
                    "optionTitle" : "Developer safe mode",
                    "supportingText": "This option allows developers to test RedWarn safely, and will only work on a RedWarn script provided by a development sever. <b>IMPORTANT:</b> To safely disable debug mode, open the debug menu and enable production behaviour.",

                    // Config options
                    "options" : { 
                        "Enable" : "enable",
                        "Disable*": "disable"
                    }
                }
            }
        }
    ], // about card included by default

    "generateHTML" : ()=>{
        // Generate HTML for UI to use
        let finalHTML = ``;
        rw.preferences.options.forEach(card=>{



            // Finally, add the full card html
            finalHTML += ``;
        });

        return finalHTML; // return for preferences pane
    }
};