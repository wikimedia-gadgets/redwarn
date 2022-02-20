/*
 * UI and display settings.
 */

import { DefaultRedWarnStyle } from "rww/styles/StyleConstants";
import { Setting, UIInputType } from "../Setting";
import i18next from "i18next";
import { ConfigurationSet } from "../Configuration";

type PageIconOverrides = Record<
    string,
    Partial<{
        enabled: boolean;
        // TODO: Order
    }>
>;

export default function initUISettings(): ConfigurationSet {
    return {
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

        /** Visible page icons */
        pageIcons: new Setting<PageIconOverrides>("pageIcons", null, {
            uiInputType: UIInputType.Style,

            title: i18next.t("prefs:ui.pageIcons.title"),
            description: i18next.t("prefs:ui.pageIcons.description"),
        }),

        /** UI style */
        style: new Setting<string>("style", DefaultRedWarnStyle, {
            uiInputType: UIInputType.Style,

            title: i18next.t("prefs:ui.style.title"),
            description: i18next.t("prefs:ui.style.description"),
        }),

        /** Array of viewed campaigns */
        campaigns: new Setting<string[]>("campaigns", []),
    };
}
