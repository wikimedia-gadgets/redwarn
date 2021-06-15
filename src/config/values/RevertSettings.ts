/*
 * Revert settings.
 */

import { ConfigurationSet, RevertMethod } from "..";
import { Setting, UIInputType } from "../Setting";
import i18next from "i18next";
import { RevertDoneOption } from "rww/definitions/RevertDoneOptions";

const RevertSettings = <ConfigurationSet>{
    /**
     * Revert done option that is automatically executed on rollback complete.
     *
     * If this is empty, the user will be prompted for the next action.
     */
    revertDoneOption: new Setting<string[]>("rollbackDoneOption", [], {
        title: i18next.t("prefs:revert.revertDoneOption.title"),
        description: i18next.t("prefs:revert.revertDoneOption.description"),
        // Enable support for multiple actions (e.g. latest revision and user warning.)
        uiInputType: UIInputType.Checkboxes,
        validOptions: [
            {
                name: i18next.t("prefs:revert.revertDoneOption.options.latest"),
                value: RevertDoneOption.LatestRevision,
            },
            {
                name: i18next.t(
                    "prefs:revert.revertDoneOption.options.message"
                ),
                value: RevertDoneOption.NewMessage,
            },
            {
                name: i18next.t(
                    "prefs:revert.revertDoneOption.options.template"
                ),
                value: RevertDoneOption.QuickTemplate,
            },
            {
                name: i18next.t("prefs:revert.revertDoneOption.options.warn"),
                value: RevertDoneOption.WarnUser,
            },
        ],
    }),

    /** Method of rollback */
    revertMethod: new Setting("revertMethod", RevertMethod.Undo, {
        title: i18next.t("prefs:revert.revertMethod.title"),
        description: i18next.t("prefs:revert.revertMethod.description"),
        uiInputType: UIInputType.Radio,
        validOptions: [
            {
                name: i18next.t("prefs:revert.revertMethod.options.rollback"),
                value: RevertMethod.Rollback,
            },
            {
                name: i18next.t("prefs:revert.revertMethod.options.undo"),
                value: RevertMethod.Undo,
            },
        ],
    }),
};

export default RevertSettings;
