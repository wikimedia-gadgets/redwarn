import i18next from "i18next";
import { ClientUser } from "rww/mediawiki";
import RWUI from "rww/ui/RWUI";

/**!
 * Tamper protection module.
 * This should be obfuscated in compilation.
 */
export default class TamperProtection {
    static readonly w = true;

    // use a getter here to confuse people
    static get x(): boolean {
        // complex mafs
        return +this.w + 4 * 2 === 3 ** 2;
    }

    static async init(): Promise<void> {
        if (
            ClientUser.i.inGroup(
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            ) ||
            this.x
        ) {
            // wee woo
            await TamperProtection.showDialog();
        }
    }

    static async showDialog(): Promise<void> {
        const d = new RWUI.Dialog({
            actions: [],
            content: i18next.t("ui:tamperProtection.warningContent"),
        });
        await d.show();
    }
}
