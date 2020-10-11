/**
 *
 * RedWarn - Recent Edits Patrol and Warning Tool
 * The user-friendly Wikipedia counter-vandalism tool.

 * (c) 2020 The RedWarn Development Team and contributors - ed6767wiki (at) gmail.com or [[WT:RW]]
 * Licensed under the Apache License 2.0 - read more at https://gitlab.com/redwarn/redwarn-web/
 *
 **/

/* Libraries */

/* IMPORT EVERYTHING HERE! */
import Dependencies from "./ui/Dependencies";
import RedWarnHooks from "./event/RedWarnHooks";
import WikipediaAPI from "./wikipedia/API";
import StyleManager from "./styles/StyleManager";
import {RWUIDialog, RWUIDialogActionType} from "./ui/RWUIDialog";
import { initializeStore } from "./data/RedWarnStore";

(async () => {
    // Initialize RedWarn store.
    initializeStore();

    // Load style definitions first.
    StyleManager.initialize();

    /**
     * Extensions can push their own dependencies here.
     */
    await RedWarnHooks.executeHooks("preinit");

    /**
     * Initialize everything
     */
    await Promise.all([
        RedWarnHooks.executeHooks("init"),
        Dependencies.resolve(),
        WikipediaAPI.init()
    ]);

    /**
     * Send notice that RedWarn is done loading.
     */
    await RedWarnHooks.executeHooks("postinit");

    // Initialize components here.
    // As much as possible, each component should be its own class to make everything
    // organized.
    const a = StyleManager.activeStyle.classMap["rwDialog"]({
        title: "Test Dialog",
        actions: [
            {
                type: RWUIDialogActionType.Finish,
                text: "A",
                action: () => {alert("A");}
            },
            {
                type: RWUIDialogActionType.Execute,
                text: "B",
                action: () => {alert("A");}
            }
        ]
    });
    (a as RWUIDialog).show();

})();