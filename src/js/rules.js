// Data originally processed from Twinkle Source at https://github.com/azatoth/twinkle
rw.rules = {};

// Functions for rw.rules
rw.rulesFunc = {
    "resync": callback => {
        $.getJSON("https://en.wikipedia.org/w/index.php?title=Wikipedia:RedWarn/Default_Warnings&action=raw&ctype=text/json", rules => {
            // Sanitize (XSS SECURITY AND COVID-19!!)
            for (const i in rules) {
                rules[i].name = rules[i].name.replace(/[^\w\s!?-]/g, '');
                rules[i].category = rules[i].category.replace(/[^\w\s!?-]/g, '');
                rules[i].template = rules[i].template.replace(/[^\w\s!?-]/g, '');
            }
            rw.rules = rules;
            // Now save
            rw.rulesFunc.save(callback);
        }).fail(() => {
            // Download failed, maybe page is messed up? Either way don't callback
            rw.ui.loadDialog.close();
            rw.ui.confirmDialog("Sorry, we couldn't load the rule database due to an error.",
                "OKAY", () => dialogEngine.closeDialog(),
                "", () => { }, 0);
        });
    },

    "load": callback => {
        $.getJSON("https://en.wikipedia.org/w/index.php?title=User:" + encodeURIComponent(rw.info.getUsername()) + "/redwarnRules.json&action=raw&ctype=text/json", rules => {
            if ($.isEmptyObject(rules)) {
                // wee woo empty, resync
                rw.rulesFunc.resync(callback);
                return;
            }
            rw.rules = rules; // that's it lol
            if (callback != null) callback();
        }).fail(() => {
            // Assume it doesn't exist
            rw.rulesFunc.resync(callback);
        });
    },

    "save": callback => {
        // Stringify and save
        $.post(rw.wikiAPI, {  // LOCALISATION ISSUE!!
            "action": "edit",
            "format": "json",
            "token": mw.user.tokens.get("csrfToken"),
            "title": "User:" + rw.info.getUsername() + "/redwarnRules.json",
            "summary": "Updating user Rule Database [[w:en:WP:RW|(RW " + rw.version + ")]]", // summary sign here
            "text": JSON.stringify(rw.rules),
            "tags": ((rw.wikiID == "enwiki") ? "RedWarn" : null) // Only add tags if on english wikipedia
        }).done(dt => {
            // We done. Check for errors, then callback appropriately
            if (!dt.edit) {
                // Error occured or other issue
                console.error(dt);
                rw.visuals.toast.show("Sorry, there was an error. See the console for more info. Your changes to your rules have not been saved.");
            } else {
                // Success!
                if (callback != null) callback();
            }
        });
    }
};
