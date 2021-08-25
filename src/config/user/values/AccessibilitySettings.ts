/*
 * Accessibility-related settings.
 */

import { Setting, UIInputType } from "../Setting";
import i18next from "i18next";

const AccessibilitySettings = {
    /**
     * Whether or not action buttons should be raised.
     */
    raiseActionButtons: new Setting("raiseActionButtons", false, {
        uiInputType: UIInputType.Switch,
        title: i18next.t("prefs:accessibility.raiseActionButtons.title"),
        description: i18next.t(
            "prefs:accessibility.raiseActionButtons.description"
        )
    }),

    // To enable/disable high contrast mode
    highContrast: new Setting("highContrast", false, {
        uiInputType: UIInputType.Switch,
        title: i18next.t("prefs:accessibility.highContrast.title"),
        description: i18next.t("prefs:accessibility.highContrast.description")
    })
};

export default AccessibilitySettings;
