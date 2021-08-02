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
        ),
    }),
};

export default AccessibilitySettings;
