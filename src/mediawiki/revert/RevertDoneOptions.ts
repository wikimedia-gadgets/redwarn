import { DiffIconRevertContext } from "app/mediawiki/revert/Revert";
import i18next from "i18next";
import RedWarnUI from "app/ui/RedWarnUI";
import { User, WarningManager } from "app/mediawiki";
import RedWarnWikiConfiguration from "app/config/wiki/RedWarnWikiConfiguration";
import {
    isPageModeReportVenue,
    ReportVenueDisplayLocations,
} from "app/mediawiki/report/ReportVenue";

export enum RevertDoneOption {
    LatestRevision,
    NewMessage,
    QuickTemplate,
    WarnUser,
    MultipleActionTool,
    MoreOptions,
}

export interface RevertDoneOptionDetails {
    name: string;
    /**
     * TODO: Move to per-style icon map.
     */
    icon: string;
    showOnRestore: boolean;
    action: (context: DiffIconRevertContext) => any;
}

export function ReportingRevertDoneOptions(): RevertDoneOptionDetails[] {
    const options: RevertDoneOptionDetails[] = [];

    for (const venue of RedWarnWikiConfiguration.c.reporting) {
        if (venue.display & ReportVenueDisplayLocations.RevertDoneOption) {
            options.push({
                name: i18next.t("revert:rollbackDoneOptions.report", {
                    venue: venue.shortName,
                }),
                icon: venue.icon,
                showOnRestore: false,
                action: (context): void => {
                    new RedWarnUI.ReportingDialog({
                        venue: venue,
                        target: isPageModeReportVenue(venue)
                            ? context.newRevision.page
                            : context.newRevision.user,
                    }).show();
                },
            });
        }
    }

    return options;
}

/* Implemented as a function in order to parse internationalization strings at runtime. */
export function RevertDoneOptions(): RevertDoneOptionDetails[] {
    return [
        {
            name: i18next.t("prefs:revert.revertDoneOption.options.latest"),
            icon: "watch_later",
            showOnRestore: true,
            action: async (context): Promise<void> =>
                context.newRevision.page.navigateToLatestRevision(),
        },
        {
            name: i18next.t("revert:rollbackDoneOptions.message"),
            icon: "send",
            showOnRestore: false,
            action: (context): void => {
                context.newRevision.user.openMessageDialog();
            },
        },
        {
            name: i18next.t("revert:rollbackDoneOptions.template"),
            icon: "library_add",
            showOnRestore: false,
            action: (): void => {
                RedWarnUI.Toast.quickShow({
                    content: i18next.t("ui:unfinished"),
                });
            },
        },
        {
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
                    relatedPage: context.newRevision.page,
                }).show();
                await User.warn(warningOptions);
            },
        },
        ...ReportingRevertDoneOptions(),
        {
            name: i18next.t("revert:rollbackDoneOptions.mat"),
            icon: "auto_fix_high",
            showOnRestore: true,
            action: (): void => {
                // TODO: Multiple Action Tool
                RedWarnUI.Toast.quickShow({
                    content: i18next.t("ui:unfinished"),
                });
            },
        },
        {
            name: i18next.t("revert:rollbackDoneOptions.options"),
            icon: "more_vert",
            showOnRestore: true,
            action: (): void => {
                new RedWarnUI.ExtendedOptions().show();
            },
        },
    ];
}
