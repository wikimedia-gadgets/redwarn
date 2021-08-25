/**
 *
 * RedWarn - Recent Edits Patrol and Warning Tool
 * The user-friendly Wikipedia counter-vandalism tool.
 *
 * (c) 2021 The RedWarn Development Team and contributors - ed6767wiki (at) gmail.com or [[WT:RW]]
 * Licensed under the Apache License 2.0 - read more at https://gitlab.com/redwarn/redwarn-web/
 * Other conditions may apply - please check prior to distribution
 *
 **/

/* Libraries */

import i18next from "i18next";
import * as RedWarnConstants from "./data/RedWarnConstants";
import { RW_VERSION } from "./data/RedWarnConstants";
import * as Util from "./util";
import Dependencies from "./data/Dependencies";
import Localization from "./localization/Localization";
import Log from "rww/data/RedWarnLog";
import MediaWikiNotificationContent from "rww/ui/MediaWikiNotificationContent";
import RealTimeRecentChanges from "./integrations/RealTimeRecentChanges";
import RedWarnHooks from "./event/RedWarnHooks";
import RedWarnLocalDB from "rww/data/database/RedWarnLocalDB";
import RedWarnStore from "./data/RedWarnStore";
import RedWarnUI from "./ui/RedWarnUI";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import StyleManager from "./styles/StyleManager";
import TamperProtection from "./tamper/TamperProtection";
import UIInjectors from "rww/ui/injectors/UIInjectors";
import {
    ClientUser,
    MediaWiki,
    MediaWikiAPI,
    MediaWikiURL,
    Revert,
    RevertSpeedup,
    User,
    WarningManager,
    Watch
} from "./mediawiki";
import { Configuration } from "./config/user";

declare global {
    interface Window {
        RedWarn: typeof RedWarn;
        rw: typeof RedWarn;
    }
}

/**
 * The RedWarn class is provided as a way for other scripts to access
 * RedWarn-specific functionality.
 */
export default class RedWarn {
    static readonly version = RW_VERSION;

    static get RedWarnConstants(): typeof RedWarnConstants {
        return RedWarnConstants;
    }
    static get RedWarnStore(): typeof RedWarnStore {
        return RedWarnStore;
    }
    static get RedWarnHooks(): typeof RedWarnHooks {
        return RedWarnHooks;
    }
    static get Localization(): typeof Localization {
        return Localization;
    }
    static get Log(): typeof Log {
        return Log;
    }
    static get i18next(): typeof i18next {
        return i18next;
    }
    static get MediaWikiAPI(): typeof MediaWikiAPI {
        return MediaWikiAPI;
    }
    static get Revert(): typeof Revert {
        return Revert;
    }
    static get StyleManager(): typeof StyleManager {
        return StyleManager;
    }
    static get RedWarnUI(): typeof RedWarnUI {
        return RedWarnUI;
    }
    static get RTRC(): typeof RealTimeRecentChanges {
        return RealTimeRecentChanges;
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
    static get WarningManager(): typeof WarningManager {
        return WarningManager;
    }
    static get Dependencies(): typeof Dependencies {
        return Dependencies;
    }
    static get Configuration(): typeof Configuration {
        return Configuration;
    }
    static get WikiConfiguration(): typeof RedWarnWikiConfiguration {
        return RedWarnWikiConfiguration;
    }
    static get Database(): RedWarnLocalDB {
        return RedWarnLocalDB.i;
    }

    /**
     * @deprecated not yet implemented
     */
    static get Watch(): typeof Watch {
        return Watch;
    }
    static get MediaWiki(): typeof MediaWiki {
        return MediaWiki;
    }
    static get ClientUser(): typeof ClientUser {
        return ClientUser;
    }
    static get TamperProtection(): typeof TamperProtection {
        return TamperProtection;
    }
}

(async () => {
    if (document.body.classList.contains("rw-disable")) {
        // We've been prevented from running on this page.
        Log.info("Page is blocking RedWarn loading. Shutting down...");
        return;
    }

    Log.info(`Starting RedWarn ${RW_VERSION}...`);
    const startTime = Date.now();

    if (window.rw != null) {
        mw.notify(
            "You have two versions of RedWarn installed at once! Please edit your common.js or skin js files to ensure that you only use one instance to prevent issues.",
            { type: "error", title: "Conflict" }
        );
        return; // die
    }

    window.RedWarn = RedWarn;
    window.rw = RedWarn;

    // Initialize components here.
    // As much as possible, each component should be its own class to make everything
    // organized.

    // Load in languages first.
    await Localization.init();

    // Load in MediaWiki dependencies
    await MediaWiki.loadDependencies();

    // Verify our MediaWiki installation.
    if (!MediaWiki.mwCheck()) return;

    Log.debug("Initializing local database connection...");
    // Initialize RedWarn Local Database.
    await RedWarnLocalDB.i.connect();

    // Create the MediaWiki API connector.
    await MediaWikiAPI.init();

    Log.debug("Initializing store...");
    // Initialize RedWarn store.
    RedWarnStore.initializeStore();

    Log.debug("Loading style definitions...");
    // Load style definitions first.
    await StyleManager.initialize();

    try {
        // Attempt to deserialize the per-wiki configuration.
        RedWarnWikiConfiguration.c;
    } catch (e) {
        Log.fatal("Wiki-specific configuration is broken!");
        mw.notify(
            MediaWikiNotificationContent(
                i18next.t(`mediawiki:error.wikiConfigBad`, {
                    wikiIndex: RedWarnStore.wikiIndex
                })
            ),
            { type: "error" }
        );
        return;
    }

    // Load the configuration
    await Configuration.refresh();

    // Only do hook calls after style has been set to configuration preference!

    /**
     * Extensions and styles can push their own dependencies here.
     */
    await Promise.all([
        RedWarnHooks.executeHooks("preInit"),
        Dependencies.resolve([StyleManager.activeStyle.dependencies]),
        Dependencies.resolve([RedWarnStore.dependencies])
    ]);

    /**
     * Initialize everything
     */

    // Non-blocking initializers.
    (() => {
        RealTimeRecentChanges.init();
        TamperProtection.init();

        // Call RevertSpeedup last.
        RevertSpeedup.init();
    })();

    await Promise.all([RedWarnHooks.executeHooks("init")]);

    /**
     * Send notice that RedWarn is done loading.
     */
    await RedWarnHooks.executeHooks("postInit");
    Log.debug(`Done loading (core): ${Date.now() - startTime}ms.`);

    // Inject all UI elements
    await RedWarnHooks.executeHooks("preUIInject");

    await UIInjectors.inject();

    await Promise.all([
        RedWarnHooks.executeHooks("postUIInject"),
        Watch.init()
    ]);

    Log.debug(`Done loading (UI): ${Date.now() - startTime}ms.`);
})().catch((e) => {
    // DO NOT USE i18n! i18next might not be able to load, causing the issue in the first place.
    Log.fatal("Error loading RedWarn!", e);

    const standardCSS =
        "background: #e0005a; color: #ffffff; font-weight: bold; font-size: x-large;";
    console.group(
        `%cRedWarn failed to load.` +
            "%cIf the problem persists, please contact the RedWarn developers. ( RedWarn 加载失败。 请联系 RedWarn Team. / RedWarn no se pudo cargar. Comuníquese con el RedWarn Team. )" +
            "Additional debug information is provided below. " +
            "If requested by a RedWarn team member, please provide the text through a private channel (email, IRC, etc.). " +
            'You can right click the text and select "Copy Object" to copy faster.',
        `padding: 2px 8px; border-radius: 8px; ${standardCSS}`,
        "display: block; margin-top: 8px; width: 50vw;"
    );
    console.log("%c" + btoa(JSON.stringify(Log.dump())), "color: lime;");
    console.groupEnd();
});
