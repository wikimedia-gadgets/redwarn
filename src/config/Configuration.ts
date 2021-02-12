import {
    RW_CONFIG_VERSION,
    RW_NOWIKI_CLOSE,
    RW_NOWIKI_OPEN,
    RW_VERSION,
} from "rww/data/RedWarnConstants";
import { DefaultRedWarnStyle } from "rww/styles/StyleConstants";
import { ClientUser } from "rww/mediawiki";
import { Setting } from "./Setting";
import { RollbackMethod } from "./ConfigurationEnums";
import { updateConfiguration } from "./ConfigurationUpdate";
import RWUI from "rww/ui/RWUI";
import i18next from "i18next";
import StyleManager from "rww/styles/StyleManager";
import { RedWarnStyleMissingError } from "rww/errors/RedWarnStyleError";

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
    public static neopolitan = new Setting(null, "neopolitan");

    static async refresh(): Promise<void> {
        console.log("Refreshing configuration...");
        let redwarnConfig: Record<string, any>,
            saveNow = false;

        try {
            redwarnConfig = JSON.parse(
                // Strip everything except the actual JSON part.
                /rw\.config\s*=\s*({(?:.|\s)*});(?:\n|\s*\/\/<\/nowiki>)(?:.|\s)*/g.exec(
                    (await ClientUser.i.redwarnConfigPage.getLatestRevision())
                        .content
                )[1]
            );
        } catch (e) {
            console.error(e);
            // Fallback style
            StyleManager.setStyle(StyleManager.defaultStyle);
            // Show error message
            const dialog = new RWUI.Dialog(i18next.t("ui:configErrorDialog"));
            dialog.show();
            // Reset configuration
            redwarnConfig = {};
            saveNow = true;
        }

        if ((redwarnConfig[this.configVersion.id] ?? 0) < RW_CONFIG_VERSION) {
            redwarnConfig = updateConfiguration(redwarnConfig);
            saveNow = true;
        }

        // At this point, we can definitely assume that `redwarnConfig` is a configuration
        // that is of the latest version.

        this.allSettings().forEach((setting) => {
            if (redwarnConfig[setting.id])
                setting.value = redwarnConfig[setting.id];
        });

        try {
            StyleManager.setStyle(
                redwarnConfig[this.style.id] ?? this.style.defaultValue
            );
        } catch (e) {
            if (e instanceof RedWarnStyleMissingError) {
                StyleManager.setStyle(StyleManager.defaultStyle);
                const dialog = new RWUI.Dialog(
                    i18next.t("ui:styleError.missing")
                );
                dialog.show();
            }
        }

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
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const template = require("./redwarnConfig.template.txt");

        await ClientUser.i.redwarnConfigPage.edit(
            Configuration.fromTemplate(template, this.map()),
            "Updating user configuration"
        );
        if (reloadOnDone) {
            window.location.reload();
        }
        return;
    }

    static map(): Record<string, any> {
        const excludeFromDefaultSkip = [
            this.configVersion.id,
            this.latestVersion.id,
        ];
        return Array.from(this.allSettings().entries()).reduce(
            (main, [id, setting]) => ({
                ...main,
                ...(excludeFromDefaultSkip.includes(setting.id) ||
                setting.value !== setting.defaultValue
                    ? { [id]: setting.value }
                    : {}),
            }),
            {}
        );
    }

    static fromTemplate(
        template: string,
        configurationValues: Record<string, any>
    ): string {
        return template
            .replace(/--nowikiOpen/g, RW_NOWIKI_OPEN)
            .replace(/--nowikiClose/g, RW_NOWIKI_CLOSE)
            .replace(/--configuration/g, JSON.stringify(configurationValues));
    }
}
