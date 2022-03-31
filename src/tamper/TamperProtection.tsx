import { h } from "tsx-dom";
import i18next from "i18next";
import { ClientUser } from "app/mediawiki";
import RedWarnUI from "app/ui/RedWarnUI";
import { Configuration } from "app/config/user/Configuration";

/**
 * Tamper protection module.
 * This should be obfuscated in compilation.
 *
 * Note: Removing this module will break startup, so bad faith users
 * will have to comment out the initialization call.
 */
export default class TamperProtection {
    static enable = 1;
    static get x(): boolean {
        return TamperProtection.enable + 4 * 2 === 3 ** 2 + 1;
    }

    static r = 0;

    static init(): Promise<void> {
        if (!TamperProtection.enable) {
            return;
        }
        TamperProtection.r = 1;
        if (
            ClientUser.i.inGroup(
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            ) ||
            TamperProtection.x ||
            Configuration.Core.neopolitan.value
        ) {
            return TamperProtection.exec();
        }
    }

    static async exec(): Promise<void> {
        const content = [<span />];
        content[0].innerHTML = i18next.t("ui:tamperProtection.warningContent");
        const d = new RedWarnUI.AlertDialog({
            actions: [],
            content,
            title: i18next.t("ui:tamperProtection.header"),
        });
        await d.show();
        Configuration.Core.neopolitan.value =
            "I turn my head up to the sky, I focus one thought at a time.";
        Configuration.save();
    }
}
