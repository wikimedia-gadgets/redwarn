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
                "pgIconsLocation" : { // config value as title
                    // UI text
                    "optionTitle" : "Location of RedWarn icons",
                    "supportingText": "Change the location of where the RedWarn page icons appear. Depending on your Skin, your preferences may or may not be honored.",

                    // Config options
                    "options" : { // human readable: actual value - END HUMAN READABLE WITH * for default option
                        "After Page Icons*" : "default",
                        "Page Sidebar/Navigation": "sidebar"
                    }
                }, // end

                // Page icon locations 
                "dialogAnimation" : { // config value as title
                    // UI text
                    "optionTitle" : "Dialog Animation",
                    "supportingText": "Change the animation used when a RedWarn dialog opens/closes.",

                    // Config options
                    "options" : { // human readable: actual value - END HUMAN READABLE WITH * for default option
                        "Default*" : "default",
                        "Spinny" : "spinny",
                        "Mega" : "mega",
                        "Disable Animation": "none"
                    }
                }, // end
            }
        }
    ]
};