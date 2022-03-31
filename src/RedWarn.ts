/**
 *
 * Ultraviolet - the user-friendly MediaWiki counter-vandalism tool.
 *
 * (c) 2020-2022 The Ultraviolet Development Team (10nm) and contributors - tools.ultraviolet@toolforge.org or [[WT:UV]]
 * Licensed under the Apache License 2.0 - read more at https://gitlab.com/redwarn/redwarn-web/
 * Other conditions may apply - check LICENSE for more information.
 *
 **/

/* Libraries */

import i18next from "i18next";
import * as RedWarnConstants from "./data/RedWarnConstants";
import { RW_VERSION } from "./data/RedWarnConstants";
import * as Utilities from "./util";
import Dependencies from "./data/Dependencies";
import Localization from "./localization/Localization";
import Log from "app/data/RedWarnLog";
import MediaWikiNotificationContent from "app/ui/MediaWikiNotificationContent";
import RealTimeRecentChanges from "./integrations/RealTimeRecentChanges";
import RedWarnHooks from "./event/RedWarnHooks";
import RedWarnLocalDB from "app/data/database/RedWarnLocalDB";
import RedWarnStore from "./data/RedWarnStore";
import RedWarnUI from "./ui/RedWarnUI";
import RedWarnWikiConfiguration from "app/config/wiki/RedWarnWikiConfiguration";
import StyleManager from "./styles/StyleManager";
import TamperProtection from "./tamper/TamperProtection";
import UIInjectors from "app/ui/injectors/UIInjectors";
import * as MediaWikiClasses from "./mediawiki";
import {
    ClientUser,
    MediaWiki,
    MediaWikiAPI,
    RevertSpeedup,
    WarningManager,
    Watch,
} from "./mediawiki";
import { Configuration } from "./config/user/Configuration";
import LoadErrorTranslations from "app/errors/LoadErrorTranslations";
import { RecentPages } from "app/mediawiki/util/RecentPages";

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

    // TODO: Remove exposure of unused classes.

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
    static get MediaWikiClasses(): typeof MediaWikiClasses {
        return MediaWikiClasses;
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
    static get Utilities(): typeof Utilities {
        return Utilities;
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
    static get Watch(): typeof Watch {
        return Watch;
    }
    static get RecentPages(): typeof RecentPages {
        return RecentPages;
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

    static async initialize() {
        if (
            document.body.classList.contains("rw-disable") ||
            new URL(window.location.href).searchParams.get("redwarn") === "0"
        ) {
            // We've been prevented from running on this page.
            Log.info(
                "The current page is blocking Ultraviolet from loading. Shutting down..."
            );
            return;
        }

        // Tell all scripts that RedWarn is running.
        RedWarnHooks.executeHooks("load");

        Log.info(`Starting Ultraviolet ${RW_VERSION}...`);
        const startTime = Date.now();

        if (window.rw != null) {
            mw.notify(
                "You have two versions of Ultraviolet/RedWarn installed at once! Please edit your common.js or skin js files to ensure that you only use one instance to prevent issues.",
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

        // Verify our MediaWiki installation.
        if (!MediaWiki.mwCheck()) return;

        // Load in MediaWiki dependencies
        await MediaWiki.loadDependencies();

        // Static dependency initialization.
        await Promise.all([
            // Connect to the Indexed DB database.
            RedWarnLocalDB.i.connect(),
            // Initialize the MediaWiki API.
            MediaWikiAPI.init(),
            (async () => {
                RedWarnStore.initializeStore();
            })(),
            StyleManager.initialize(),
        ]);

        try {
            // Attempt to deserialize the per-wiki configuration.
            RedWarnWikiConfiguration.c;
        } catch (e) {
            Log.fatal("Wiki-specific configuration is broken!");
            mw.notify(
                MediaWikiNotificationContent(
                    i18next.t(`mediawiki:error.wikiConfigBad`, {
                        wikiIndex: RedWarnStore.wikiIndex,
                    })
                ),
                { type: "error" }
            );
            return;
        }

        // Load in the configuration file (preloads need to be finished by this point).
        await Configuration.refresh();

        /**
         * Extensions and styles can push their own dependencies here.
         */
        await Promise.all([
            RedWarnHooks.executeHooks("preInit"),
            Dependencies.resolve([StyleManager.activeStyle.dependencies]),
            Dependencies.resolve([RedWarnStore.dependencies]),
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

        await new UIInjectors().inject();

        // Show Ultraviolet-only visuals.
        document
            .querySelectorAll(".uv-show")
            .forEach(
                (e) => ((e as HTMLElement).style.display = "unset !important")
            );

        // Hide Anti-Ultraviolet visuals
        document
            .querySelectorAll(".uv-hide")
            .forEach((e) => ((e as HTMLElement).style.display = "none"));

        await Promise.all([
            RedWarnHooks.executeHooks("postUIInject"),
            Watch.init(),
            RecentPages.init(),
        ]);

        Log.debug(`Done loading (UI): ${Date.now() - startTime}ms.`);
    }
}

RedWarn.initialize().catch((e) => {
    // DO NOT USE i18next! i18next might not be able to load, causing the issue in the first place.
    Log.fatal("Error loading RedWarn!", e);

    const translated =
        LoadErrorTranslations[navigator.language] ?? // "zh-TW"
        LoadErrorTranslations[/^[A-Z]+/i.exec(navigator.language)[0]] ?? // "en"
        LoadErrorTranslations["en"]; // fallback

    const standardCSS =
        "background: #e0005a; color: #ffffff; font-weight: bold; font-size: x-large;";
    console.group(
        `%c${translated[0]}%c${translated.slice(1).join(" ")}`,
        `padding: 2px 8px; border-radius: 8px; ${standardCSS}`,
        "display: block; margin-top: 8px; width: 50vw;"
    );
    console.log("%c" + btoa(JSON.stringify(Log.dump())), "color: lime;");
    console.groupEnd();
});
