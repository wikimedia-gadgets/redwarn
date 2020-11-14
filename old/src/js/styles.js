// Handles RedWarns styles
$(".menu").css("z-index", 110); // stop ours from overlaying

var rwDialogAnimations = { // Custom CSS for each animation style
    // DEFAULT
    "default" : `[[[[include dialogAnimations.default.css]]]]`,

    // NONE (marked as "instant")
    "none" : `[[[[include dialogAnimations.none.css]]]]`,

    // Spinny
    "spinny" : `[[[[include dialogAnimations.spinny.css]]]]`,

    // Mega
    "mega" : `[[[[include dialogAnimations.mega.css]]]]`
};


// MAIN CSS - THE MAIN PAGE DOES NOT INCLUDE MATERIAL DESIGN LITE CSS. Include all the things here if needed.
/**
 * material-design-lite - Material Design Components in CSS, JS and HTML
 * version v1.3.0
 * license Apache-2.0
 * copyright 2015 Google, Inc.
 * link https://github.com/google/material-design-lite
 */
var rwStyle = `[[[[include style.css]]]]`;