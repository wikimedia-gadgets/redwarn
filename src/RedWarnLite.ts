/**
 *
 * RedWarn - Recent Edits Patrol and Warning Tool
 * The user-friendly Wikipedia counter-vandalism tool.

 * (c) 2020 The RedWarn Development Team and contributors - ed6767wiki (at) gmail.com or [[WT:RW]]
 * Licensed under the Apache License 2.0 - read more at https://gitlab.com/redwarn/redwarn-web/
 *
 **/

/* Libraries */

import RedWarnStore from "./data/RedWarnStore";
import RedWarnHooks from "./event/RedWarnHooks";
import RTRC from "./integrations/RTRC";
import Localization from "./localization/Localization";
import StyleManager from "./styles/StyleManager";
/* IMPORT EVERYTHING HERE! */
import Dependencies from "./ui/Dependencies";
import WikipediaAPI from "./wikipedia/API";
import Rollback from "./wikipedia/Rollback";

console.log("Starting RedWarn...");
// noinspection JSDeprecatedSymbols
$(document).ready(async () => {
    // Load in languages first.
    await Localization.init();

    console.log("Initializing store...");
    // Initialize RedWarn store.
    RedWarnStore.initializeStore();

    console.log("Loading style definitions...");
    // Load style definitions first.
    StyleManager.initialize();

    /**
     * Extensions can push their own dependencies here.
     */
    await Promise.all([RedWarnHooks.executeHooks("preinit")]);

    /**
     * Initialize everything
     */
    await Promise.all([
        RedWarnHooks.executeHooks("init"),
        Dependencies.resolve(),
        WikipediaAPI.init(),
        Rollback.init(),
    ]);

    RTRC.init();

    /**
     * Send notice that RedWarn is done loading.
     */
    await RedWarnHooks.executeHooks("postinit");

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
