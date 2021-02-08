import { h } from "tsx-dom";
import i18next from "i18next";
import { Configuration } from "rww/config";
import { ClientUser } from "rww/mediawiki";
import RWUI from "rww/ui/RWUI";

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
        return this.enable + 4 * 2 === 3 ** 2 + 1;
    }

    static r = 0;

    static init(): Promise<void> {
        if (!this.enable) {
            return;
        }
        this.r = 1;
        if (
            ClientUser.i.inGroup(
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            ) ||
            this.x ||
            Configuration.ImNaughty.value
        ) {
            return TamperProtection.exec();
        }
    }

    static async exec(): Promise<void> {
        const content = [<span />];
        content[0].innerHTML = i18next.t("ui:tamperProtection.warningContent");
        const d = new RWUI.Dialog({
            actions: [],
            content,
            title: i18next.t("ui:tamperProtection.header"),
        });
        await d.show();
        Configuration.ImNaughty.value = true;
        Configuration.save();
    }
}
