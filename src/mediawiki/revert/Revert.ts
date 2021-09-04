import i18next from "i18next";
import { RW_VERSION_TAG, RW_WIKIS_SPEEDUP } from "rww/data/RedWarnConstants";
import RedWarnStore from "rww/data/RedWarnStore";
import RedWarnUI from "rww/ui/RedWarnUI";
import redirect from "rww/util/redirect";
import {
    ClientUser,
    MediaWikiAPI,
    MediaWikiURL,
    RestoreStage,
    RevertStage,
    Revision,
    Warning
} from "rww/mediawiki";
import Log from "rww/data/RedWarnLog";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import type { RWUIDiffIcons } from "rww/ui/elements/RWUIDiffIcons";
import { RevertOption } from "rww/mediawiki/revert/RevertOptions";
import { RevertMethod } from "rww/config/user/ConfigurationEnums";
import { Configuration } from "rww/config/user/Configuration";
import { RevisionNotLatestError } from "rww/errors/MediaWikiErrors";

/**
 * The context of a revert being performed. When used alone (not through
 * {@link RevertContext}, this represents the context for a revert in-progress,
 * that is, a revert that is yet to be performed; wherein the user has not yet
 * decided on a revert reason.
 */
export interface RevertContextBase {
    /**
     * The revision on the left side of a diff page.
     */
    oldRevision?: Revision;
    /**
     * The revision on the right side of a diff page.
     */
    newRevision: Revision;
    /**
     * The latest revision of this page.
     */
    latestRevision?: Revision;
}

/**
 * The context of a revert being performed, given that this revert is
 * entirely headless and does not update any graphics.
 */
export interface HeadlessRevertContext extends RevertContextBase {
    /**
     * The automatic reason for this revert.
     */
    prefilledReason: string;
    /**
     * The warning associated with this revert.
     */
    warning?: Warning;
}

/**
 * The context of a revert being performed, given that this revert was
 * triggered by a {@link RWUIDiffIcons} component.
 */
export interface DiffIconRevertContext extends RevertContextBase {
    /**
     * The {@link RWUIDiffIcons} element for this revert.
     */
    diffIcons: RWUIDiffIcons;
    /**
     * The selected revert option, or the reason for the revert.
     */
    reason: RevertOption | string;
}

export type RevertContext = DiffIconRevertContext | HeadlessRevertContext;

export function isHeadlessRevertContext(
    context: RevertContext
): context is HeadlessRevertContext {
    return (context as Record<string, any>)["prefilledReason"] !== null;
}
export function isDiffIconContext(
    context: RevertContext
): context is DiffIconRevertContext {
    return (context as Record<string, any>)["reason"] !== null;
}

/**
 * This class handles all behavior related to undos and rollbacks: collectively
 * called "reverts".
 */
export class Revert {
    static revertInProgress = false;
    static readonly revertCancelListener = (event: KeyboardEvent) => {
        if (event.key === "Escape") Revert.revertInProgress = true;
    };

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
     * @param options The options for this prompted restore.
     * @param options.diffIcons The {@link RWUIDiffIcons} that triggered this restore.
     */
    static async promptRestore(
        targetRevision: Revision,
        options?: {
            diffIcons?: RWUIDiffIcons;
            defaultText?: string;
        }
    ): Promise<void> {
        const dialog = new RedWarnUI.InputDialog({
            ...i18next.t("ui:restore"),
            defaultText: options?.defaultText
        });
        const reason = await dialog.show();
        if (reason !== null) {
            Revert.restore(targetRevision, reason, options?.diffIcons);
        }
    }

    /**
     * Restore a previous page version. This will undo all edits made after
     * the target revision and replace the page's latest content with the
     * content of the target revision.
     *
     * @param targetRevision The revision to restore to.
     * @param reason The reason for restoring.,
     * @param diffIcons The {@link RWUIDiffIcons} that triggered this restore.
     */
    static async restore(
        targetRevision: Revision,
        reason?: string,
        diffIcons?: RWUIDiffIcons
    ): Promise<void> {
        if (Revert.revertInProgress)
            return RedWarnUI.Toast.quickShow({
                // TODO i18n
                content:
                    "You cannot click on another icon while a revert or restore is ongoing."
            });

        document.addEventListener("keydown", Revert.revertCancelListener);
        Revert.revertInProgress = true;

        if (diffIcons) {
            diffIcons.onStartRestore(targetRevision);
            diffIcons.onRestoreStageChange(RestoreStage.Preparing);
        }

        if (!targetRevision.isPopulated()) targetRevision.populate();

        if (diffIcons) diffIcons.onRestoreStageChange(RestoreStage.Details);
        const latestRevision = await targetRevision.page.getLatestRevision({
            forceRefresh: false
        });

        if (diffIcons) diffIcons.onRestoreStageChange(RestoreStage.Restore);
        const result = await MediaWikiAPI.postWithEditToken({
            action: "edit",
            pageid: targetRevision.page.pageID,
            summary: i18next.t("mediawiki:summaries.restore", {
                revID: targetRevision.revisionID,
                revUser: targetRevision.user.username,
                reason
            }),
            undo: latestRevision.revisionID,
            undoafter: targetRevision.revisionID,
            tags: RedWarnWikiConfiguration.c.meta.tag
        });

        if (!result.edit) {
            const error = MediaWikiAPI.error(result);

            Log.error("Failed to restore revision.", error);
            RedWarnUI.Toast.quickShow({
                content: i18next.t("ui:toasts.restoreError")
            });
            if (diffIcons) diffIcons.onRestoreFailure(error);
        } else {
            if (diffIcons) diffIcons.onEndRestore();
        }
        if (diffIcons) diffIcons.onRestoreStageChange(RestoreStage.Finished);

        document.removeEventListener("keydown", Revert.revertCancelListener);
    }

    /**
     * Checks whether or not the target revision is the latest revision.
     *
     * @param targetRevision The revision to redirect to.
     * @param redirectOnChange Whether or not to redirect the user if an newer revision was found.
     * @param ignoreSameUser Whether or not to ignore the latest edit if it is by the same user.
     *
     * @returns latestRevision The latest revision if this revert can still proceed. `null` otherwise.
     */
    static async latestRevertTargetCheck(
        targetRevision: Revision,
        redirectOnChange = true,
        ignoreSameUser = false
    ): Promise<Revision> {
        if (targetRevision.page == null) await targetRevision.populate();

        const latestRevision = await targetRevision.getLatestRevision({
            forceRefresh: false
        });
        if (latestRevision.revisionID !== targetRevision.revisionID) {
            if (
                ignoreSameUser &&
                // Edit made by the same user.
                latestRevision.user === targetRevision.user &&
                // There are no intermediate edits.
                latestRevision.parentID === targetRevision.revisionID
            ) {
                // Everything is just fine. Return the populated revision.
                return latestRevision;
            }

            if (redirectOnChange) {
                redirect(
                    MediaWikiURL.getDiffUrl(
                        latestRevision.revisionID,
                        latestRevision.parentID
                    )
                );
                return null;
            } else {
                RedWarnUI.Toast.quickShow({
                    content: i18next.t("ui:toasts.newerRev")
                });
                return null;
            }
        }
        return latestRevision;
    }

    /**
     * Redirect the user to a revert preview, where the effects of a revert are displayed
     * to the user.
     * @param targetRevision The revision that will be rolled back to.
     */
    static async preview({ newRevision }: RevertContextBase): Promise<void> {
        // TODO dialog
        //rw.ui.loadDialog.show("Loading preview...");
        // Check if latest, else redirect

        const latestRevision = await Revert.latestRevertTargetCheck(
            newRevision
        );

        // Cancel if no longer the latest revision.
        if (!latestRevision) return;

        // Same page, so use the latestRevision. Higher chance of being populated than newRevision.
        const targetRevision = await latestRevision.page.getLatestRevisionNotByUser(
            latestRevision.user.username
        );

        if (targetRevision == null) {
            // TODO: i18n
            RedWarnUI.Toast.quickShow({
                content: "Can't find an earlier revision to revert to."
            });
            return;
        }

        const url = MediaWikiURL.getDiffUrl(
            targetRevision.revisionID,
            +mw.util.getParamValue("diff")
        );

        redirect(url);
    }

    /**
     * Ask the user to provide a revert reason and then revert the
     * given page to the target revision with that reason.
     * @param context The revert context.
     * @param defaultReason The default reason to use.
     * @returns reason The rollback reason.
     */
    static async promptRollbackReason(
        context: RevertContextBase,
        defaultReason: string
    ): Promise<string> {
        await Revert.latestRevertTargetCheck(context.newRevision);
        const dialog = new RedWarnUI.InputDialog({
            width: "40vw",
            ...i18next.t("ui:rollback"),
            defaultText: defaultReason
        });
        return await dialog.show();

        // TODO: Move this to the RevertOption native
        // if (reason != null) return Revert.revert(context);
    }

    /**
     * Get the reason of a revert using the context.
     * @param context
     */
    static extractReasonFromContext(context: RevertContext): string {
        if (isHeadlessRevertContext(context)) {
            return context.prefilledReason;
        } else if (isDiffIconContext(context)) {
            return typeof context.reason === "string"
                ? context.reason
                : context.reason.name;
        } else throw new Error("No reason was given for a revert.");
    }

    /**
     * Use pseudo-rollback to revert an edit. This does the following (in sequence):
     * - Get the details of the target revision if it was not available in the first place.
     * - Checks if the target revision is the latest revision.
     * - Performs the revert
     *
     * @param context The context for this revert.
     */
    static async pseudoRollback(context: RevertContext): Promise<void> {
        const { newRevision } = context;
        const diffIcons = isDiffIconContext(context) ? context.diffIcons : null;

        // Get target revision information.
        if (!newRevision.isPopulated()) newRevision.populate();

        if (diffIcons) diffIcons.onRevertStageChange(RevertStage.Details);
        const latestCleanRevision = await newRevision.page.getLatestRevisionNotByUser(
            newRevision.user.username
        );

        // Bump the latest revision.
        context.latestRevision = await Revert.latestRevertTargetCheck(
            newRevision,
            Configuration.Revert.redirectIfNotLatest.value,
            Configuration.Revert.ignoreSameUserLatest.value
        );

        if (context.latestRevision == null) {
            // Cancel!
            // TODO: Proper errors
            if (diffIcons)
                diffIcons.onRevertFailure(
                    new RevisionNotLatestError({
                        revision: context.newRevision
                    })
                );
            return;
        }

        const summary = i18next.t("mediawiki:summaries.revert", {
            username: newRevision.user.username,
            targetRevisionId: latestCleanRevision.revisionID,
            targetRevisionEditor: latestCleanRevision.user.username,
            version: RW_VERSION_TAG,
            reason: Revert.extractReasonFromContext(context)
        });

        if (!Revert.revertInProgress) {
            // Revert cancelled. Escape immediately!
            if (diffIcons) diffIcons.onEndRevert(true);
            return;
        }
        if (diffIcons) diffIcons.onRevertStageChange(RevertStage.Revert);
        const res = await MediaWikiAPI.postWithEditToken({
            action: "edit",
            format: "json",
            pageid: newRevision.page.pageID,
            summary,
            undo: newRevision.revisionID, // current
            undoafter: latestCleanRevision.revisionID, // restore version
            tags: RedWarnWikiConfiguration.c.meta.tag
        });

        if (!res["edit"]) {
            // An error occured during revert.
            Log.error(
                "An error occured while performing a pseudo-rollback.",
                res["errors"]
            );

            if (diffIcons) diffIcons.onRevertFailure(MediaWikiAPI.error(res));
            RedWarnUI.Toast.quickShow({
                content: i18next.t("ui:toasts.rollbackError")
            });
        } else {
            if (diffIcons) diffIcons.onEndRevert();
        }
    }

    /**
     * Use rollback to revert an edit. This does the following (in sequence):
     * - Uses rollback to immediately revert all edits to the last one not by the target user.
     *
     * @param context The context for this revert.
     */
    static async rollback(context: RevertContext): Promise<void> {
        const { newRevision } = context;
        const diffIcons = isDiffIconContext(context) ? context.diffIcons : null;

        if (diffIcons) diffIcons.onRevertStageChange(RevertStage.Details);
        // Get target revision information.
        if (!newRevision.isPopulated()) newRevision.populate();

        const summary = i18next.t("mediawiki:summaries.rollback", {
            username: newRevision.user.username,
            reason: Revert.extractReasonFromContext(context),
            version: RW_VERSION_TAG
        });

        if (!Revert.revertInProgress) {
            // Revert cancelled. Escape immediately!
            if (diffIcons) diffIcons.onEndRevert(true);
            return;
        }

        if (diffIcons) diffIcons.onRevertStageChange(RevertStage.Revert);
        const res = await MediaWikiAPI.api.rollback(
            newRevision.page.title,
            newRevision.user.username,
            {
                summary,
                tags: RedWarnWikiConfiguration.c.meta.tag
            }
        );

        if (!res["rollback"]) {
            // An error occured during revert.
            Log.error("An error occured while performing a rollback.", res);

            if (diffIcons) diffIcons.onRevertFailure(MediaWikiAPI.error(res));
            RedWarnUI.Toast.quickShow({
                content: i18next.t("ui:toasts.rollbackError")
            });
        } else {
            if (diffIcons) diffIcons.onEndRevert();
        }
    }

    /**
     * Revert an edit. This will automatically use whichever revert method the
     * user has chosen, whether it be through rollback or pseudo-rollback.
     *
     * @param context
     */
    static async revert(context: RevertContext): Promise<void> {
        const { newRevision } = context;
        const diffIcons = isDiffIconContext(context) ? context.diffIcons : null;

        if (Revert.revertInProgress)
            return RedWarnUI.Toast.quickShow({
                // TODO i18n
                content:
                    "You cannot click on another icon while a revert or restore is ongoing."
            });

        document.addEventListener("keydown", Revert.revertCancelListener);
        Revert.revertInProgress = true;

        // The extra `isDiffIconContext` check is to satisfy the TypeScript linter,
        // which can't tell that this was the condition used to check if `diffIcons`
        // exists.
        if (diffIcons && isDiffIconContext(context)) {
            diffIcons.onStartRevert(context);
            diffIcons.onRevertStageChange(RevertStage.Preparing);
        }

        await Revert.latestRevertTargetCheck(newRevision);

        try {
            if (ClientUser.i.inGroup("rollbacker")) {
                const revert = async (): Promise<void> => {
                    switch (Configuration.Revert.revertMethod.value) {
                        case RevertMethod.Rollback:
                            await Revert.rollback(context);
                            break;
                        case RevertMethod.Undo:
                            await Revert.pseudoRollback(context);
                            break;
                        case RevertMethod.Unset:
                        default:
                            Log.error(
                                `RollbackMethod is invalid (${Configuration.Revert.revertMethod.value}), resetting`
                            );
                            await Revert.requestRevertMethod();
                            await revert();
                    }
                };
                await revert();
            } else {
                return await Revert.pseudoRollback(context);
            }
        } catch (e) {
            Log.error("Failed to revert.", e);
            RedWarnUI.Toast.quickShow({
                content: i18next.t("ui:toasts.rollbackError")
            });
        }

        document.removeEventListener("keydown", Revert.revertCancelListener);
        if (diffIcons) diffIcons.onRevertStageChange(RevertStage.Finished);
    }

    /**
     * Request a revert method to use. Defaults to {@link RevertMethod.Rollback} if the dialog was cancelled.
     */
    static async requestRevertMethod(): Promise<RevertMethod> {
        const method =
            RevertMethod[
                (await new RedWarnUI.Dialog({
                    actions: [
                        {
                            data: "Rollback",
                            text: i18next.t(
                                "ui:rollbackAvailableDialog.actions.rollback"
                            )
                        },
                        {
                            data: "Undo",
                            text: i18next.t(
                                "ui:rollbackAvailableDialog.actions.revert"
                            )
                        }
                    ],
                    content: `${i18next.t(
                        "ui:rollbackAvailableDialog.content"
                    )}`
                }).show()) as "Rollback" | "Undo" | null
            ] ?? RevertMethod.Rollback;

        Configuration.Revert.revertMethod.value = method;
        await Configuration.save();
        return method;
    }

    static async acceptInjector(i: () => any): Promise<any> {
        return RW_WIKIS_SPEEDUP.includes(RedWarnStore.wikiID) && (await i());
    }
}
