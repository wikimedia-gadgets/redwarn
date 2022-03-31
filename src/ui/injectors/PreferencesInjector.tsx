import { Injector } from "./Injector";
import { h } from "tsx-dom";
import RedWarnUI from "../RedWarnUI";

export default class PreferencesInjector implements Injector {
    async init(): Promise<void> {
        // check if on Wikipedia:(RedWarn|Ultraviolet)/Preferences
        // TODO support wiki localization
        if (
            (mw.config.get("wgPageName") ===
                "Wikipedia:Ultraviolet/Preferences" ||
                mw.config.get("wgPageName") ===
                    "Wikipedia:RedWarn/Preferences") &&
            mw.config.get("wgAction") === "view"
        ) {
            const preferences = new RedWarnUI.Preferences({
                excludeTabs: ["core"],
            });
            const preferencesElement = preferences.render();

            const target = document.querySelector("#mw-content-text");
            if (!target) {
                // Not a valid MediaWiki page.
                throw "Could not find mw-content-text";
            }
            target.innerHTML = "";
            target.removeAttribute("id");
            target.removeAttribute("class");
            target.appendChild(preferencesElement);
        }
    }
}
