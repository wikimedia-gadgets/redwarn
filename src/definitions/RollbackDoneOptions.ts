import { Warnings } from "rww/mediawiki/Warnings";
import { RollbackContext } from "rww/definitions/RollbackContext";

export enum RollbackDoneOption {
    LatestRevision,
    NewMessage,
    QuickTemplate,
    WarnUser,
    Report,
}

// TODO This is a style-specific file. Please transfer accordingly.

export interface RollbackDoneOptionDetails {
    name: string;
    icon: string;
    action: (
        context: RollbackContext,
        username: string,
        warnIndex: keyof Warnings
    ) => any;
}

export const RollbackDoneOptions: Record<
    RollbackDoneOption,
    RollbackDoneOptionDetails
> = {
    [RollbackDoneOption.LatestRevision]: {
        name: "Go to latest revision",
        icon: "watch_later",
        action: async (context: RollbackContext): Promise<void> =>
            (await context.targetRevision.page.getLatestRevision()).navigate(),
    },
    [RollbackDoneOption.NewMessage]: {
        name: "New Message",
        icon: "send",
        action: (): void => {
            // TODO new message
            /* rw.ui.newMessage(un) */
        },
    },
    [RollbackDoneOption.QuickTemplate]: {
        name: "Quick Template",
        icon: "library_add",
        action: (): void => {
            // TODO quick template
            /* rw.quickTemplate.openSelectPack(un) */
        },
    },
    [RollbackDoneOption.WarnUser]: {
        name: "Warn User",
        icon: "report",
        action: (): void => {
            // TODO auto warn
            /* rw.ui.beginWarn(
                false,
                un,
                mw.config.get("wgRelevantPageName"),
                null,
                null,
                null,
                warnIndex != null ? warnIndex : null
            ) */
        },
    },
    [RollbackDoneOption.Report]: {
        name: "Report to Admin",
        icon: "gavel",
        action: (): void => {
            // TODO admin report
            /* rw.ui.adminReportSelector(un) */
        },
    },
};
