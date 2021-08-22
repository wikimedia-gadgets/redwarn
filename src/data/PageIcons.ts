import RedWarnStore from "rww/data/RedWarnStore";
import i18next from "i18next";
import RedWarnUI from "rww/ui/RedWarnUI";
import { Page, User } from "rww/mediawiki";

interface PageIcon {
    id: string;
    icon: string;
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
        visible: isUserspacePage,
        action() {
            new RedWarnUI.WarnDialog({
                targetUser:
                    mw.config.get("wgRelevantUserName") &&
                    User.fromUsername(mw.config.get("wgRelevantUserName"))
            }).show();
        }
    },
    {
        id: "protection",
        icon: "lock",
        default: true,
        visible: () => !isSpecialPage(),
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "alertOnChange",
        icon: "notification_important",
        default: true,
        visible: () => !isSpecialPage(),
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "latestRevision",
        icon: "watch_later",
        default: true,
        visible: () => !isSpecialPage(),
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "moreOptions",
        icon: "more_vert",
        default: true,
        required: true,
        visible: () => !isSpecialPage(),
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
        visible: isUserspacePage,
        action() {
            RedWarnUI.Toast.quickShow({ content: i18next.t("ui:unfinished") });
        }
    },
    {
        id: "reportTAS",
        icon: "phone_in_talk",
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
            window.location.href = "https://w.wiki/s6j";
        }
    }
];

export default PageIcons;
