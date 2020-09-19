/**
 *
 * RedWarn - Recent Edits Patrol and Warning Tool
 * The user-friendly Wikipedia counter-vandalism tool.

 * (c) 2020 The RedWarn Development Team and contributors - ed6767wiki (at) gmail.com or [[WT:RW]]
 * Licensed under the Apache License 2.0 - read more at https://gitlab.com/redwarn/redwarn-web/
 *
 **/

/* Libraries */

// MDL
import "../node_modules/material-design-lite/material.min.js";
// Add options to change the CSS later.
import "../node_modules/material-design-lite/material.min.css";

/* IMPORT EVERYTHING HERE! */
import Dependencies from "./ui/Dependencies";
import MaterialDialogTest from "./tests/MaterialDialogTest";

(async () => {

    /* Resolve dependencies */
    await Dependencies.resolve();

    // Initialize components here.
    // As much as possible, each component should be its own class to make everything
    // organized.

    await MaterialDialogTest.execute();

})();