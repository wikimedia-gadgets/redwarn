/*
This directory contains values for each module and what their preference value does and includes
If a preference value isn't here it will be seen as invalid and removed/ignored.

i18n - see pref.json for your localisation, make sure you add values for each one of your keys.
*/

import { DefaultRedWarnStyle } from "rww/styles/StyleConstants";
import { Setting, settingArrayToObject, uiInputType } from "../Setting";

const uiSettings: Record<string, any> = settingArrayToObject([
    /** Order warnings by template name or reason */
    new Setting("orderNoticesByTemplateName", false, {
        isUserFacing: true,
        uiInputType: uiInputType.RadioButtons,

        readableTitle: "prop:ui.orderNoticesByTemplateName.title",
        readableDescription: "prop:ui.orderNoticesByTemplateName.description",

        validOptions: [
            {
                readableName: "prop:ui.orderNoticesByTemplateName.byTitle",
                value: false,
            },
            {
                readableName:
                    "prop:ui.orderNoticesByTemplateName.byTemplateName",
                value: true,
            },
        ],
    }),

    /** Array of viewed campaigns */
    new Setting<string[]>("campaigns", []),

    /** Style of UI */
    new Setting("style", DefaultRedWarnStyle),
    new Setting("neopolitan", null),
]);

export default uiSettings;
