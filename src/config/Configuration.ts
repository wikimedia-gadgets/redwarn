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
    public static ImNaughty = new Setting(false, "ImNaughty");

    static async refresh(): Promise<void> {
        // TODO try/catch, since this will fail if the configuration is bad.
        const redwarnConfig = JSON.parse(
            (await ClientUser.i.redwarnConfigPage.getLatestRevision()).content
                // Strip everything except the actual JSON part.
                .replace(/(?:.|\s)+?rw\.config\s*=\s*({.+});(?:.|\s)+/g, "$1")
        );

        if (redwarnConfig["configVersion"] ?? 0 < RW_CONFIG_VERSION) {
            window.rw.config = updateConfiguration(redwarnConfig);
            // TODO Immediately save.
        } else window.rw.config = redwarnConfig;

        // At this point, we can definitely assume that `rw.config` is a configuration
        // that is of the latest version.

        this.allSettings().forEach((s) => s.refresh());

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
