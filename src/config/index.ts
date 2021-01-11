import {
    RW_NOWIKI,
    RW_NOWIKI_END,
    RW_VERSION,
} from "rww/data/RedWarnConstants";
import StyleManager from "rww/styles/StyleManager";
import { Page } from "rww/mediawiki";
import { Setting } from "./Setting";

export enum rollbackMethod {
    Unset,
    Rollback,
    Revert,
}

export default class Config {
    /** Last version of RedWarn that was used */
    public static latestVersion = new Setting(RW_VERSION, "latestVersion");
    /** Rollback done option that is automatically executed on rollback complete */
    public static rollbackDoneOption = new Setting(
        "warnUser",
        "rollbackDoneOption"
    );
    /** Order warnings by template name or reason */
    public static orderNoticesByTemplateName = new Setting(
        false,
        "orderNoticesByTemplateName"
    );
    /** Array of viewed campaigns */
    public static campaigns = new Setting<string[]>([], "campaigns");
    /** Method of rollback */
    public static rollbackMethod = new Setting(
        rollbackMethod.Unset,
        "rollbackMethod"
    );
    /** Style of UI */
    public static style = new Setting(StyleManager.defaultStyle, "style");

    static async refresh(): Promise<void> {
        await $.ajax(
            "/w/index.php?title=Special:MyPage/redwarnConfig.js&action=raw&ctype=text/javascript",
            { dataType: "script" }
        ); // This is effectively mw.loader.getScript, but without caching
        if (window.rw.config?.new != null) {
            this.allSettings().forEach((s) => s.refresh());
        } else if (window.rw.config != null) {
            // old config exists, convert
            for (const [key, value] of Object.entries(window.rw.config)) {
                switch (key) {
                    case "rwRollbackDoneOption":
                        switch (value) {
                            case "RWRBDONEmrevPg":
                                this.rollbackDoneOption.value = "latestRev";
                                break;
                            case "RWRBDONEnewUsrMsg":
                                this.rollbackDoneOption.value = "newMsg";
                                break;
                            case "RWRBDONEwelcomeUsr":
                                this.rollbackDoneOption.value = "quickTemplate";
                                break;
                            case "RWRBDONEwarnUsr":
                                this.rollbackDoneOption.value = "warnUser";
                                break;
                            case "RWRBDONEreportUsr":
                                this.rollbackDoneOption.value = "reportUser";
                                break;
                            default:
                                console.error(
                                    "Unknown rwRollbackDoneOption:",
                                    value
                                );
                        }
                        break;
                }
            }
        }
        StyleManager.activeStyle = StyleManager.styles.find(
            (v) => v.name === this.style.value
        ); // set here otherwise circular ref
    }

    static allSettings(): Map<string, Setting<unknown>> {
        const map = new Map();
        for (const [key, value] of Object.entries(this)) {
            if (value instanceof Setting) {
                map.set(key, value);
            }
        }
        return map;
    }

    static async save(reloadOnDone = false): Promise<void> {
        this.allSettings().forEach((v, k) => {
            window.rw.config.new[k] = v;
        });
        const text = `
/*${RW_NOWIKI}
This is your RedWarn configuration file. It is recommended that you don't edit this yourself and use RedWarn preferences instead.
It is written in JSON formatting and is executed every time RedWarn loads.

If somebody has asked you to add code to this page, DO NOT do so as it may compromise your account and will be reverted as soon as any configuration value changes.

!!! Do not edit below this line unless you understand the risks! If rw.config isn't defined, this file will be reset. !!!
*/
rw.config = ${JSON.stringify(window.rw.config)};
//${RW_NOWIKI_END}`;
        await Page.fromTitle("Special:MyPage/redwarnConfig.js").edit(
            text,
            "Updating user configuration"
        );
        if (reloadOnDone) {
            window.location.reload();
        }
        return;
    }
}
