/* Libraries */

// MDL
import "../node_modules/material-design-lite/material.min.js";
import "../node_modules/material-design-lite/material.min.css";

// Fonts
import GlobalHead from "./examples/GlobalHead";
document.head.append(...GlobalHead());

/* IMPORT EVERYTHING HERE! */

import {initialize} from "./examples/TestTS";

// Suggestion: put the initialization things in a clean function, split the giant
// blocks inside said function into their own functions, and then import that
// here, and then run it as a normal statement.

// Examples files have been added for clarity.

initialize();



