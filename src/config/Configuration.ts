import {
    RW_CONFIG_VERSION,
    RW_NOWIKI_CLOSE,
    RW_NOWIKI_OPEN,
    RW_VERSION,
} from "rww/data/RedWarnConstants";
import { DefaultRedWarnStyle } from "rww/styles/StyleConstants";
import StyleManager from "rww/styles/StyleManager";
import { ClientUser } from "rww/mediawiki";
import { Setting } from "./Setting";
import { RollbackMethod } from "./ConfigurationEnums";
import { updateConfiguration } from "./ConfigurationUpdate";
import RWUI from "rww/ui/RWUI";
import i18next from "i18next";

export class Configuration {
    /** Last version of RedWarn that was used */
    public static latestVersion = new Setting(RW_VERSION, "latestVersion");
    /** The configuration version, responsible for keeping track of variable renames. */
    public static configVersion = new Setting(
        RW_CONFIG_VERSION,
        "configVersion"
    );
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
        RollbackMethod.Unset,
        "rollbackMethod"
    );
    /** Style of UI */
    public static style = new Setting(DefaultRedWarnStyle, "style");
    public static neopolitan = new Setting("", "neopolitan");

    static async refresh(): Promise<void> {
        let redwarnConfig: Record<string, any>,
            saveNow = false;
        try {
            redwarnConfig = JSON.parse(
                (
                    await ClientUser.i.redwarnConfigPage.getLatestRevision()
                ).content
                    // Strip everything except the actual JSON part.
                    .replace(
                        /(?:.|\s)+?rw\.config\s*=\s*({.+});(?:.|\s)+/g,
                        "$1"
                    )
            );
        } catch (e) {
            const dialog = new RWUI.Dialog(i18next.t("ui:configErrorDialog"));
            dialog.show();
            redwarnConfig = {};
            this.allSettings().forEach((v, k) => {
                redwarnConfig[k] = v.value;
            });
            saveNow = true;
        }

        if (redwarnConfig["configVersion"] ?? 0 < RW_CONFIG_VERSION) {
            window.rw.config = updateConfiguration(redwarnConfig);
            saveNow = true;
        } else {
            window.rw.config = redwarnConfig;
        }

        // At this point, we can definitely assume that `rw.config` is a configuration
        // that is of the latest version.

        this.allSettings().forEach((s) => s.refresh());

        StyleManager.activeStyle = StyleManager.styles.find(
            (v) => v.name === this.style.value
        ); // set here otherwise circular ref

        if (saveNow) {
            this.save();
        }
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
            window.rw.config[k] = v;
        });

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const template = require("./redwarnConfig.template.txt");

        await ClientUser.i.redwarnConfigPage.edit(
            Configuration.fromTemplate(template),
            "Updating user configuration"
        );
        if (reloadOnDone) {
            window.location.reload();
        }
        return;
    }

    static fromTemplate(template: string): string {
        return template
            .replace(/--nowikiOpen/g, RW_NOWIKI_OPEN)
            .replace(/--nowikiClose/g, RW_NOWIKI_CLOSE)
            .replace(/--configuration/g, JSON.stringify(window.rw.config));
    }
}
