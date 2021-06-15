import i18next from "i18next";
import type { RevertContext } from "rww/mediawiki/Revert";
import RedWarnWikiConfiguration from "rww/data/RedWarnWikiConfiguration";

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
    action: (revertContext: RevertContext) => any;
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
}

export type RevertOption = (RevertActionBase & RevertAction) & {
    /**
     * System options are those built into RedWarn.
     * The wiki-specific configuration should not have this as true.
     */
    system?: true;
};
export type SerializableRevertOption = RevertActionBase &
    SerializableRevertAction;

export const RequiredRevertOptions: RevertOption[] = [
    {
        system: true,
        enabled: true,
        name: i18next.t("revert:rollback.name"),
        actionType: "promptedRevert",
    },
    {
        system: true,
        enabled: true,
        name: i18next.t("revert:agf.name"),
        actionType: "promptedRevert",
        defaultSummary: i18next.t("revert:agf.summary"),
    },
    {
        system: true,
        enabled: true,
        actionType: "custom",
        name: i18next.t("revert:preview.name"),
        action: (rollbackContext: RevertContext) => () => {
            // TODO: dev-rwTS-difficons
            // Revert.preview(rollbackContext);
        },
    },
    {
        system: true,
        enabled: true,
        actionType: "custom",
        name: i18next.t("revert:quick-template.name"),
        action: (rollbackContext: RevertContext) => async () => {
            // TODO for later
        },
    },
    {
        system: true,
        enabled: true,
        actionType: "custom",
        name: i18next.t("revert:more-options.name"),
        action: (rollbackContext: RevertContext) => {
            // TODO: dev-rwTS-difficons
            // RedWarnUI.openExtendedOptionsDialog({ rollbackContext })
        },
    },
];

export default class RevertOptions {
    public static readonly required = RequiredRevertOptions;
    public static get loaded(): RevertOption[] {
        return RedWarnWikiConfiguration.c.revertOptions;
    }
    public static get all(): RevertOption[] {
        return [...RevertOptions.required, ...RevertOptions.loaded];
    }
}
