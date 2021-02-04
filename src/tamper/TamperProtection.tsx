import { h } from "tsx-dom";
import i18next from "i18next";
import Config from "rww/config";
import { ClientUser } from "rww/mediawiki";
import RWUI from "rww/ui/RWUI";

/**!
 * Tamper protection module.
 * This should be obfuscated in compilation.
 * note: removing this module will break startup, so bad faith users will have to cmt out init func
 */
export default class TamperProtection {
    static enable = 1;
    // use a getter here to confuse people
    static get x(): boolean {
        // complex mafs
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
            Config.ImNaughty.value
        ) {
            // wee woo
            return TamperProtection.exec();
        }
    }

    static async exec(): Promise<void> {
        const content = [<span></span>];
        content[0].innerHTML = i18next.t("ui:tamperProtection.warningContent");
        const d = new RWUI.Dialog({
            actions: [],
            content,
            title: i18next.t("ui.tamperProtection.header"),
        });
        await d.show();
        Config.ImNaughty.value = true;
        Config.save();
    }
}
