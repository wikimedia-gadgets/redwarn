// Used to handle the new preferences screen in RW16
rw.preferences = {
    "options" : [ // Holds all the preferences in JSON format in order, some options, such as reoganising icons, are templates and can be referred to

        // CARDS HERE
        {
            "cardTitle" : "Appearance",
            "supportingImage" : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Sunset_in_Ashbourne.jpg/1280px-Sunset_in_Ashbourne.jpg",
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

                // Dialog animations 
                "dialogAnimation" : { // config value as title
                    // UI text
                    "optionTitle" : "Dialog Animations",
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

                // Replace references to quick rollback and rollback with QRB and RB 
                "rwRollbackShorten" : { // config value as title
                    // UI text
                    "optionTitle" : "Shorten references to rollback",
                    "supportingText": "Shortern the rollback and quick rollback buttons to RB and QRB respectively. If you're experienced, this can help reduce reading times.",

                    // Config options
                    "options" : { 
                        "Enable" : "enable",
                        "Disable*": "disable"
                    }
                }, // end

                

                // Patrol appearence, we'll just remove, not really sure people change these settings
            }
        },
        {   
            "cardTitle" : "Behaviour",
            "supportingImage" : "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Wilkin_River_close_to_its_confluence_with_Makarora_River%2C_New_Zealand.jpg/1280px-Wilkin_River_close_to_its_confluence_with_Makarora_River%2C_New_Zealand.jpg",
            "content" : {
                // User right-click settings
                "rwDisableRightClickUser" : { // config value as title
                    // UI text
                    "optionTitle" : "Open Quick User action menu with...",
                    "supportingText": "Change the way you open the Quick User action menu. This menu allows you to access features such as warning a user, reporting them and other tools when right-clicking on a user link or signature. Some browsers, such as Firefox, may override the default option of opening the menu on Shift+Right-click.",

                    // Config options
                    "options" : { 
                        "Open when I hold shift and right-click a user link*" : "enable",
                        "Open when I right-click a user link": "Opt2",
                        "Disable the Quick User action menu": "disable"
                    }
                },

                // Warn user automation
                "rwautoLevelSelectDisable" : {
                    "optionTitle" : "Automation",
                    "supportingText": "Enable or disable RedWarn's automation features, such as automatically choosing a warning level and template for you. Please note that in order to reduce abuse, your preference will not be honored unless you are a extended-confirmed user. If you have a legitimate alternate account, <a href='https://en.wikipedia.org/wiki/Wikipedia:Requests_for_permissions/Extended_confirmed' target='_blank'>you can request that the extended-confrimed right be granted to it.</a>",

                    // Config options
                    "options" : { 
                        "Enable*" : "enable",
                        "Disable": "disable"
                    }
                },

                // Warn user advanced by default
                "rwWarnUserAdvanced" : {
                    "optionTitle" : "Automatically open Warn User in advanced mode",
                    "supportingText": "Open RedWarn's warn user dialog in advanced mode by default. Please note you will have to wait for longer for the advanced mode to initalise.",

                    // Config options
                    "options" : { 
                        "Enable" : "enable",
                        "Disable*": "disable"
                    }
                },

                // On rollback completion
                "rwRollbackDoneOption" : {
                    "optionTitle" : "Once a rollback is complete...",
                    "supportingText": "Change what occurs when a rollback is successful. Selecting \"Warn User\" is recommended for most users.",

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
                    "supportingText": "Change what happens when you click the \"Latest Revision\" button, or when you are automatically redirected to the latest revision. Please note that the new tab option may be blocked by your browser pop-up blocker.",

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
                        "Template description (e.g. Vandalism)*" : "disable",
                        "Template name (i.e. uw-vandalism)": "enable"
                    }
                },

                // Rollback method

                "rollbackMethod" : {
                    "optionTitle" : "Rollback method",
                    "supportingText": "Change the way RedWarn reverts edits. Rollback-like uses the undo feature to revert vandalism, similar to Twinkle and other tools. Meanwhile, rollback uses MediaWiki's \"rollback\" link feature. Both of these are identical in use, although rollback is much faster and more reliable. <br/> TL/DR: If you have a rollback-enabled account, using the rollback option is highly recommended. If you do not have a rollback-enabled account and select the latter option, your preference will not be honored.",

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
                    "supportingText": "After accepting revisions choose whether to automatically dismiss the reason prompt and accept them after five seconds. Override this countdown by interacting with the dialog",

                    // Config options
                    "options" : { 
                        "Enable*" : "enable",
                        "Disable": "disable"
                    }
                },

                // auto reject
                "rwEnableReviewAutoRevert" : {
                    "optionTitle" : "Pending change review - auto revert",
                    "supportingText": "After declining revisions choose whether to automatically dismiss the reason prompt and decline them after five seconds. Override this countdown by interacting with the dialog",

                    // Config options
                    "options" : { 
                        "Enable" : "enable",
                        "Disable*": "disable"
                    }
                },

                // Pending changes open MAT
                "rwPendingMATDisable" : {
                    "optionTitle" : "Pending change review - open MAT after reverting",
                    "supportingText": "Choose whether to automatically open the Multiple Action Tool after you have reviewed a change.",

                    // Config options
                    "options" : { 
                        "Enable*" : "enable",
                        "Disable": "disable"
                    }
                },

                // Email send a copy
                "rwEmailCCMe" : {
                    "optionTitle" : "Send me a copy of the emails I send with RedWarn",
                    "supportingText": "Change whether or not you wish to send a copy of the emails you send with RedWarn (such as to Wikimedia Trust and Safety and Oversight) to your email address.",

                    // Config options
                    "options" : { 
                        "Send me a copy*" : "enable",
                        "Don't send me a copy": "disable"
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
            // Add the full card html
            finalHTML += `
            <div class="mdl-card mdl-shadow--2dp" style="width:100%"> <!-- CARD -->
                <div class="mdl-card__title" style="color: #fff;
                height: 176px;
                background: url('${card.supportingImage}') center / cover;">
                    <h2 class="mdl-card__title-text">${card.cardTitle}</h2>
                </div>
                <div class="mdl-card__supporting-text">
                ${(()=>{
                    // Generate the content and return it

                    let fullOptionsStr = ``;

                    // For each config option in card
                    for (const configKey in card.content) {
                        const option = card.content[configKey];
                        // Append our HTML
                        fullOptionsStr += `
                        <span style="font-size: 18px;padding-bottom: 20px;" >${option.optionTitle}</span><br/>
                        <p>${option.supportingText}</p>
                        <div style="height:5px"></div> <!-- SPACER -->
                        <!-- generated options -->
                        ${(()=>{
                            // Generate our options
                            let finalRadioButtonHTML = ``;

                            for (const optText in option.options) {
                                const optID = option.options[optText];
                                const elID = configKey + optID;
                                finalRadioButtonHTML += `
                                <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="${elID}">
                                    <input type="radio" id="${elID}" class="mdl-radio__button" name="${configKey}" value="${optID}" ${(optText.includes("*") ? `checked` : ``)} ${(option.customHTMLOpt != null ? option.customHTMLOpt : ``)}>
                                    <span class="mdl-radio__label">${optText.replace("*", " (default)")}</span>
                                </label>
                                <br/>
                                `;
                            }

                            return finalRadioButtonHTML;
                        })()}
                        <br /><br />
                        `;
                    }

                    return fullOptionsStr; // finally, add it back to the card
                })()}
                </div>
                <div class="mdl-card__actions mdl-card--border"> <!-- save config at the bottom of every card -->
                    <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="saveConfig();">
                        SAVE CHANGES
                    </a>
                </div>
            </div>
            <br/><br/>
            `;
        });

        return finalHTML; // return for preferences pane
    }
};
