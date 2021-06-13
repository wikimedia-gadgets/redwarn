/*
 * UI and display settings.
 */

import { DefaultRedWarnStyle } from "rww/styles/StyleConstants";
import { Setting, UIInputType } from "../Setting";
import { ConfigurationSet } from "rww/config";
import i18next from "i18next";

const UISettings = <ConfigurationSet>{
    /** Notice template order */
    noticeOrder: new Setting("noticeOrder", false, {
        uiInputType: UIInputType.Radio,

        title: i18next.t("prefs:ui.noticeOrder.title"),
        description: i18next.t("prefs:ui.noticeOrder.description"),

        validOptions: [
            {
                name: i18next.t("prefs:ui.noticeOrder.options.title"),
                value: false,
            },
            {
                name: i18next.t("prefs:ui.noticeOrder.options.template"),
                value: true,
            },
        ],
    }),

    /** UI style */
    style: new Setting("style", DefaultRedWarnStyle),

    /** Array of viewed campaigns */
    campaigns: new Setting<string[]>("campaigns", []),
};

export default UISettings;
