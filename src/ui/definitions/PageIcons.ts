import RedWarnStore from "rww/data/RedWarnStore";
import i18next from "i18next";
import RedWarnUI from "rww/ui/RedWarnUI";
import { Page, ProtectionManager, User, Watch } from "rww/mediawiki";
import { redirect } from "rww/util";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import Log from "rww/data/RedWarnLog";

interface PageIcon {
    id: string;
    icon: string;
    color?: string;
    /** Whether or not this icon is on the toolbar by default. */
    default?: boolean;
    /** Whether or not this icon is required on the toolbar. */
    required?: boolean;
    visible(): PromiseOrNot<boolean>;
    action(event: MouseEvent): Promise<any> | void;
}

function isUserspacePage() {
    return Page.isUserspacePage(RedWarnStore.currentPage) !== false;
}

function isSpecialPage() {
    return Page.isSpecialPage(RedWarnStore.currentPage) !== false;
}

const PageIcons: PageIcon[] = [
    {
        id: "message",
        icon: "send",
        default: true,
        visible: isUserspacePage,
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "quickTemplate",
        icon: "library_add",
        default: true,
        visible: isUserspacePage,
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "warn",
        icon: "report",
        default: true,
        visible: () =>
            isUserspacePage() && RedWarnWikiConfiguration.c.warnings != null,
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
                                text: i18next.t("ui:toasts.userWarnedAction"),
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
    },
    {
        id: "protection",
        icon: "lock",
        default: true,
        visible: () =>
            !isSpecialPage() &&
            RedWarnWikiConfiguration.c.protection?.duration?.temporary !=
                null &&
            RedWarnWikiConfiguration.c.protection?.duration?.indefinite != null,
        async action() {
            const options = await new RedWarnUI.ProtectionRequestDialog().show();
            ProtectionManager.requestProtection(options)
                .then((v) => {
                    if (v) {
                        RedWarnUI.Toast.quickShow({
                            content: i18next.t("ui:toasts.protectionRequested"),
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
                        content: i18next.t("ui:toasts.protectionRequestFailed")
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
        visible: () => !isSpecialPage(),
        action() {
            Watch.toggle();
        }
    },
    {
        id: "latestRevision",
        icon: "watch_later",
        default: true,
        visible: () => !isSpecialPage(),
        action() {
            RedWarnStore.currentPage.navigateToLatestRevision();
        }
    },
    {
        id: "moreOptions",
        icon: "more_vert",
        default: true,
        required: true,
        visible: () => !isSpecialPage(),
        action() {
            new RedWarnUI.ExtendedOptions().show();
        }
    },
    {
        id: "vandalismStatistics",
        icon: "auto_graph",
        visible: () => true,
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "reportAIV",
        icon: "flag",
        visible: isUserspacePage,
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "reportUAA",
        icon: "person_remove",
        visible: isUserspacePage,
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "reportOversight",
        icon: "visibility_off",
        color: "midnightblue",
        visible: isUserspacePage,
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "reportTAS",
        icon: "phone_in_talk",
        color: "red",
        visible: isUserspacePage,
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "preferences",
        icon: "settings",
        visible: () => true,
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
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

export default PageIcons;
