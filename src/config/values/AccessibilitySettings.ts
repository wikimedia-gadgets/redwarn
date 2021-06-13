/*
 * Accessibility-related settings.
 */

import { Setting, UIInputType } from "../Setting";
import { ConfigurationSet } from "rww/config";
import i18next from "i18next";

const AccessibilitySettings = <ConfigurationSet>{
    /**
     * Whether or not action buttons should be raised.
     */
    raiseActionButtons: new Setting("raiseActionButtons", false, {
        uiInputType: UIInputType.Checkbox,
        title: i18next.t("prefs:accessibility.raiseActionButtons.title"),
        description: i18next.t(
            "prefs:accessibility.raiseActionButtons.description"
        ),
    }),
};

export default AccessibilitySettings;
