import { RevertContext } from "rww/mediawiki/Revert";

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
        context: RevertContext,
        username: string,
        warnIndex: string
    ) => any;
}

export const RevertDoneOptions: Record<
    RevertDoneOption,
    RollbackDoneOptionDetails
> = {
    [RevertDoneOption.LatestRevision]: {
        name: "Go to latest revision",
        icon: "watch_later",
        action: async (context: RevertContext): Promise<void> =>
            (await context.newRevision.page.getLatestRevision()).navigate(),
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
