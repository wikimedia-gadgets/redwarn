/**
 * Responsible for watching page changes.
 *
 * This class is available in every loaded page of Wikipedia, therefore it can
 * simply be used as a static class.
 */
import RedWarnLocalDB from "rww/data/RedWarnLocalDB";
import RedWarnStore from "rww/data/RedWarnStore";
import RedWarnUI from "rww/ui/RedWarnUI";
import i18next from "i18next";
import { MediaWikiAPI } from "rww/mediawiki/API";
import redirect from "rww/util/redirect";
import { MediaWikiURL } from "rww/mediawiki/URL";
import { formatAge } from "rww/util";

export class Watch {
    static active = false;

    private static timeout: number;
    private static lastRevId: number;

    static get watchedPages(): typeof RedWarnLocalDB.i.watchedPages {
        return RedWarnLocalDB.i.watchedPages;
    }
    static get page(): typeof RedWarnStore.currentPage {
        return RedWarnStore.currentPage;
    }

    static async init(): Promise<void> {
        // Check if this page was already being watched before.
        if (await Watch.watchedPages.get(`${Watch.page.title}`)) {
            Watch.enable();
        }
    }

    static async toggle(): Promise<void> {
        if (Watch.active) Watch.disable();
        else Watch.enable();
    }

    static async enable(): Promise<void> {
        if (Notification.permission === "default")
            await Notification.requestPermission();

        // Handle both post-request denials and already denied cases.
        if (Notification.permission === "denied") {
            RedWarnUI.Toast.quickShow({
                content: `${i18next.t("ui:watch.denied")}`
            });
            return;
        }

        Watch.active = true;
        if (!(await Watch.watchedPages.get(`${Watch.page.title}`))) {
            await Watch.watchedPages.add({ title: `${Watch.page.title}` });
        }

        document.documentElement.style.setProperty(
            "--rw-icon-alertonchange-color",
            "green"
        );
        RedWarnUI.Toast.quickShow({
            content: `${i18next.t("ui:watch.watching", {
                page: Watch.page.title.getPrefixedText()
            })}`
        });

        Watch.lastRevId = mw.config.get("wgCurRevisionId");

        Watch.check();
        Watch.timeout = window.setTimeout(Watch.check, 1000);
    }

    static async disable(): Promise<void> {
        Watch.active = false;
        if (await Watch.watchedPages.get(`${Watch.page.title}`)) {
            await Watch.watchedPages.delete(`${Watch.page.title}`);
        }

        document.documentElement.style.removeProperty(
            "--rw-icon-alertonchange-color"
        );
        RedWarnUI.Toast.quickShow({
            content: `${i18next.t("ui:watch.stoppedWatching", {
                page: Watch.page.title.getPrefixedText()
            })}`
        });

        window.clearTimeout(Watch.timeout);
    }

    static async check(): Promise<void> {
        if (!Watch.active)
            // Stop immediately if already inactive.
            return window.clearTimeout(Watch.timeout);

        // Get all new revisions since the latest.
        const newRevisionsRequest = await MediaWikiAPI.get({
            action: "query",
            format: "json",
            prop: "revisions",
            titles: Watch.page.title.getPrefixedText(),
            rvprop: "ids|timestamp|flags|comment|user",
            // Inclusive, so increment revision ID by 1.
            rvstartid: Watch.lastRevId + 1,
            rvdir: "newer"
        });

        const revisions: Record<string, any>[] = (
            (Object.values(newRevisionsRequest["query"]["pages"])[0] as Record<
                string,
                any
            >)["revisions"] ?? []
        ).filter((v: any) => v.revid !== Watch.lastRevId);

        if (revisions.length > 0) {
            // New revisions detected.
            if (RedWarnStore.windowFocused) {
                // TODO: Preferences
                redirect(MediaWikiURL.getDiffUrl(revisions[0].revid));
            } else {
                document.title = `${i18next.t("ui:watch.prefix")}${
                    document.title
                }`;
                const notification = new Notification(
                    `${i18next.t("ui:watch.notification.title", {
                        count: revisions.length,
                        page: Watch.page.title.getPrefixedText()
                    })}`,
                    {
                        body: `${i18next.t(
                            "ui:watch.notification.header"
                        )}\n\n${i18next.t("ui:watch.notification.diff", {
                            author: revisions[0].user,
                            since: formatAge(new Date(revisions[0].timestamp)),
                            comment: revisions[0].comment
                        })}`,
                        image: RedWarnStore.wikiLogo
                    }
                );
                document.addEventListener("focus", () => {
                    redirect(MediaWikiURL.getDiffUrl(revisions[0].revid));
                });
                notification.addEventListener("click", () => {
                    // Focus on us.
                    window.focus();
                    notification.close();
                });
            }
            window.clearTimeout(Watch.timeout);
        } else {
            Watch.timeout = window.setTimeout(Watch.check, 1000);
        }
    }
}
