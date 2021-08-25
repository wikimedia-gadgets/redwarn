import i18next from "i18next";
import type { RevertContext } from "rww/mediawiki/revert/Revert";
import { RevertContextBase } from "rww/mediawiki/revert/Revert";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import { redirect, url } from "rww/util";
import RedWarnStore from "rww/data/RedWarnStore";
import RedWarnUI from "rww/ui/RedWarnUI";
import { Configuration } from "rww/config/user/Configuration";

export enum ActionSeverity {
    Neutral,
    GoodFaith,
    Mild,
    Moderate,
    Severe,
    Critical,
}

/**
 * An action with a predefined revert summary.
 */
interface ActionRevert {
    actionType: "revert";
    /**
     * The predefined summary for this revert reason in wikitext.
     */
    summary: string;
    /**
     * The index of the warning in the list of warnings.
     */
    warning: string;
}

/**
 * An action with a revert summary which requires input from the user.
 */
interface ActionPromptedRevert {
    actionType: "promptedRevert";
    /**
     * The prefilled summary for this revert reason in wikitext.
     */
    defaultSummary?: string;
}

/**
 * An action with a custom edit summary.
 */
interface ActionCustom {
    actionType: "custom";
    /**
     * This action will be called to perform whatever function.
     * @param revertContext The context of this revert.
     */
    action: (revertContext: RevertContextBase) => any;
}

export type RevertAction = ActionCustom | ActionRevert | ActionPromptedRevert;
export type SerializableRevertAction = ActionRevert | ActionPromptedRevert;

interface RevertActionBase {
    /**
     * Whether or not this option is enabled.
     */
    enabled: boolean;
    /**
     * Whether or not this option is supposed to show by default.
     */
    default?: boolean;
    /**
     * The name of this revert option.
     */
    name: string;
    /**
     * The icon for the action.
     */
    icon: string;
}

export type RevertOption = (RevertActionBase & RevertAction) & {
    /**
     * The ID of this option.
     */
    id: string;
    /**
     * The severity of the option.
     */
    severity: ActionSeverity;
    /**
     * System options are those built into RedWarn.
     * The wiki-specific configuration should not have this as true.
     */
    system?: true;
    /**
     * A custom CSS color for this option.
     */
    color?: string;
};
export type SerializableRevertOption = RevertActionBase &
    SerializableRevertAction & {
        /**
         * The severity of the action. This determines the color of
         * the revert button.
         */
        severity: keyof typeof ActionSeverity;
    };

/* Implemented as a function in order to parse internationalization strings at runtime. */
export function RequiredRevertOptions(): Record<string, RevertOption> {
    return {
        revert: {
            id: "revert",
            system: true,
            enabled: true,
            name: i18next.t("revert:rollbackOptions.rollback.name"),
            actionType: "promptedRevert",
            severity: ActionSeverity.Mild,
            icon: "replay"
        },
        goodFaithRollback: {
            id: "goodFaithRollback",
            system: true,
            enabled: true,
            name: i18next.t("revert:rollbackOptions.agf.name"),
            actionType: "promptedRevert",
            defaultSummary: i18next.t("revert:rollbackOptions.agf.summary"),
            severity: ActionSeverity.GoodFaith,
            icon: "thumb_up"
        },
        preview: {
            id: "preview",
            system: true,
            enabled: true,
            actionType: "custom",
            name: i18next.t("revert:rollbackOptions.preview.name"),
            action: async (rollbackContext: RevertContext) => {
                // TODO: Toast on reload.
                RedWarnUI.Toast.quickShow({
                    content: "Redirecting to preview..."
                });
                redirect(
                    url(RedWarnStore.wikiIndex, {
                        diff: rollbackContext.oldRevision.revisionID,
                        oldid: rollbackContext.newRevision.revisionID
                    })
                );
            },
            severity: ActionSeverity.Neutral,
            icon: "compare_arrows"
        },
        quickTemplate: {
            id: "quickTemplate",
            system: true,
            enabled: true,
            actionType: "custom",
            name: i18next.t("revert:rollbackOptions.quick-template.name"),
            action: () => async () => {
                // TODO: Quick Template
                RedWarnUI.Toast.quickShow({
                    content: "This feature has not been implemented yet."
                });
            },
            severity: ActionSeverity.Neutral,
            icon: "library_add"
        },
        moreOptions: {
            id: "moreOptions",
            system: true,
            enabled: true,
            actionType: "custom",
            name: i18next.t("revert:rollbackOptions.more-options.name"),
            action: () => {
                // TODO: Preferences
                RedWarnUI.Toast.quickShow({
                    content: "This feature has not been implemented yet."
                });
            },
            severity: ActionSeverity.Neutral,
            icon: "more_vert"
        }
    };
}

export default class RevertOptions {
    public static get loaded(): Record<string, RevertOption> {
        // Shallow copy
        const options: Record<string, RevertOption> = {};

        for (const [id, revertOption] of Object.entries(
            RedWarnWikiConfiguration.c.revertOptions
        )) {
            options[id] = Object.assign(
                {},
                revertOption,
                Configuration.Revert.revertOptions.value?.[id] ?? {}
            );

            if (options[id].enabled == null) {
                options[id].enabled = options[id].default ?? false;
            }
        }

        return options;
    }
    public static get all(): Record<string, RevertOption> {
        return { ...RevertOptions.loaded, ...RequiredRevertOptions() };
    }
    public static get allArray(): RevertOption[] {
        return [
            ...Object.values(RevertOptions.loaded),
            ...Object.values(RequiredRevertOptions())
        ];
    }
}
