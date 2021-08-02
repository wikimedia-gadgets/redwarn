/*
 * UI and display settings.
 */

import { DefaultRedWarnStyle } from "rww/styles/StyleConstants";
import { Setting, UIInputType } from "../Setting";
import i18next from "i18next";

const UISettings = {
    /** Notice template order */
    noticeOrder: new Setting<"title" | "template">("noticeOrder", "title", {
        uiInputType: UIInputType.Radio,

        title: i18next.t("prefs:ui.noticeOrder.title"),
        description: i18next.t("prefs:ui.noticeOrder.description"),

        validOptions: [
            {
                name: i18next.t("prefs:ui.noticeOrder.options.title"),
                value: "title",
            },
            {
                name: i18next.t("prefs:ui.noticeOrder.options.template"),
                value: "template",
            },
        ],
    }),

    /** UI style */
    style: new Setting<string>("style", DefaultRedWarnStyle),

    /** Array of viewed campaigns */
    campaigns: new Setting<string[]>("campaigns", []),
};

export default UISettings;
