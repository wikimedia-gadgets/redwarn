/*
 * Revert settings.
 */

import { RevertMethod } from "..";
import { Setting, UIInputType } from "../Setting";
import i18next from "i18next";
import { RevertDoneOption } from "rww/definitions/RevertDoneOptions";

const RevertSettings = {
    /**
     * Revert done option that is automatically executed on revert complete.
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

    /** Method of revert */
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

    /** Whether or not to redirect to the latest revision if one was found. */
    redirectIfNotLatest: new Setting("redirectIfNotLatest", false, {
        title: i18next.t("prefs:revert.redirectIfNotLatest.title"),
        description: i18next.t("prefs:revert.redirectIfNotLatest.description"),
        uiInputType: UIInputType.Switch,
    }),

    /**
     * Whether or not to ignore the latest revision if it was made by the same
     * user and has no intermediate edits.
     */
    ignoreSameUserLatest: new Setting("ignoreSameUserLatest", true, {
        title: i18next.t("prefs:revert.ignoreSameUserLatest.title"),
        description: i18next.t("prefs:revert.ignoreSameUserLatest.description"),
        uiInputType: UIInputType.Switch,
    }),
};

export default RevertSettings;
