import RedWarnStore from "rww/data/RedWarnStore";
import i18next from "i18next";
import RedWarnUI from "rww/ui/RedWarnUI";
import { ProtectionManager, User, Watch } from "rww/mediawiki";
import { redirect } from "rww/util";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import Log from "rww/data/RedWarnLog";
import { getReportVenueIcons } from "rww/mediawiki/report/ReportVenue";

interface PageIconBase {
    icon: string;
    color?: string;
    /** Whether or not this icon is on the toolbar by default. */
    default?: boolean;
    /** Whether or not this icon is required on the toolbar. */
    required?: boolean;
    visible(): PromiseOrNot<boolean>;
    action(event: MouseEvent): Promise<any> | void;
}

export type PageIcon = PageIconBase &
    ({ id: string; name?: never } | { id?: string; name: string });

export const PageIcons = (): PageIcon[] => {
    const defaultUserIcons = [
        {
            id: "message",
            icon: "send",
            default: true,
            visible: RedWarnStore.isUserspacePage,
            action() {
                RedWarnUI.Toast.quickShow({
                    content: i18next.t("ui:unfinished")
                });
            }
        },
        {
            id: "quickTemplate",
            icon: "library_add",
            default: true,
            visible: RedWarnStore.isUserspacePage,
            action() {
                RedWarnUI.Toast.quickShow({
                    content: i18next.t("ui:unfinished")
                });
            }
        },
        {
            id: "warn",
            icon: "report",
            default: true,
            visible: () =>
                RedWarnStore.isUserspacePage() &&
                RedWarnWikiConfiguration.c.warnings != null,
            async action() {
                const options = await new RedWarnUI.WarnDialog({
                    targetUser:
                        mw.config.get("wgRelevantUserName") &&
                        User.fromUsername(mw.config.get("wgRelevantUserName"))
                }).show();
                User.warn(options)
                    .then((v) => {
                        if (v) {
                            RedWarnUI.Toast.quickShow({
                                content: i18next.t("ui:toasts.userWarned"),
                                action: {
                                    text: i18next.t(
                                        "ui:toasts.userWarnedAction"
                                    ),
                                    callback: () => {
                                        options.targetUser.talkPage.navigate();
                                    }
                                }
                            });
                        }
                    })
                    .catch((e) => {
                        // TODO: Provide more details.
                        RedWarnUI.Toast.quickShow({
                            content: i18next.t("ui:toasts.userWarnFailed")
                        });
                        Log.error(e);
                    });
            }
        }
    ];

    const defaultIcons = [
        {
            id: "protection",
            icon: "lock",
            default: true,
            visible: () =>
                !RedWarnStore.isSpecialPage() &&
                RedWarnWikiConfiguration.c.protection?.duration?.temporary !=
                    null &&
                RedWarnWikiConfiguration.c.protection?.duration?.indefinite !=
                    null,
            async action() {
                const options = await new RedWarnUI.ProtectionRequestDialog().show();
                ProtectionManager.requestProtection(options)
                    .then((v) => {
                        if (v) {
                            RedWarnUI.Toast.quickShow({
                                content: i18next.t(
                                    "ui:toasts.protectionRequested"
                                ),
                                action: {
                                    text: i18next.t("ui:toasts.viewAction"),
                                    callback: () => {
                                        v.navigate();
                                    }
                                }
                            });
                        }
                    })
                    .catch((e) => {
                        // TODO: Provide more details.
                        RedWarnUI.Toast.quickShow({
                            content: i18next.t(
                                "ui:toasts.protectionRequestFailed"
                            )
                        });
                        Log.error(e);
                    });
            }
        },
        {
            id: "alertOnChange",
            icon: "notification_important",
            default: true,
            color: "var(--rw-icon-alertonchange-color, black)",
            visible: () => !RedWarnStore.isSpecialPage(),
            action() {
                Watch.toggle();
            }
        },
        {
            id: "latestRevision",
            icon: "watch_later",
            default: true,
            visible: () => !RedWarnStore.isSpecialPage(),
            action() {
                RedWarnStore.currentPage.navigateToLatestRevision();
            }
        }
    ];

    const nondefaultIcons = [
        {
            id: "vandalismStatistics",
            icon: "auto_graph",
            visible: () => true,
            action() {
                new RedWarnUI.IFrameDialog({
                    src: "https://redwarn.toolforge.org/tools/rpm/",
                    width: "90vw"
                }).show();
            }
        }
    ];

    const footerIcons = [
        {
            id: "preferences",
            icon: "settings",
            visible: () => true,
            action() {
                RedWarnUI.Toast.quickShow({
                    content: i18next.t("ui:unfinished")
                });
            }
        },
        {
            id: "rwTalk",
            icon: "question_answer",
            visible: () => true,
            action() {
                redirect("https://w.wiki/s6j", true);
            }
        }
    ];

    return [
        ...defaultUserIcons,
        ...getReportVenueIcons(),
        ...defaultIcons,
        ...nondefaultIcons,
        ...footerIcons,
        {
            // Always required.
            id: "moreOptions",
            icon: "more_vert",
            default: true,
            required: true,
            visible: () => !RedWarnStore.isSpecialPage(),
            action() {
                new RedWarnUI.ExtendedOptions().show();
            }
        }
    ];
};

export default PageIcons;
