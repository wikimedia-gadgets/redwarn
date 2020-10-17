/**
 * This file is a basic prevent measure against tampering with RedWarn - it's the only obfuscated part of RedWarn
 */
setTimeout(()=>{
    // Test if permission settings are as expected to prevent basic tampering
    mw.user.getGroups(g=>{if (!g.includes("sysop")) { // sysops allowed through everything anyways
        // Test for a gibberish role that should never pass
        rw.info.featureRestrictPermissionLevel("this is a gibberish role that will never pass", ()=>{

            // Flag
            rw.config.neopolitan = "I turn my head up to the sky, I focus one thought at a time.";
            rw.info.writeConfig(true, ()=>{});

            // Add bits to mess with
            rw.info.lastWarningLevel = (u, c)=>c(9999999); // messes with warning dialog and automation
            rw.version += "."; // add tampered marker

            // Add le funne
            rw.ui.openPreferences = ()=> {if (confirm("You are about to open an external link to YouTube.com - continue?")) Object.assign(document.createElement('a'), { target: '_blank', href: "https://www.youtube.com/watch?v=lXxUPo9tRao"}).click();};
        }, ()=>{/* legit */});
    }});
}, 5000);