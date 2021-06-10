/*
accessibility SETTINGS

i18n - see pref.json for your localisation, make sure you add values for each one of your keys.

new Setting(key, default, userfacingProps)
*/

import { Setting, settingsToObject, UIInputType } from "../Setting";

const AccessibilitySettings: Record<string, any> = settingsToObject([
    /** Checkbox setting - values can be true or false */
    new Setting("raiseActionButtons", false, {
        isUserFacing: true,
        uiInputType: UIInputType.Checkbox,
        readableTitle: "prop:accessibility.raiseActionButtons.title",
        readableDescription:
            "prop:accessibility.raiseActionButtons.descriptions",
    }),
]);

export default AccessibilitySettings;
