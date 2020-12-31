import { Warnings } from "rww/wikipedia/Warnings";
import WikipediaAPI from "rww/wikipedia/API";
import { RollbackContext } from "rww/definitions/RollbackContext";

export interface RollbackDoneOption {
    name: string;
    icon: string;
    action: (
        context: RollbackContext,
        username: string,
        warnIndex: keyof Warnings
    ) => any;
    id: string;
}

export const RollbackDoneOptions: RollbackDoneOption[] = [
    {
        name: "Go to latest revision",
        icon: "watch_later",
        action: (context: RollbackContext): Promise<void> =>
            WikipediaAPI.goToLatestRevision(context.targetRevision.page.title),
        id: "latestRev",
    },
    {
        name: "New Message",
        icon: "send",
        action: (): void => {
            // TODO new message
            /* rw.ui.newMessage(un) */
        },
        id: "newMsg",
    },
    {
        name: "Quick Template",
        icon: "library_add",
        action: (): void => {
            // TODO quick template
            /* rw.quickTemplate.openSelectPack(un) */
        },
        id: "quickTemplate",
    },
    {
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
        id: "warnUser",
    },
    {
        name: "Report to Admin",
        icon: "gavel",
        action: (): void => {
            // TODO admin report
            /* rw.ui.adminReportSelector(un) */
        },
        id: "reportUser",
    },
];
