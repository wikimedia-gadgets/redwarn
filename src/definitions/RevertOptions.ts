import { Warnings } from "rww/mediawiki/Warnings";
import { RevertContext } from "./RevertContext";
import { Page } from "rww/mediawiki";
import i18next from "i18next";

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
    ruleIndex?: keyof Warnings;
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

type RevertAction = ActionCustom | ActionRevert | ActionPromptedRevert;

interface RevertActionBase {
    /**
     * Whether or not this option is enabled.
     */
    enabled: boolean;
    /**
     * The name of this rollback option.
     */
    name: string;
}

export type RevertOption = RevertActionBase & RevertAction;

export const RequiredRevertOptions: RevertOption[] = [
    {
        enabled: true,
        name: i18next.t("revert:rollback.name"),
        actionType: "promptedRevert",
    },
    {
        enabled: true,
        name: i18next.t("revert:agf.name"),
        actionType: "promptedRevert",
        defaultSummary: i18next.t("revert:agf.summary"),
    },
    {
        enabled: true,
        actionType: "custom",
        name: i18next.t("revert:preview.name"),
        action: (rollbackContext: RevertContext) => () => {
            // TODO: dev-rwTS-difficons
            // Rollback.preview(rollbackContext);
        },
    },
    {
        enabled: true,
        actionType: "custom",
        name: i18next.t("revert:quick-template.name"),
        action: (rollbackContext: RevertContext) => async () => {
            // TODO for later
        },
    },
    {
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
    public static readonly requiredOptions = RequiredRevertOptions;
    public static loadedOptions: RevertOption[];

    /**
     * Initialize these revert options.
     *
     * @param optionsData
     */
    public static async initialize(optionsData?: string): Promise<void> {
        if (!optionsData) {
            try {
                RevertOptions.loadedOptions = JSON.parse(
                    (
                        await Page.fromTitle(
                            "Project:RedWarn/Default Rollback Options"
                        ).getLatestRevision()
                    ).content
                ) as RevertOption[];
            } catch (e) {
                try {
                    RevertOptions.loadedOptions = await fetch(
                        ((): string => {
                            const url = new URL(
                                "//en.wikipedia.org/w/index.php"
                            );

                            url.searchParams.set(
                                "title",
                                "Wikipedia:RedWarn/Default Rollback Options"
                            );
                            url.searchParams.set("action", "raw");
                            url.searchParams.set("ctype", "application/json");

                            return url.toString();
                        })()
                    ).then((req) => req.json());
                } catch (e) {
                    // TODO: Proper errors
                    throw new Error("Failed to initialize revert options.");
                }
            }
        }
    }
}
