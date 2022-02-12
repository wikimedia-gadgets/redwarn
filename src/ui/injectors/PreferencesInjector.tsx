import { Injector } from "./Injector";
import { h } from "tsx-dom";

export default class PreferencesInjector implements Injector {
    async init(): Promise<void> {
        // check if on Wikipedia:RedWarn/Preferences
        // TODO support wiki localization
        if (
            mw.config.get("wgPageName") === "Wikipedia:RedWarn/Preferences" &&
            mw.config.get("wgAction") === "view"
        ) {
            /**
             * tabbed interface which organizes different setting groups
             * - Core
             * - Revert
             * - UI
             * - Accessibility
             * - About
             */
        }
    }
}
