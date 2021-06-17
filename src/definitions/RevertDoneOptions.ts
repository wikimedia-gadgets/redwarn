import { DiffIconRevertContext } from "rww/mediawiki/Revert";
import i18next from "i18next";
import RedWarnUI from "rww/ui/RedWarnUI";
import { User, WarningManager } from "rww/mediawiki";

export enum RevertDoneOption {
    LatestRevision,
    NewMessage,
    QuickTemplate,
    WarnUser,
    Report,
    MoreOptions,
}

export interface RollbackDoneOptionDetails {
    name: string;
    /**
     * TODO: Move to per-style icon map.
     */
    icon: string;
    action: (context: DiffIconRevertContext) => any;
}

export const RevertDoneOptions: Record<
    RevertDoneOption,
    RollbackDoneOptionDetails
> = {
    [RevertDoneOption.LatestRevision]: {
        name: i18next.t("prefs:revert.revertDoneOption.options.latest"),
        icon: "watch_later",
        action: async (context): Promise<void> =>
            context.newRevision.page.navigateToLatestRevision(),
    },
    [RevertDoneOption.NewMessage]: {
        name: i18next.t("revert:rollbackDoneOptions.message"),
        icon: "send",
        action: (): void => {
            // TODO new message
            /* rw.ui.newMessage(un) */
        },
    },
    [RevertDoneOption.QuickTemplate]: {
        name: i18next.t("revert:rollbackDoneOptions.template"),
        icon: "library_add",
        action: (): void => {
            // TODO quick template
            /* rw.quickTemplate.openSelectPack(un) */
        },
    },
    [RevertDoneOption.WarnUser]: {
        name: i18next.t("revert:rollbackDoneOptions.warn"),
        icon: "report",
        action: async (context): Promise<void> => {
            const warningOptions = await new RedWarnUI.WarnDialog({
                targetUser: context.newRevision.user,
                defaultWarnReason:
                    typeof context.reason === "string"
                        ? undefined
                        : context.reason.actionType === "revert"
                        ? WarningManager.warnings[context.reason.warning]
                        : undefined,
                relatedPage: context.newRevision.page,
            }).show();
            await User.warn(warningOptions);
        },
    },
    [RevertDoneOption.Report]: {
        name: i18next.t("revert:rollbackDoneOptions.report"),
        icon: "gavel",
        action: (): void => {
            // TODO AIV
        },
    },
    [RevertDoneOption.MoreOptions]: {
        name: i18next.t("revert:rollbackDoneOptions.report"),
        icon: "more_vert",
        action: (): void => {
            // TODO open prefs menu
        },
    },
};
