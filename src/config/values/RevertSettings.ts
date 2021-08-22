/*
 * Revert settings.
 */

import { RevertMethod } from "..";
import { Setting, UIInputType } from "../Setting";
import i18next from "i18next";
import { RevertDoneOption } from "rww/data/RevertDoneOptions";

type RevertOptionOverrides = Record<
    string,
    Partial<{
        enabled: boolean;
        color: string;
        icon: string;
        name: string;
        warning: string;
        summary: string;
        // TODO: Order
    }>
>;

const RevertSettings = {
    /**
     * Revert options. Since revert options are determined per wiki, a value
     * of `null` means the default per-wiki options will be used. If this is
     * not null, this should be a list of per-wiki revert option overrides.
     *
     * Options are shown in the order that they are stored. Options that
     * aren't in this menu are stored in the "More Options" panel.
     */
    revertOptions: new Setting<RevertOptionOverrides>("revertOptions", null, {
        title: i18next.t("prefs:revert.revertOption.title"),
        description: i18next.t("prefs:revert.revertOption.description"),
        uiInputType: UIInputType.RevertOptions
    }),

    /**
     * Revert done option that is automatically executed on revert complete.
     *
     * If this is empty, the user will be prompted for the next action.
     */
    revertDoneOption: new Setting<string[]>("revertDoneOption", [], {
        title: i18next.t("prefs:revert.revertDoneOption.title"),
        description: i18next.t("prefs:revert.revertDoneOption.description"),
        // Enable support for multiple actions (e.g. latest revision and user warning.)
        uiInputType: UIInputType.Checkboxes,
        validOptions: [
            {
                name: i18next.t("prefs:revert.revertDoneOption.options.latest"),
                value: RevertDoneOption.LatestRevision
            },
            {
                name: i18next.t(
                    "prefs:revert.revertDoneOption.options.message"
                ),
                value: RevertDoneOption.NewMessage
            },
            {
                name: i18next.t(
                    "prefs:revert.revertDoneOption.options.template"
                ),
                value: RevertDoneOption.QuickTemplate
            },
            {
                name: i18next.t("prefs:revert.revertDoneOption.options.warn"),
                value: RevertDoneOption.WarnUser
            }
            // Do not encourage automatic reporting to AIV.
        ]
    }),

    /** Method of revert */
    revertMethod: new Setting<RevertMethod>("revertMethod", RevertMethod.Undo, {
        title: i18next.t("prefs:revert.revertMethod.title"),
        description: i18next.t("prefs:revert.revertMethod.description"),
        uiInputType: UIInputType.Radio,
        validOptions: [
            {
                name: i18next.t("prefs:revert.revertMethod.options.rollback"),
                value: RevertMethod.Rollback
            },
            {
                name: i18next.t("prefs:revert.revertMethod.options.undo"),
                value: RevertMethod.Undo
            }
        ]
    }),

    /** Whether or not to redirect to the latest revision if one was found. */
    redirectIfNotLatest: new Setting<boolean>("redirectIfNotLatest", false, {
        title: i18next.t("prefs:revert.redirectIfNotLatest.title"),
        description: i18next.t("prefs:revert.redirectIfNotLatest.description"),
        uiInputType: UIInputType.Switch
    }),

    /**
     * Whether or not to ignore the latest revision if it was made by the same
     * user and has no intermediate edits.
     */
    ignoreSameUserLatest: new Setting<boolean>("ignoreSameUserLatest", true, {
        title: i18next.t("prefs:revert.ignoreSameUserLatest.title"),
        description: i18next.t("prefs:revert.ignoreSameUserLatest.description"),
        uiInputType: UIInputType.Switch
    })
};

export default RevertSettings;
