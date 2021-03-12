// (c) Ed.E and contributors 2020/2021

if (rw != null) {
    // Double init, rm the old version and hope for the best
    rw = {};
    mw.notify("Warning! You have two versions of RedWarn installed at once! Please edit your common.js or skin js files to ensure that you only use one instance to prevent issues.");
}

/**
* rw is the main class for RedWarn and holds the vast majority of its core code, properties and functions. See other classes for further documentation.
*
* @class rw
*/
var rw = {
    // UPDATE THIS DATA FOR EVERY VERSION!

    /**
     * Defines the version of this build of RedWarn. This is shown in, and is also checked to see if an update has occured.
     * For devlopment versions, you MUST append "dev" to this value to distingish that it is a devlopment build.
     *
     * @property version
     * @type {string}
     * @extends rw
     */
    "version": "16.1", // don't forget to change each version!

    /**
     * Defines a brief summary of this version of RedWarn. This is shown in both update notices, and a card in preferences.
     * To prevent UI issues, it must be kept brief.
     *
     * @property versionSummary
     * @type {string}
     * @extends rw
     */
    "versionSummary": `
    RedWarn 16.1 brings updates to the warning system, and additional features and bug fixes.
    `,

    /**
     * This varible is defined by the magic word "[[[[BUILDINFO]]]]", which the build script will replace with information
     * regarding the time, file location and computer info such as username, computer name and OS of this build.
     * Shown in preferences only.
     * @property buildInfo
     * @type {string}
     * @extends rw
     */
    // ADDED BY BUILD SCRIPT
    "buildInfo": `[[[[BUILDINFO]]]]`,

    // DEBUG MODE - enabled by default on debug server
    "debugMode": `[[[[DEBUG]]]]`,

    // Now edited by us again
    /**
     * Defines the logo used in parts of RedWarn's UI. Please note that removing or changing this without adding attribution elsewhere may be a violation of RedWarn's license.
     * @property logoHTML
     * @type {string}
     * @extends rw
     * @default '<span style="font-family:Roboto;font-weight: 300;text-shadow:2px 2px 4px #0600009e;"><span style="color:red">Red</span>Warn</span>'
     */
    "logoHTML": `<span style="font-family:Roboto;font-weight: 300;text-shadow:2px 2px 4px #0600009e;"><span style="color:red">Red</span>Warn</span>`, // HTML of the logo

    /**
     * Defines a short version of the logo used in parts of RedWarn's UI. Please note that removing or changing this without adding attribution elsewhere may be a violation of RedWarn's license.
     * @property logoShortHTML
     * @type {string}
     * @extends rw
     * @default '<span style="font-family:Roboto;font-weight: 300;text-shadow:2px 2px 4px #0600009e;"><span style="color:red">R</span>W</span>'
     */
    "logoShortHTML": `<span style="font-family:Roboto;font-weight: 300;text-shadow:2px 2px 4px #0600009e;"><span style="color:red">R</span>W</span>`, // Short HTML of the logo


    /**
     * Returns a MediaWiki signiature
     * @method sign
     * @returns {string} MediaWiki sign (~~~~)
     * @extends rw
     */

    "sign": () => { return atob("fn5+fg==") }, // we have to do this because mediawiki will swap this out with devs sig.

    // Not really used, but keep for now just in case
    "welcome": () => { return atob("e3tzdWJzdDpXZWxjb21lfX0="); }, // welcome template
    "welcomeIP": () => { return atob("e3tzdWJzdDp3ZWxjb21lLWFub259fQ=="); }, // welcome IP template

    /**
     * Returns a shared IP advice template - please note that is is likely to be depreciated in the near future
     * @returns {string} shared IP advice template
     * @method sharedIPadvice
     * @extends rw
     */
    "sharedIPadvice": () => { return atob("XG46e3tzdWJzdDpTaGFyZWQgSVAgYWR2aWNlfX0="); }, // if this is a shared...

    // Wiki automated config

    /**
     * The base URL of the MediaWiki instance (wgServer), e.g. //en.wikipedia.org
     * @property wikiBase
     * @type {string}
     * @extends rw
     */
    "wikiBase": mw.config.get("wgServer"), // mediawiki base URL (i.e. //en.wikipedia.org)

    /**
     * The URL of the index.php script of this MediaWiki instance (e.g. //en.wikipedia.org/w/index.php)
     * @property wikiIndex
     * @type {string}
     * @extends rw
     */
    "wikiIndex": mw.config.get("wgServer") + mw.config.get("wgScript"), // mediawiki index.php (i.e. //en.wikipedia.org/w/index.php)

    /**
     * The URL of the api.php script of this MediaWiki instance (e.g. //en.wikipedia.org/w/api.php)
     * @property wikiAPI
     * @type {string}
     * @extends rw
     */
    "wikiAPI": mw.config.get("wgServer") + mw.config.get("wgScriptPath") + "/api.php", // mediawiki API path  (i.e. //en.wikipedia.org/w/api.php)

    /**
     * The ID of this MediaWiki instance (e.g. enwiki) - this may not always be defined!
     * @property wikiAPI
     * @type {string}
     * @extends rw
     */
    "wikiID": mw.config.get("wgWikiID"),


    /**
     * Generates a random alphanumerical string of the specified length
     *
     * @param {number} length
     * @returns {string}
     * @method makeID
     * @extends rw
     */
    "makeID": length => {
        // Generates a random string
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    /**
     * rw.visuals contains shortcuts to initalising and controlling visual elements, including adding libaries
     * @class rw.visuals
     */
    "visuals": {
        /**
         * Load an external resource in a blocking manner. Inserts to head by default.
         *
         * @param type {"css"|"js"} The type of resource to load
         * @param src {string} Link to the resource to load
         * @param target {Element} The element to push to
         * @method init
         * @extends rw.visuals
         */
        "blockingLoad": async (type, src, target = document.head) => {
            var resolver = null, rejector = null;
            var loadPromise = new Promise((res, rej) => {
                resolver = res;
                rejector = rej;
            });
            if (type === "js") {
                var script = document.createElement("script");
                script.onload = resolver;
                script.src = src;
                target.appendChild(script);

                await loadPromise;
                return script;
            } else if (type === "css") {
                var style = document.createElement("link");
                style.setAttribute("rel", "stylesheet");
                style.setAttribute("type", "text/css");
                style.onload = resolver;
                style.onerror = rejector;
                style.href = src;
                target.appendChild(style);

                await loadPromise;
                return style;
            } else {
                var style = document.createElement("link");
                style.setAttribute("rel", type);
                style.onload = resolver;
                style.onerror = rejector;
                style.href = src;
                target.appendChild(style);

                await loadPromise;
                return style;
            }
        },
        /**
         * Adds RedWarn's styles, libaries and other elements to the current page and waits for them to load, then excecutes the callback function
         *
         * @param {function} callback
         * @method init
         * @extends rw.visuals
         */
        "init": async (callback) => {
            // Welcome message
            console.log("RedWarn " + rw.version + " - (c) 2021 RedWarn Contributors");

            // Load in required resources (resources that have to be loaded prior to element renders)

            await rw.visuals.blockingLoad("css", "https://redwarn.toolforge.org/cdn/css/materialicons.css");
            if (document.fonts) await document.fonts.load('24px "Material Icons"');

            // Load MDL and everything needed, then callback when all loaded
            $('head').append(`
                <link rel="stylesheet" href="https://redwarn.toolforge.org/cdn/css/jqueryContextMenu.css">
                <script src="https://redwarn.toolforge.org/cdn/js/jquery-contextmenu.js"></script>
                <script src="https://redwarn.toolforge.org/cdn/js/jquery-ui-position.js"></script>
                <link rel="stylesheet" href="https://redwarn.toolforge.org/cdn/css/materialicons.css">
                <script src="https://redwarn.toolforge.org/cdn/js/dialogPolyfill.js"></script> <!-- firefox being dumb -->
                <script src="https://redwarn.toolforge.org/cdn/js/mdl.js" id="MDLSCRIPT"></script>
                <script src="https://redwarn.toolforge.org/cdn/js/mdlLogic.js"></script> <!-- rw specific MDL logic fixes -->
                <script src="https://redwarn.toolforge.org/cdn/js/diff.js"></script> <!-- diff.js -->
                <!-- Roboto Font -->
                <link href="https://tools-static.wmflabs.org/fontcdn/css?family=Roboto:100,100italic,300,300italic,400,400italic,500,500italic,700,700italic,900,900italic&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese" rel="stylesheet">

                <!-- MDL AND CONTEXT MENU STYLES -->
                <style>
                /* Context menus */
                .context-menu-list {
                    list-style-type: none;
                    list-style-image: none;
                }

                /* MDL */
                ${rwStyle}
                </style>
            `); // Append required libaries to page

            // OOui
            mw.loader.load('oojs-ui-windows');

            // Show redwarn only spans
            $(".RedWarnOnlyVisuals").show();

            // Hide no redwarn spans
            $(".NoRedWarnVisuals").hide();

            // RedWarn user highlighter
            if (mw.config.get('wgArticleId') === 64182209) { // Wikipedia talk:RedWarn
                $("a[href='/wiki/User:Sportzpikachu'],[href='/wiki/User:Ed6767'],[href='/wiki/User:Chlod'],[href='/wiki/User:Berrely'],[href='/wiki/User:Leijurv'],[href='/wiki/User:Asartea'],[href='/wiki/User:Prompt0259']").each(function (i) {
                    let emoji = document.createElement("img");
                    emoji.id = `rwHighlighter_${i}`;
                    emoji.src = "//upload.wikimedia.org/wikipedia/commons/thumb/9/98/NotoemojiCowboy.png/48px-NotoemojiCowboy.png";
                    emoji.setAttribute("decoding", "async");
                    emoji.setAttribute("srcset", "//upload.wikimedia.org/wikipedia/commons/thumb/9/98/NotoemojiCowboy.png/72px-NotoemojiCowboy.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/9/98/NotoemojiCowboy.png/96px-NotoemojiCowboy.png 2x");
                    emoji.alt = "RW";
                    emoji.className = "rwHighlighter";

                    let tooltip = document.createElement("div");
                    tooltip.setAttribute("for", `rwHighlighter_${i}`);
                    tooltip.className = "mdl-tooltip";
                    tooltip.textContent = "Official RedWarn Team";

                    $(this).append("&nbsp;").append(emoji, tooltip);
                    waitForMDLLoad(() => rw.visuals.register(tooltip));
                });
            }

            // wait for load
            waitForMDLLoad(callback);
        },

        /**
         * Registers a DOM element with Material Design Lite. Equivalent to componentHandler.upgradeElement(c)
         *
         * @param {object} c MDL DOM element to register
         * @method register
         * @extends rw.visuals
         */
        "register": c => {
            // Register a componant with MDL
            componentHandler.upgradeElement(c);
        },

        /**
         * Adds RedWarns control icons to the top icon or sidebar space depending on skin and preferences.
         *
         * @method pageIcons
         * @extends rw.visuals
         */
        "pageIcons": () => {
            // If debug mode, enable debug menu
            if (rw.debugMenu != null) rw.debugMenu.init(); // will be undefined if not

            // Thanks to User:Awesome Aasim for the suggestion and some sample code.
            try {
                // Possible icons locations: default (page icons area) or sidebar - possible link location, dropdown and toplinks
                let iconsLocation = rw.config.pgIconsLocation ? rw.config.pgIconsLocation : "default"; // If set in config, use config

                let pageIconHTML = "Sorry, an error occured loading page icons. Please report this to the RedWarn team ASAP."; // just in case something goes wrong

                if (iconsLocation == "default" || iconsLocation == "sidebar") {
                    // We only need to generate IF we need the icons

                    pageIconHTML = "<div id='rwPGIconContainer'>"; // obj it is appended to

                    // Add to pageIconHTML from topIcons config
                    pageIconHTML += rw.topIcons.generateHTML();

                    pageIconHTML += "</div>"; // close contianer
                }

                if (iconsLocation == "default") {
                    try {
                        $(".mw-indicators").before(pageIconHTML); // Append our icons to the page icons with spacing
                        $("#rwPGIconContainer").addClass("rw--upgraded");
                    } catch (error) {
                        console.error(error);
                        // Incompatible theme, use sidebar instead
                        iconsLocation = "sidebar";
                    }
                }
                // delib. not else if
                if (iconsLocation == "sidebar") {
                    // Add our icons to the sidebar (w/ all theme compatibility)
                    (_t => {
                        $('<div class="sidebar-chunk" id="redwarn"><h2><span>RedWarn</span></h2><div class="sidebar-inner">' + _t + '</div></div>').prependTo("#mw-site-navigation");
                        $('<div class="portal" role="navigation" id="redwarn" aria-labelledby="p-redwarn-label">' + _t + '</div>').prependTo("#mw-panel");
                        $('<div role="navigation" class="portlet generated-sidebar" id="redwarn" aria-labelledby="p-redwarn-label">' + _t + '</div>').prependTo("#sidebar");
                        $('<div class="portlet" id="redwarn">' + _t + '</div>').prependTo("#mw_portlets");
                        $('<ul id="redwarn">' + _t + '</ul>').appendTo("#mw-mf-page-left"); //minerva
                        $("#p-navigation").prependTo("#mw-panel");
                        $("#p-search").prependTo("#quickbar");
                        $('#p-logo').prependTo("#mw-site-navigation");
                        $('#p-logo').prependTo("#mw-panel");
                        $('#p-logo').prependTo("#sidebar");
                        $('#p-logo').prependTo("#mw_portlets");
                        $('ul.hlist:first').appendTo('#mw-mf-page-left');

                        // Add click event handlers
                        $(document).click(e => {
                            if ($(e.target).closest("#redwarn").length == 0) {
                                $("#redwarn").removeClass("dropdown-active");
                            }
                        });
                        (h => {
                            $($('.sidebar-chunk > h2:contains("RedWarn")')[0]).click(e => h(e)); // collapsed
                            $($('.sidebar-inner > #redwarn-label')[0]).click(e => h(e)); // visible
                        })(e => { // Handler
                            e.preventDefault();
                            if ($("#redwarn").hasClass("dropdown-active")) {
                                $("#redwarn").removeClass("dropdown-active");
                            } else {
                                $("#redwarn").toggleClass("dropdown-active");
                            }
                        });
                        // We done
                    })(` <!-- hand in pageIconHTML and some extra gubbins to become _t -->
                        <h3 id="redwarn-label" lang="en" dir="ltr">RedWarn tools</h3><div class="mw-portlet-body body pBody" id="redwarn-tools">
                        ${pageIconHTML}
                        </div>
                    `);
                } // RW16.1
                else if (iconsLocation == "dropdown") {
                    // Twinkle style dropdown, no tooltips, normally in "MORE" menu
                    rw.topIcons.generateHTML(true).forEach(link => {
                        mw.util.addPortletLink(
                            'p-cactions',
                            '#',
                            "RW:" + link.txt,
                            link.id,
                            null, null, // ones we don't need
                            '#pt-preferences' // put before preferences
                        );
                    });

                }
                else if (iconsLocation == "toplinks") {
                    // Top where sign in logout etc is

                    // Get HTML with array mode on then for each call MW to add
                    rw.topIcons.generateHTML(true).forEach(link => {
                        mw.util.addPortletLink(
                            'p-personal',
                            '#',
                            link.txt,
                            link.id,
                            null, null, // ones we don't need
                            '#pt-preferences' // put before preferences
                        );
                    });
                }
            } catch (error) {
                // Likely invalid theme, not all themes can use default
                console.error(error);
                mw.notify("RedWarn isn't compatible with this theme, or another error occured when loading control buttons.");
                return; // Exit
            }

            // Now register all tooltips
            for (let item of document.getElementsByClassName("mdl-tooltip")) rw.visuals.register(item);

            // Now Register menu mdl-menu
            for (let item of document.getElementsByClassName("mdl-menu")) rw.visuals.register(item);

            // Now register handlers
            rw.topIcons.addHandlers();

            // That's done :)
        }
    },

    /**
     * RedWarn's recent changes interface
     * @class rw.recentChanges
     */
    "recentChanges": {
        /**
         * Opens RedWarn's patrol interface
         *
         * @param {string} filters MediaWiki API filters, i.e. userExpLevel=unregistered%3Bnewcomer&hidebots=1&hidecategorization=1
         * @method openPage
         * @extends rw.recentChanges
         */
        "openPage": (filters) => {
            // Open recent changes url
            let sidebarSize = 500;
            let addCol = "0,255,0"; // rgb
            let rmCol = "255,0,0"; // rgb
            let mwBody = document.getElementsByTagName("BODY")[0];
            /*if (rw.config.ptrSidebar) sidebarSize = rw.config.ptrSidebar; DEP. REV12*/
            // If preferences set, apply them
            if (rw.config.ptrAddCol) addCol = rw.config.ptrAddCol;
            if (rw.config.ptrRmCol) rmCol = rw.config.ptrRmCol;
            // basically multiact js but with stuff replaced
            mwBody.style.overflowY = "hidden";
            let content = mdlContainers.generateContainer(`[[[[include recentChanges.html]]]]`, window.innerWidth, window.innerWidth); // Generate container using mdlContainer.generatecontainer aka blob in iframe

            // Init if needed
            if ($("#PTdialogContainer").length < 1) {
                // Need to init
                $("body").prepend(`
                    <div id="PTdialogContainer">
                    </div>
                `);
                // Add close event
                addMessageHandler("closeDialogPT", () => {
                    rw.recentChanges.dialog.close();
                    mwBody.style.overflowY = "auto";
                }); // closing
            }

            $("#PTdialogContainer").html(`
            <dialog class="mdl-dialog" id="rwPATROLdialog">
                ${content}
            </dialog>
            `);
            rw.recentChanges.dialog = document.querySelector('#rwPATROLdialog'); // set dialog

            $("#rwPATROLdialog").attr("style", "padding:inherit;"); // set no padding
            // Firefox issue fix
            if (!rw.recentChanges.dialog.showModal) {
                dialogPolyfill.registerDialog(rw.recentChanges.dialog);
            }

            // Resize on window change
            $(window).resize(() => {
                $(rw.recentChanges.dialog.getElementsByTagName("iframe")[0]).attr("height", window.innerWidth);
                $(rw.recentChanges.dialog.getElementsByTagName("iframe")[0]).attr("width", window.innerWidth);
            });

            // Add message handler for dialog close
            addMessageHandler("rwRCPcloseDialog", () => { rw.recentChanges.dialog.close(); dialogEngine.enableScrolling(); });

            rw.recentChanges.dialog.showModal(); // Show dialog
        }
    }
};


/**
 * RedWarn extensions in the global window space
 * @class window
 */
/**
 * Is set depending on whether or not this window/tab is in focus.
 *
 * @property windowFocused
 * @type {boolean}
 * @default true
 * @extends window
 */
// Window focus checking n things
var windowFocused = true;

window.onblur = function () {
    windowFocused = false;
}
window.onfocus = function () {
    windowFocused = true;
}

// Array extention
/**
 * Moves element at index old_index to new_index
 * @method arrayMove
 * @param {array} arr
 * @param {number} old_index
 * @param {number} new_index
 * @returns {array}
 * @extends window
 */
var arrayMove = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

/**
 * Waits for Material Design Lite to load, then excecutes callback.
 *
 * @method waitForMDLLoad
 * @param {function} cb Callback function
 * @extends window
 */
function waitForMDLLoad(cb) { // Used to wait for MDL load
    if (typeof componentHandler !== "undefined") {
        cb(); // callback
    } else {
        setTimeout(() => waitForMDLLoad(cb), 250);
    }
}

/**
 * Redirect the user to the specified URL
 *
 * @method redirect
 * @param {string} url URL to redirect to
 * @param {boolean} inNewTab if set to true, will open the URL in a new tab
 * @extends window
 */
function redirect(url, inNewTab) {
    if (inNewTab) {
        Object.assign(document.createElement('a'), { target: '_blank', href: url }).click(); // Open in new tab
    } else {
        window.location.href = url; // open here
    }
}

/**
 * Object containing messageHandlers and their callbacks. See also addMessageHandler()
 *
 * @property messageHandlers
 * @type {object}
 * @default '{"testHandler": () => {alert("Working!");}};'
 * @extends window
 */
var messageHandlers = { "testHandler": () => { alert("Working!"); } };

/**
 * Adds a message handler - used between iFrames and the main window.
 *
 * @param {string} msg The message that will trigger the callback. If ending with *, this will check if the message contains the prefixed value instead of a direct match.
 * @param {function} callback Callback for when this message is recieved
 * @method addMessageHandler
 * @extends window
 */
function addMessageHandler(msg, callback) { // calling more than once will just overwrite
    Object.assign(messageHandlers, ((a, b) => { let _ = {}; _[a] = b; return _; })(msg, callback)); // function ab returns a good formatted obj
}

window.onmessage = e => {
    if (messageHandlers[e.data]) { messageHandlers[e.data](); } // Excecute handler if exact
    else { // We find ones that contain
        for (const evnt in messageHandlers) {
            if ((evnt.substr(evnt.length - 1) == "*") && e.data.includes(evnt.substr(0, evnt.length - 2))) { // and includes w * chopped off
                messageHandlers[evnt](e.data);
                return;
            } // if contains and ends with wildcard then we do it
        }
    }
};

// init everthing
/**
 * Initalises and loads everything in RedWarn, including main feature level restrictions, visual initalisation and window.location.hash handling.
 *
 * @method initRW
 * @extends window
 */
function initRW() {
    rw.visuals.init(() => {
        rw.visuals.toast.init();
        dialogEngine.init();

        // Quick check we have perms to use (in confirmed/autoconfirmed group)
        rw.info.featureRestrictPermissionLevel("confirmed", false, () => {
            // We don't have permission
            // Add red lock to the top right to show that RedWarn cannot be used
            $(`<div id='rwPGIconContainer'>
                <div id="Lock" class="icon material-icons"><span style="cursor: help; color:red;" onclick="">lock</span></div>
                <div class="mdl-tooltip" for="Lock">
                    You must be Autoconfirmed or Confirmed to use RedWarn.  Please refer the user guide for more information.
                </div>
            </div>` ).insertBefore($(".mw-indicators"));
            // Now register that
            for (let item of document.getElementsByClassName("mdl-tooltip")) {
                rw.visuals.register(item);
            }
            // A bit more of a clear error for someone who may not be paying immediate attention. Maybe we can use wikitext to send new user guide?
            mw.notify("You do not have permission to use Redwarn yet. Please refer to the user guide for more information (Error: User is NOT confirmed/autoconfirmed)", { title: "Error loading Redwarn", autoHide: "false", tag: "redwarn" });
            rw = {}; // WIPE OUT ENTIRE CLASS. We're not doing anything here.
            // That's it
        });

        // We have perms, let's continue.

        // Load config and check if updated
        rw.info.getConfig(() => {
            rw.info.getRollbackToken(); // get rollback token
            rw.visuals.pageIcons(); // page icons once config loaded
            rw.ui.registerContextMenu(); // register context menus once config loaded

            // If not autoconfirmed, add a flag
            rw.info.featureRestrictPermissionLevel("extendedconfirmed", () => { }, () => { rw.userIsNotEC = true; });

            // Add dialog animations from config
            $('head').append(`<style>${rwDialogAnimations[(rw.config.dialogAnimation == null ? "default" : rw.config.dialogAnimation)]}</style>`);

            // Check if updated
            if (rw.config.lastVersion != rw.version) {
                // We've had an update
                rw.config.lastVersion = rw.version; // update entry
                // RW 16 only - rm first setup
                rw.config.firstTimeSetupComplete = "notNeeded";
                rw.info.writeConfig(true, () => { // update the config file
                    // Show an update dialog
                    rw.ui.confirmDialog(`
                    <h2 style="font-weight: 200;font-size:38px;line-height: 48px;">Welcome to ${rw.logoHTML} ${rw.version}!</h2>
                    ${rw.versionSummary}
                    `,
                        "READ MORE", () => {
                            dialogEngine.closeDialog();
                            redirect("https://en.wikipedia.org/wiki/Wikipedia:RedWarn/bugsquasher#RedWarn_" + rw.version, true);
                        },
                        "LATER", () => {
                            dialogEngine.closeDialog();//this thing turns it off
                            rw.visuals.toast.show("You can read more later at RedWarn's page (WP:REDWARN)");//display a toast

                        }, 120);
                });
            } else if (rw.config.firstTimeSetupComplete == null) { // Check if first time setup has been completed
                rw.firstTimeSetup.launch();
            }

            // Campaign info load
            rw.campaigns.load();

            // TODO: probably fix this mess into a URL
            // HERE REALLY REALLY NEEDS CLEANUP
            // Check if a message is in URL (i.e edit complete ext)
            if (window.location.hash.includes("#noticeApplied-")) {
                // Show toast w undo edit capabilities
                // #noticeApplied-currentEdit-pastEdit
                rw.visuals.toast.show("Message saved", "UNDO", () => {
                    // Just restore the version via rollback restore (this does a normal undo request)
                    rw.rollback.restore(window.location.hash.split("-")[2], "Undo message addition (via toast)");
                }, 7500);
            } else if (window.location.hash.includes("#redirectLatestRevision")) { // When latest revision loaded
                rw.visuals.toast.show("Redirected to the latest revision.", "BACK", () => window.history.back(), 4000); // When back clciked go back
            } else if (window.location.hash.includes("#watchLatestRedirect")) {
                // Redirected to latest by redirector, play sound
                let src = 'https://redwarn.toolforge.org/cdn/audio/newEdit.mp3';
                let audio = new Audio(src);
                audio.play();
                // enable watcher
                rw.info.changeWatch.toggle();
            } else if (window.location.hash.includes("#investigateFail")) {
                rw.visuals.toast.show("Investigation Failed. This text has not been modified in the past 500 revisions or originated when the page was created.", false, false, 10000);
            } else if (window.location.hash.includes("#investigateIncomp")) {
                rw.visuals.toast.show("The selection could not be investigated.", false, false, 10000);
            } else if (window.location.hash.includes("#configChange")) {
                rw.visuals.toast.show("Preferences saved.");
            } else if (window.location.hash.includes("#rwPendingAccept")) {
                rw.visuals.toast.show("Changes accepted.");
            } else if (window.location.hash.includes("#rwReviewUnaccept")) {
                rw.visuals.toast.show("Changes unaccepted.");
            } else if (window.location.hash.includes("#compLatest")) {
                // Go to the latest revison
                rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), 0, () => { }); // auto filters and redirects for us - 0 is an ID that will never be
            } else if (window.location.hash.includes("#rollbackPreview")) {
                // Rollback preview page
                $('.mw-revslider-container').html(`
                <div style="padding-left:10px;">
                    <h2>This is a rollback preview</h2>
                    To rollback, use the buttons on the left side below. Using the restore revision button <b>will not</b> warn the user and won't redirect you to the latest revision.
                </div>
                <br>
                `);

                $('.mw-revslider-container').attr("style", "border: 3px solid red;");

            } else if (window.location.hash.includes("#rollbackFailNoRev")) {
                rw.visuals.toast.show("Could not rollback as there were no recent revisions by other users. Use the history page to try and manually revert.", false, false, 15000);
            }

            if ($("table.diff").length > 0) { // DETECT DIFF HERE - if diff table is present
                // Diff page
                rw.rollback.loadIcons(); // load rollback icons
            } else if (mw.config.get("wgRelevantPageName").includes("Special:RecentChanges")) {
                // Recent changes page
                // Add redwarn open btn
                $(".mw-specialpage-summary").prepend(`
                <div id="openRWP" style="
                    font-size: 32px;
                    float: right;
                    background: white;
                ">
                    <span style="cursor: pointer;" onclick="rw.recentChanges.openPage(window.location.search.substr(1));">
                        ${rw.logoHTML} patrol
                    </span>
                </div>

                <div class="mdl-tooltip mdl-tooltip--large" for="openRWP">
                    Click to launch RedWarn Patrol
                </div>
                `); // Register tooltip
                for (let item of document.getElementsByClassName("mdl-tooltip")) {
                    rw.visuals.register(item);
                }

            } else if (mw.config.get("wgRelevantPageName").includes("Special:Contributions")) { // Special contribs page
                rw.rollback.contribsPageIcons(); // rollback icons on current
            } else if (window.location.hash.includes("#rwPatrolAttach-RWBC_")) { // Connect to recent changes window
                let bcID = window.location.hash.split("-")[1]; // get bc id from hash
                const bc = new BroadcastChannel(bcID); // open channel
                bc.onmessage = msg => {// On message open here
                    rw.ui.loadDialog.show("Loading...");
                    redirect(msg.data);
                }
                // Set session storage (see below) Hopefully will only effect this window
                sessionStorage.rwBCID = bcID;
            }
            if (sessionStorage.rwBCID != null) {
                //  Session storage set! Connect to bcID
                const bc = new BroadcastChannel(sessionStorage.rwBCID); // open channel
                bc.onmessage = msg => {// On message open here
                    rw.ui.loadDialog.show("Loading...");
                    redirect(msg.data);
                }
            }

            // Log page in recently visited (rev13)
            if (!mw.config.get("wgRelevantPageName").includes("Special:")) { // if not special page
                try {
                    if (window.localStorage.rwRecentlyVisited == null) window.localStorage.rwRecentlyVisited = "[]"; // if not set, reset to empty array
                    // Load data
                    let recentlyVisted = JSON.parse(window.localStorage.rwRecentlyVisited);
                    let rVi = recentlyVisted.indexOf(mw.config.get("wgRelevantPageName")); // get index of, if not here -1
                    if (rVi != -1) {
                        // Page is already on the list, push to top
                        recentlyVisted = arrayMove(recentlyVisted, rVi, 0); // move (from, to)
                    } else {
                        // Page isn't on list, let's add
                        recentlyVisted.unshift(mw.config.get("wgRelevantPageName")); // adds at start of array
                    }

                    // Finally
                    if (recentlyVisted.length > 20) {
                        recentlyVisted.pop(); // remove last item to ensure list stays under 20 items
                    }

                    // Now save
                    window.localStorage.rwRecentlyVisited = JSON.stringify(recentlyVisted);// Done!
                } catch (error) { // on error (maybe corrupt value)
                    console.error(error);
                    window.localStorage.rwRecentlyVisited = "[]"; // try reset to empty array and hope for the best
                }
            }


            // Pending changes
            rw.PendingChangesReview.reviewPage(); // will auto check if possible ext and add icons

            // MultiAct history
            rw.multiAct.initHistoryPage();
        });
    });
}
