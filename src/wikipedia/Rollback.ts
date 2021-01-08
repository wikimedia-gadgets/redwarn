import i18next from "i18next";
import { RW_VERSION_TAG, RW_WIKIS_TAGGABLE } from "rww/data/RedWarnConstants";
import RedWarnStore from "rww/data/RedWarnStore";
import RWUI from "rww/ui/RWUI";
import redirect from "rww/util/redirect";
import WikipediaAPI from "./API";
import Revision from "./Revision";
import WikipediaURL from "./URL";
import { Warnings } from "./Warnings";
import Page from "./Page";
import DiffViewerInjector from "rww/ui/injectors/DiffViewerInjector";
import { RollbackContext } from "rww/definitions/RollbackContext";
import Config, { rollbackMethod } from "rww/config";

// interface RollbackContext {
//     reason: string;
//     defaultWarnIndex?: keyof Warnings;
//     showRollbackDoneOptions?: boolean;
//     targetRevision: Revision;
// }

export default class Rollback {
    /**
     * Determines whether the given page is a diff page, and whether or not it
     * displays a single revision (if that revision is the only page revision) or
     * two revisions (a normal diff page).
     *
     * wgDiffOldId is "false" if there is only one revision. Both wgDiffOldId and
     * wgDiffNewId are null when the page is not a revision page.
     *
     * @returns `"onlyrev"` if the view shows the only page revision.
     * `true` if the diff view shows two revisions.
     * `false` if the page is not a diff page.
     */
    static isDiffPage(): true | "onlyrev" | false {
        return mw.config.get("wgDiffOldId") === false
            ? "onlyrev"
            : !!mw.config.get("wgDiffNewId");
    }

    /**
     * Ask the user to provide a restoration reason and then restore the
     * given page revision with that reason.
     *
     * @param targetRevision The target revision.
     */
    static async promptRestoreReason(targetRevision: Revision): Promise<void> {
        const dialog = new RWUI.InputDialog(i18next.t("ui:restore"));
        const reason = await dialog.show();
        if (reason !== null) {
            Rollback.restore(targetRevision, reason);
        }
    }

    /**
     * Restore a previous page version. This will undo all edits made after
     * the target revision and replace the page's latest content with the
     * content of the target revision.
     *
     * @param targetRevision The revision to restore to.
     * @param reason The reason for restoring.
     */
    static async restore(
        targetRevision: Revision,
        reason: string
    ): Promise<boolean> {
        if (!targetRevision.isPopulated()) targetRevision.populate();
        const latestRevision = await targetRevision.page.getLatestRevision();
        const result = await WikipediaAPI.postWithEditToken({
            action: "edit",
            pageids: targetRevision.page.pageID,
            summary: i18next.t("wikipedia:summaries.restore", {
                revID: targetRevision.revisionID,
                revUser: targetRevision.user.username,
                reason,
            }),
            undo: latestRevision.revisionID,
            undoafter: targetRevision.revisionID,
            tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
                ? "RedWarn"
                : null,
        });

        if (!result.edit) {
            console.error(result);
            RWUI.Toast.quickShow({
                content: i18next.t("ui:toasts.pleaseWait"),
            });
            return false;
        }

        return true;
    }

    /**
     * Grab the newer revision ID. This also handles situations where the diff
     * view is reversed.
     *
     * @private
     * @param newer Whether or not to get the newer revision of the two.
     * @returns The newer revision if the `newer` parameter is `true` (default).
     *          `null` if the page is not a valid diff page.
     */
    private static getRevisionId(newer = true): number {
        const oldId = mw.config.get("wgDiffOldId");
        const newId = mw.config.get("wgDiffNewId");

        if (!newId && !!oldId) {
            return oldId;
        } else if (!!newId && !oldId) {
            return newId;
        } else if (newId != null && oldId != null) {
            return (newId > oldId && newer) || (newId < oldId && !newer)
                ? newId
                : oldId;
        } else {
            return null;
        }
    }

    /**
     * Grab the newer revision ID from the diff view. This also handles situations
     * where the diff view is reversed.
     *
     * @returns The newer revision. `null` if the page is not a valid diff page.
     */
    static getNewerRevisionId: typeof Rollback.getRevisionId = () =>
        Rollback.getRevisionId();
    /**
     * Grab the older revision ID from the diff view. This also handles situations
     * where the diff view is reversed.
     *
     * @returns The older revision. `null` if the page is not a valid diff page.
     */
    static getOlderRevisionId: typeof Rollback.getRevisionId = () =>
        Rollback.getRevisionId(false);

    /**
     * Redirect the user to the latest version if this version is not the latest.
     */
    static async redirectIfNotLatest(
        targetRevision: Revision,
        redirectOnChange = true
    ): Promise<Revision> {
        const latestRevision = await targetRevision.getLatestRevision();
        if (latestRevision.revisionID !== targetRevision.revisionID) {
            if (redirectOnChange)
                redirect(
                    WikipediaURL.getDiffUrl(
                        latestRevision.revisionID,
                        latestRevision.parentID
                    )
                );
            else
                RWUI.Toast.quickShow({
                    content: i18next.t("ui:toasts.newerRev"),
                });
        } else return latestRevision;
    }

    /**
     * Redirect the user to a rollback preview, where the effects of a rollback are displayed
     * to the user.
     * @param targetRevision The revision that will be rolled back to.
     */
    static async preview({ targetRevision }: RollbackContext): Promise<void> {
        // TODO dialog
        //rw.ui.loadDialog.show("Loading preview...");
        // Check if latest, else redirect

        const latestRevision = await Rollback.redirectIfNotLatest(
            targetRevision
        );

        // Same page, so let's just use the latestRevision. Higher chance of being populated than targetRevision.
        const { revisionID } = await Page.fromID(
            latestRevision.page.pageID
        ).getLatestRevisionNotByUser(targetRevision.user.username);

        const url = WikipediaURL.getDiffUrl(
            revisionID,
            +mw.util.getParamValue("diff"),
            {
                fragment: "rollbackPreview",
            }
        );

        redirect(url);
    }

    /**
     * Ask the user to provide a rollback reason and then rollback the
     * given page to the target revision with that reason.
     * @param context The rollback context.
     * @param defaultReason The default reason to use.
     */
    static async promptRollbackReason(
        context: RollbackContext,
        defaultReason: string
    ): Promise<void> {
        await Rollback.redirectIfNotLatest(context.targetRevision);
        const dialog = new RWUI.InputDialog({
            ...i18next.t("ui:rollback"),
            defaultText: defaultReason,
        });
        const reason = await dialog.show();
        if (reason !== null) return this.rollback(context, reason);
    }

    static async pseudoRollback(
        context: RollbackContext,
        reason: string,
        defaultWarnIndex?: keyof Warnings
    ): Promise<void> {
        const { fromInjector, progressBar, targetRevision } = context;

        if (!targetRevision.isPopulated()) targetRevision.populate();
        const latestRevision = await targetRevision.page.getLatestRevisionNotByUser(
            targetRevision.user.username
        );

        this.redirectIfNotLatest(targetRevision, context.redirectOnChange);

        const summary = i18next.t("wikipedia:summaries.revert", {
            username: targetRevision.user.username,
            targetRevisionId: latestRevision.revisionID,
            targetRevisionEditor: latestRevision.user.username,
            version: RW_VERSION_TAG,
            reason,
        });
        const res = await WikipediaAPI.postWithEditToken({
            action: "edit",
            format: "json",
            title: targetRevision.page,
            summary,
            undo: targetRevision.revisionID, // current
            undoafter: latestRevision.revisionID, // restore version
            tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
                ? "RedWarn"
                : null,
        });
        if (!res.edit) {
            // Error occurred or other issue
            console.error(res);
            // Show rollback options again (todo)
            $("#rwCurrentRevRollbackBtns").show();
            $("#rwRollbackInProgress").hide();

            RWUI.Toast.quickShow({
                content: i18next.t("ui:toasts.rollbackError"),
            });
        } else {
            if (fromInjector) {
                progressBar.close();
                return DiffViewerInjector.showRollbackDoneOptions(
                    context,
                    targetRevision.user.username,
                    defaultWarnIndex
                );
            }
        }
    }

    static async standardRollback(
        context: RollbackContext,
        reason: string,
        defaultWarnIndex?: keyof Warnings
    ): Promise<void> {
        const { fromInjector, progressBar, targetRevision } = context;
        try {
            if (!targetRevision.isPopulated()) targetRevision.populate();

            const summary = i18next.t("wikipedia:summaries.rollback", {
                username: targetRevision.user.username,
                reason,
                version: RW_VERSION_TAG,
            });
            await WikipediaAPI.api.rollback(
                targetRevision.page.title,
                targetRevision.user.username,
                {
                    summary,
                    tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
                        ? "RedWarn"
                        : null,
                }
            );
        } catch (e) {
            // Error occurred or other issue
            console.error(e);
            // Show rollback options again
            $("#rwCurrentRevRollbackBtns").show();
            $("#rwRollbackInProgress").hide();
            RWUI.Toast.quickShow({
                content: i18next.t("ui:toasts.rollbackError"),
            });
        }

        if (fromInjector) {
            progressBar.close();
            return DiffViewerInjector.showRollbackDoneOptions(
                context,
                targetRevision.user.username,
                defaultWarnIndex
            );
        }
    }

    static async rollback(
        context: RollbackContext,
        reason: string,
        defaultWarnIndex?: keyof Warnings
    ): Promise<void> {
        const { targetRevision, progressBar } = context;
        // Show progress bar
        $("#rwCurrentRevRollbackBtns").hide();
        $("#rwRollbackInProgress").show();

        progressBar.open();

        await Rollback.redirectIfNotLatest(targetRevision);

        if (WikipediaAPI.hasGroup("rollbacker")) {
            switch (
                Config.rollbackMethod.value as rollbackMethod // need to cast since inferred type is weird in switch/case
            ) {
                case rollbackMethod.Rollback:
                    return await this.standardRollback(
                        context,
                        reason,
                        defaultWarnIndex
                    );
                case rollbackMethod.Revert:
                    return await this.pseudoRollback(
                        context,
                        reason,
                        defaultWarnIndex
                    );
                default:
                    console.error(
                        `rollbackMethod is invalid (${Config.rollbackMethod.value}), resetting`
                    );
                // fall through
                case rollbackMethod.Unset:
                    const dialog = new RWUI.Dialog({
                        actions: [
                            {
                                data: "rollback",
                                action: async () => {
                                    Config.rollbackMethod.value =
                                        rollbackMethod.Rollback;
                                    await Config.save();
                                    return await this.standardRollback(
                                        context,
                                        reason,
                                        defaultWarnIndex
                                    );
                                },
                                text: i18next.t(
                                    "ui:rollbackAvailableDialog.actions.rollback"
                                ),
                            },
                            {
                                data: "revert",
                                action: async () => {
                                    Config.rollbackMethod.value =
                                        rollbackMethod.Revert;
                                    await Config.save();
                                    return await this.pseudoRollback(
                                        context,
                                        reason,
                                        defaultWarnIndex
                                    );
                                },
                                text: i18next.t(
                                    "ui:rollbackAvailableDialog.actions.revert"
                                ),
                            },
                        ],
                        content: i18next.t(
                            "ui:rollbackAvailableDialog.content"
                        ),
                    });
                    return await dialog.show();
            }
        } else {
            return await this.pseudoRollback(context, reason, defaultWarnIndex);
        }
    }
}
