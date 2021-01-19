import i18next from "i18next";
import { ClientUser } from "rww/mediawiki";
import RWUI from "rww/ui/RWUI";

/**!
 * Tamper protection module.
 * This should be obfuscated in compilation.
 */
export default class TamperProtection {
    static async init(): Promise<void> {
        if (
            ClientUser.i.inGroup("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        ) {
            // wee woo
            const d = new RWUI.Dialog({
                actions: [],
                content: i18next.t("ui:tamperProtection.warningContent"),
            });
            await d.show();
        }
    }
}
