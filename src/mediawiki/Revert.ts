import i18next from "i18next";
import {
    RW_VERSION_TAG,
    RW_WIKIS_SPEEDUP,
    RW_WIKIS_TAGGABLE,
} from "rww/data/RedWarnConstants";
import RedWarnStore from "rww/data/RedWarnStore";
import RedWarnUI from "rww/ui/RedWarnUI";
import redirect from "rww/util/redirect";
import {
    ClientUser,
    MediaWikiAPI,
    MediaWikiURL,
    Page,
    Revision,
} from "rww/mediawiki";
import { Configuration, RevertMethod } from "rww/config";
import Log from "rww/data/RedWarnLog";
import RedWarnWikiConfiguration from "rww/data/RedWarnWikiConfiguration";
import type { RWUIDiffIcons } from "rww/ui/elements/RWUIDiffIcons";
import { RevertOption } from "rww/definitions/RevertOptions";

/**
 * The context of a revert being performed.
 */
export interface RevertContext {
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
    /**
     * If this revert isn't headless, the diff icons.
     */
    diffIcons?: RWUIDiffIcons;
    /**
     * If this revert isn't headless, the selected revert option.
     */
    revertOption?: RevertOption;
}

/**
 * The current stage of a revert.
 */
export enum RevertStage {
    /** Collecting details about the revision to revert. */
    Preparing,
    /**
     * Collecting details about the revision to revert to.
     * This is entirely skipped if rollback was used.
     */
    Details,
    /**
     * The revert is being made.
     */
    Revert,
    /**
     * The revert has finished either with or without errors.
     */
    Finished,
}

/**
 * This class handles all behavior related to undos and rollbacks: collectively
 * called "reverts".
 */
export class Revert {
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
    static async promptRestore(targetRevision: Revision): Promise<void> {
        const dialog = new RedWarnUI.InputDialog(i18next.t("ui:restore"));
        const reason = await dialog.show();
        if (reason !== null) {
            Revert.restore(targetRevision, reason);
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
        reason?: string
    ): Promise<boolean> {
        if (!targetRevision.isPopulated()) targetRevision.populate();
        const latestRevision = await targetRevision.page.getLatestRevision();
        const result = await MediaWikiAPI.postWithEditToken({
            action: "edit",
            pageid: targetRevision.page.pageID,
            summary: i18next.t("mediawiki:summaries.restore", {
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
            Log.error(result);
            RedWarnUI.Toast.quickShow({
                content: i18next.t("ui:toasts.pleaseWait"), // i.e. "Please wait..."
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
        } else if ((!!newId && !oldId) || oldId === false) {
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
    static getNewerRevisionId: typeof Revert.getRevisionId = () =>
        Revert.getRevisionId();
    /**
     * Grab the older revision ID from the diff view. This also handles situations
     * where the diff view is reversed.
     *
     * @returns The older revision. `null` if the page is not a valid diff page.
     */
    static getOlderRevisionId: typeof Revert.getRevisionId = () =>
        Revert.getRevisionId(false);

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
        const latestRevision = await targetRevision.getLatestRevision();
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
                    content: i18next.t("ui:toasts.newerRev"),
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
    static async preview({ newRevision }: RevertContext): Promise<void> {
        // TODO dialog
        //rw.ui.loadDialog.show("Loading preview...");
        // Check if latest, else redirect

        const latestRevision = await Revert.latestRevertTargetCheck(
            newRevision
        );

        // Same page, so let's just use the latestRevision. Higher chance of being populated than newRevision.
        const { revisionID } = await Page.fromID(
            latestRevision.page.pageID
        ).getLatestRevisionNotByUser(newRevision.user.username);

        const url = MediaWikiURL.getDiffUrl(
            revisionID,
            +mw.util.getParamValue("diff"),
            {
                fragment: "rollbackPreview",
            }
        );

        redirect(url);
    }

    /**
     * Ask the user to provide a revert reason and then revert the
     * given page to the target revision with that reason.
     * @param context The revert context.
     * @param defaultReason The default reason to use.
     */
    static async promptRollbackReason(
        context: RevertContext,
        defaultReason: string
    ): Promise<void> {
        await Revert.latestRevertTargetCheck(context.newRevision);
        const dialog = new RedWarnUI.InputDialog({
            width: "40vw",
            ...i18next.t("ui:rollback"),
            defaultText: defaultReason,
        });
        const reason = await dialog.show();
        if (reason != null) return Revert.revert(context, reason);
    }

    /**
     * Use pseudo-rollback to revert an edit. This does the following (in sequence):
     * - Get the details of the target revision if it was not available in the first place.
     * - Checks if the target revision is the latest revision.
     * - Performs the revert
     *
     * @param context The context for this revert.
     * @param reason The reason for this revert.
     */
    static async pseudoRollback(
        context: RevertContext,
        reason: string
    ): Promise<void> {
        const { diffIcons, newRevision } = context;

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
                    new Error("Target revision is not the latest revision.")
                );
            return;
        }

        const summary = i18next.t("mediawiki:summaries.revert", {
            username: newRevision.user.username,
            targetRevisionId: latestCleanRevision.revisionID,
            targetRevisionEditor: latestCleanRevision.user.username,
            version: RW_VERSION_TAG,
            reason,
        });

        if (diffIcons) diffIcons.onRevertStageChange(RevertStage.Revert);
        const res = await MediaWikiAPI.postWithEditToken({
            action: "edit",
            format: "json",
            pageid: newRevision.page.pageID,
            summary,
            undo: newRevision.revisionID, // current
            undoafter: latestCleanRevision.revisionID, // restore version
            tags: RedWarnWikiConfiguration.c.meta.tag,
        });

        if (!res["edit"]) {
            // An error occured during revert.
            Log.error(
                "An error occured while performing a pseudo-rollback.",
                res["errors"]
            );

            // TODO: Proper errors
            if (diffIcons) diffIcons.onRevertFailure(res["errors"]);
            RedWarnUI.Toast.quickShow({
                content: i18next.t("ui:toasts.rollbackError"),
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
     * @param reason The reason for this revert.
     */
    static async rollback(
        context: RevertContext,
        reason: string
    ): Promise<void> {
        const { diffIcons, newRevision } = context;

        // Get target revision information.
        if (!newRevision.isPopulated()) newRevision.populate();

        const summary = i18next.t("mediawiki:summaries.rollback", {
            username: newRevision.user.username,
            reason,
            version: RW_VERSION_TAG,
        });

        if (diffIcons) diffIcons.onRevertStageChange(RevertStage.Revert);
        const res = await MediaWikiAPI.api.rollback(
            newRevision.page.title,
            newRevision.user.username,
            {
                summary,
                tags: RedWarnWikiConfiguration.c.meta.tag,
            }
        );

        if (!res["rollback"]) {
            // An error occured during revert.
            Log.error("An error occured while performing a rollback.", res);

            // TODO: Proper errors
            if (diffIcons) diffIcons.onRevertFailure(new Error(res["errors"]));
            RedWarnUI.Toast.quickShow({
                content: i18next.t("ui:toasts.rollbackError"),
            });
        } else {
            if (diffIcons) diffIcons.onEndRevert();
        }
    }

    static async revert(context: RevertContext, reason: string): Promise<void> {
        const { diffIcons, newRevision } = context;
        if (diffIcons) {
            diffIcons.onStartRevert();
            diffIcons.onRevertStageChange(RevertStage.Preparing);
        }

        await Revert.latestRevertTargetCheck(newRevision);

        if (ClientUser.i.inGroup("rollbacker")) {
            const revert = async (): Promise<void> => {
                switch (Configuration.Revert.revertMethod.value) {
                    case RevertMethod.Rollback:
                        await Revert.rollback(context, reason);
                        break;
                    case RevertMethod.Undo:
                        await Revert.pseudoRollback(context, reason);
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
            return await Revert.pseudoRollback(context, reason);
        }

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
                            ),
                        },
                        {
                            data: "Undo",
                            text: i18next.t(
                                "ui:rollbackAvailableDialog.actions.revert"
                            ),
                        },
                    ],
                    content: `${i18next.t(
                        "ui:rollbackAvailableDialog.content"
                    )}`,
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
