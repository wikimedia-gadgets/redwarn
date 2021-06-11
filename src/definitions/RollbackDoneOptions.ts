import { Warnings } from "rww/mediawiki/Warnings";
import { RollbackContext } from "rww/definitions/RollbackContext";

export enum RevertDoneOption {
    LatestRevision,
    NewMessage,
    QuickTemplate,
    WarnUser,
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
    RevertDoneOption,
    RollbackDoneOptionDetails
> = {
    [RevertDoneOption.LatestRevision]: {
        name: "Go to latest revision",
        icon: "watch_later",
        action: async (context: RollbackContext): Promise<void> =>
            (await context.targetRevision.page.getLatestRevision()).navigate(),
    },
    [RevertDoneOption.NewMessage]: {
        name: "New Message",
        icon: "send",
        action: (): void => {
            // TODO new message
            /* rw.ui.newMessage(un) */
        },
    },
    [RevertDoneOption.QuickTemplate]: {
        name: "Quick Template",
        icon: "library_add",
        action: (): void => {
            // TODO quick template
            /* rw.quickTemplate.openSelectPack(un) */
        },
    },
    [RevertDoneOption.WarnUser]: {
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
};
