import i18next from "i18next";
import type { RevertContext } from "rww/mediawiki/Revert";
import { RevertContextBase } from "rww/mediawiki/Revert";
import RedWarnWikiConfiguration from "rww/data/RedWarnWikiConfiguration";

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
 * An action with a custom
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
     * The name of this revert option.
     */
    name: string;
    /**
     * The icon for the action.
     *
     * TODO: Move to per-style icon map.
     */
    icon: string;
}

export type RevertOption = (RevertActionBase & RevertAction) & {
    /**
     * The ID of this action.
     */
    id: string;
    /**
     * The severity of the action.
     */
    severity: ActionSeverity;
    /**
     * System options are those built into RedWarn.
     * The wiki-specific configuration should not have this as true.
     */
    system?: true;
};
export type SerializableRevertOption = RevertActionBase &
    SerializableRevertAction & {
        /**
         * The severity of the action.
         */
        severity: keyof typeof ActionSeverity;
    };

export const RequiredRevertOptions: Record<string, RevertOption> = {
    revert: {
        id: "revert",
        system: true,
        enabled: true,
        name: i18next.t("revert:rollbackOptions.rollback.name"),
        actionType: "promptedRevert",
        severity: ActionSeverity.Mild,
        icon: "replay",
    },
    goodFaithRollback: {
        id: "goodFaithRollback",
        system: true,
        enabled: true,
        name: i18next.t("revert:rollbackOptions.agf.name"),
        actionType: "promptedRevert",
        defaultSummary: i18next.t("revert:rollbackOptions.agf.summary"),
        severity: ActionSeverity.GoodFaith,
        icon: "thumb_up",
    },
    preview: {
        id: "preview",
        system: true,
        enabled: true,
        actionType: "custom",
        name: i18next.t("revert:rollbackOptions.preview.name"),
        action: (rollbackContext: RevertContext) => () => {
            // TODO: dev-rwTS-difficons
            // Revert.preview(rollbackContext);
        },
        severity: ActionSeverity.Neutral,
        icon: "compare_arrows",
    },
    quickTemplate: {
        id: "quickTemplate",
        system: true,
        enabled: true,
        actionType: "custom",
        name: i18next.t("revert:rollbackOptions.quick-template.name"),
        action: (rollbackContext: RevertContext) => async () => {
            // TODO for later
        },
        severity: ActionSeverity.Neutral,
        icon: "library_add",
    },
    moreOptions: {
        id: "moreOptions",
        system: true,
        enabled: true,
        actionType: "custom",
        name: i18next.t("revert:rollbackOptions.more-options.name"),
        action: (rollbackContext: RevertContext) => {
            // TODO: dev-rwTS-difficons
            // RedWarnUI.openExtendedOptionsDialog({ rollbackContext })
        },
        severity: ActionSeverity.Neutral,
        icon: "more_vert",
    },
};

export default class RevertOptions {
    public static readonly required = RequiredRevertOptions;
    public static get loaded(): Record<string, RevertOption> {
        return RedWarnWikiConfiguration.c.revertOptions;
    }
    public static get all(): Record<string, RevertOption> {
        return { ...RevertOptions.loaded, ...RevertOptions.required };
    }
    public static get allArray(): RevertOption[] {
        return [
            ...Object.values(RevertOptions.loaded),
            ...Object.values(RevertOptions.required),
        ];
    }
}
