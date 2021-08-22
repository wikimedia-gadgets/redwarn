import { DiffIconRevertContext } from "rww/mediawiki/Revert";
import i18next from "i18next";
import RedWarnUI from "rww/ui/RedWarnUI";
import { User, WarningManager } from "rww/mediawiki";
import MaterialToast from "rww/styles/material/ui/MaterialToast";

export enum RevertDoneOption {
    LatestRevision,
    NewMessage,
    QuickTemplate,
    WarnUser,
    Report,
    MultipleActionTool,
    MoreOptions,
}

export interface RollbackDoneOptionDetails {
    name: string;
    /**
     * TODO: Move to per-style icon map.
     */
    icon: string;
    showOnRestore: boolean;
    action: (context: DiffIconRevertContext) => any;
}
/* Implemented as a function in order to parse internationalization strings at runtime. */
export function RevertDoneOptions(): Record<
    RevertDoneOption,
    RollbackDoneOptionDetails
> {
    return {
        [RevertDoneOption.LatestRevision]: {
            name: i18next.t("prefs:revert.revertDoneOption.options.latest"),
            icon: "watch_later",
            showOnRestore: true,
            action: async (context): Promise<void> =>
                context.newRevision.page.navigateToLatestRevision()
        },
        [RevertDoneOption.NewMessage]: {
            name: i18next.t("revert:rollbackDoneOptions.message"),
            icon: "send",
            showOnRestore: false,
            action: (): void => {
                new MaterialToast({
                    content: "This feature has not been implemented yet."
                }).show();
            }
        },
        [RevertDoneOption.QuickTemplate]: {
            name: i18next.t("revert:rollbackDoneOptions.template"),
            icon: "library_add",
            showOnRestore: false,
            action: (): void => {
                new MaterialToast({
                    content: "This feature has not been implemented yet."
                }).show();
            }
        },
        [RevertDoneOption.WarnUser]: {
            name: i18next.t("revert:rollbackDoneOptions.warn"),
            icon: "report",
            showOnRestore: false,
            action: async (context): Promise<void> => {
                const warningOptions = await new RedWarnUI.WarnDialog({
                    targetUser: context.newRevision.user,
                    defaultWarnReason:
                        typeof context.reason === "string"
                            ? undefined
                            : context.reason.actionType === "revert"
                            ? WarningManager.warnings[context.reason.warning]
                            : undefined,
                    relatedPage: context.newRevision.page
                }).show();
                await User.warn(warningOptions);
            }
        },
        [RevertDoneOption.Report]: {
            name: i18next.t("revert:rollbackDoneOptions.report"),
            icon: "gavel",
            showOnRestore: false,
            action: (): void => {
                new MaterialToast({
                    content: "This feature has not been implemented yet."
                }).show();
            }
        },
        [RevertDoneOption.MultipleActionTool]: {
            name: i18next.t("revert:rollbackDoneOptions.mat"),
            icon: "auto_fix_high",
            showOnRestore: true,
            action: (): void => {
                // TODO: Multiple Action Tool
                new MaterialToast({
                    content: "This feature has not been implemented yet."
                }).show();
            }
        },
        [RevertDoneOption.MoreOptions]: {
            name: i18next.t("revert:rollbackDoneOptions.options"),
            icon: "more_vert",
            showOnRestore: true,
            action: (): void => {
                // TODO: Preferences
                new MaterialToast({
                    content: "This feature has not been implemented yet."
                }).show();
            }
        }
    };
}
