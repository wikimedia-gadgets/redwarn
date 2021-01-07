/**
 *
 * RedWarn - Recent Edits Patrol and Warning Tool
 * The user-friendly Wikipedia counter-vandalism tool.

 * (c) 2020 The RedWarn Development Team and contributors - ed6767wiki (at) gmail.com or [[WT:RW]]
 * Licensed under the Apache License 2.0 - read more at https://gitlab.com/redwarn/redwarn-web/
 *
 **/

/* Libraries */

import i18next from "i18next";
import RedWarnStore from "./data/RedWarnStore";
import RedWarnHooks from "./event/RedWarnHooks";
import RTRC from "./integrations/RTRC";
import Localization from "./localization/Localization";
import StyleManager from "./styles/StyleManager";
import Dependencies from "./ui/Dependencies";
import RWUI from "./ui/RWUI";
import MediaWiki, {
    MediaWikiAPI,
    MediaWikiURL,
    Rollback,
    User,
    Warnings,
    Watch,
} from "./mediawiki/MediaWiki";
import * as RedWarnConstants from "./data/RedWarnConstants";
import * as Util from "./util";

$(document).ready(async () => {
    console.log("Starting RedWarn...");
    if (window.rw != null) {
        mw.notify(
            "You have two versions of RedWarn installed at once! Please edit your common.js or skin js files to ensure that you only use one instance to prevent issues.",
            { type: "error", title: "WARNING!!" }
        );
        throw "Two instances of RedWarn detected"; // die
    }

    // Load in languages first.
    await Localization.init();

    // Verify our MediaWiki installation.
    if (!MediaWiki.mwCheck()) return;

    console.log("Initializing store...");
    // Initialize RedWarn store.
    RedWarnStore.initializeStore();

    console.log("Loading style definitions...");
    // Load style definitions first.
    StyleManager.initialize();

    /**
     * Extensions can push their own dependencies here.
     */
    await Promise.all([RedWarnHooks.executeHooks("preInit")]);

    /**
     * Initialize everything
     */
    await Promise.all([
        RedWarnHooks.executeHooks("init"),
        Dependencies.resolve(),
        MediaWikiAPI.init(),
    ]);

    RTRC.init();

    /**
     * Send notice that RedWarn is done loading.
     */
    await RedWarnHooks.executeHooks("postInit");

    // Inject all UI elements
    await RedWarnHooks.executeHooks("preUIInject");

    await RWUI.inject();

    await RedWarnHooks.executeHooks("postUIInject");

    window.RedWarn = RedWarn;
    window.rw = RedWarn;

    // Initialize components here.
    // As much as possible, each component should be its own class to make everything
    // organized.

    // Testing code for the dialog and style system.

    // const a = new RWUI.Dialog({
    //     title: "Test Dialog",
    //     actions: [
    //         {
    //             data: "A",
    //             action: () => {alert("A");}
    //         },
    //         {
    //             data: "B",
    //             action: () => {alert("A");}
    //         }
    //     ]
    // });

    // console.log(await (a as RWUIDialog).show());
});

export default class RedWarn {
    static get RedWarnStore(): typeof RedWarnStore {
        return RedWarnStore;
    }
    static get RedWarnHooks(): typeof RedWarnHooks {
        return RedWarnHooks;
    }
    static get Localization(): typeof Localization {
        return Localization;
    }
    static get i18next(): typeof i18next {
        return i18next;
    }
    static get MediaWikiAPI(): typeof MediaWikiAPI {
        return MediaWikiAPI;
    }
    static get Rollback(): typeof Rollback {
        return Rollback;
    }
    static get StyleManager(): typeof StyleManager {
        return StyleManager;
    }
    static get RWUI(): typeof RWUI {
        return RWUI;
    }
    static get RedWarnConstants(): typeof RedWarnConstants {
        return RedWarnConstants;
    }
    static get RTRC(): typeof RTRC {
        return RTRC;
    }
    static get Util(): typeof Util {
        return Util;
    }
    static get MediaWikiURL(): typeof MediaWikiURL {
        return MediaWikiURL;
    }
    static get User(): typeof User {
        return User;
    }
    static get Warnings(): typeof Warnings {
        return Warnings;
    }
    static get Dependencies(): typeof Dependencies {
        return Dependencies;
    }

    /**
     * @deprecated not yet implemented
     */
    static get Watch(): typeof Watch {
        return Watch;
    }
}

declare global {
    interface Window {
        RedWarn: typeof RedWarn;
        rw: typeof RedWarn;
    }
}
