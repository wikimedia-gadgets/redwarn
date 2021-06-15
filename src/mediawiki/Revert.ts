// import i18next from "i18next";
// import {RW_VERSION_TAG, RW_WIKIS_SPEEDUP, RW_WIKIS_TAGGABLE,} from "rww/data/RedWarnConstants";
// import RedWarnStore from "rww/data/RedWarnStore";
// import RedWarnUI from "rww/ui/RedWarnUI";
// import redirect from "rww/util/redirect";
import { Revision } from "rww/mediawiki";
// import {Configuration, RevertMethod} from "rww/config";
// import Log from "rww/data/RedWarnLog";
//
// /**
//  * The context of a revert being performed.
//  */
export interface RevertContext {
    /**
     * The revision on the left side of a diff page.
     */
    sourceRevision?: Revision;
    /**
     * The revision on the right side of a diff page.
     */
    targetRevision: Revision;
    /**
     * The latest revision of this page.
     */
    latestRevision?: Revision;
}
//
// /**
//  * The current stage of a revert.
//  */
// export enum RevertStage {
//     Details,
//     Revert
// }
//
// /**
//  * This class handles all behavior related to undos and rollbacks: collectively
//  * called "reverts".
//  */
// export class Revert {
//     /**
//      * Determines whether the given page is a diff page, and whether or not it
//      * displays a single revision (if that revision is the only page revision) or
//      * two revisions (a normal diff page).
//      *
//      * wgDiffOldId is "false" if there is only one revision. Both wgDiffOldId and
//      * wgDiffNewId are null when the page is not a revision page.
//      *
//      * @returns `"onlyrev"` if the view shows the only page revision.
//      * `true` if the diff view shows two revisions.
//      * `false` if the page is not a diff page.
//      */
//     static isDiffPage(): true | "onlyrev" | false {
//         return mw.config.get("wgDiffOldId") === false
//             ? "onlyrev"
//             : !!mw.config.get("wgDiffNewId");
//     }
//
//     /**
//      * Ask the user to provide a restoration reason and then restore the
//      * given page revision with that reason.
//      *
//      * @param targetRevision The target revision.
//      */
//     static async promptRestore(targetRevision: Revision): Promise<void> {
//         const dialog = new RedWarnUI.InputDialog(i18next.t("ui:restore"));
//         const reason = await dialog.show();
//         if (reason !== null) {
//             Revert.restore(targetRevision, reason);
//         }
//     }
//
//     /**
//      * Restore a previous page version. This will undo all edits made after
//      * the target revision and replace the page's latest content with the
//      * content of the target revision.
//      *
//      * @param targetRevision The revision to restore to.
//      * @param reason The reason for restoring.
//      */
//     static async restore(
//         targetRevision: Revision,
//         reason?: string
//     ): Promise<boolean> {
//         if (!targetRevision.isPopulated()) targetRevision.populate();
//         const latestRevision = await targetRevision.page.getLatestRevision();
//         const result = await MediaWikiAPI.postWithEditToken({
//             action: "edit",
//             pageid: targetRevision.page.pageID,
//             summary: i18next.t("mediawiki:summaries.restore", {
//                 revID: targetRevision.revisionID,
//                 revUser: targetRevision.user.username,
//                 reason,
//             }),
//             undo: latestRevision.revisionID,
//             undoafter: targetRevision.revisionID,
//             tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID) ?
//                 "RedWarn" : null,
//         });
//
//         if (!result.edit) {
//             Log.error(result);
//             RedWarnUI.Toast.quickShow({
//                 content: i18next.t("ui:toasts.pleaseWait"), // i.e. "Please wait..."
//             });
//             return false;
//         }
//
//         return true;
//     }
//
//     /**
//      * Grab the newer revision ID. This also handles situations where the diff
//      * view is reversed.
//      *
//      * @private
//      * @param newer Whether or not to get the newer revision of the two.
//      * @returns The newer revision if the `newer` parameter is `true` (default).
//      *          `null` if the page is not a valid diff page.
//      */
//     private static getRevisionId(newer = true): number {
//         const oldId = mw.config.get("wgDiffOldId");
//         const newId = mw.config.get("wgDiffNewId");
//
//         if (!newId && !!oldId) {
//             return oldId;
//         } else if ((!!newId && !oldId) || oldId === false) {
//             return newId;
//         } else if (newId != null && oldId != null) {
//             return (newId > oldId && newer) || (newId < oldId && !newer)
//                 ? newId
//                 : oldId;
//         } else {
//             return null;
//         }
//     }
//
//     /**
//      * Grab the newer revision ID from the diff view. This also handles situations
//      * where the diff view is reversed.
//      *
//      * @returns The newer revision. `null` if the page is not a valid diff page.
//      */
//     static getNewerRevisionId: typeof Revert.getRevisionId = () =>
//         Revert.getRevisionId();
//     /**
//      * Grab the older revision ID from the diff view. This also handles situations
//      * where the diff view is reversed.
//      *
//      * @returns The older revision. `null` if the page is not a valid diff page.
//      */
//     static getOlderRevisionId: typeof Revert.getRevisionId = () =>
//         Revert.getRevisionId(false);
//
//     /**
//      * Redirect the user to the latest version if this version is not the latest.
//      */
//     static async redirectIfNotLatest(
//         targetRevision: Revision,
//         redirectOnChange = true
//     ): Promise<Revision> {
//         const latestRevision = await targetRevision.getLatestRevision();
//         if (latestRevision.revisionID !== targetRevision.revisionID) {
//             if (redirectOnChange)
//                 redirect(
//                     MediaWikiURL.getDiffUrl(
//                         latestRevision.revisionID,
//                         latestRevision.parentID
//                     )
//                 );
//             else
//                 RedWarnUI.Toast.quickShow({
//                     content: i18next.t("ui:toasts.newerRev"),
//                 });
//         } else return latestRevision;
//     }
//
//     /**
//      * Redirect the user to a rollback preview, where the effects of a rollback are displayed
//      * to the user.
//      * @param targetRevision The revision that will be rolled back to.
//      */
//     static async preview({ targetRevision }: RevertContext): Promise<void> {
//         // TODO dialog
//         //rw.ui.loadDialog.show("Loading preview...");
//         // Check if latest, else redirect
//
//         const latestRevision = await Revert.redirectIfNotLatest(
//             targetRevision
//         );
//
//         // Same page, so let's just use the latestRevision. Higher chance of being populated than targetRevision.
//         const { revisionID } = await Page.fromID(
//             latestRevision.page.pageID
//         ).getLatestRevisionNotByUser(targetRevision.user.username);
//
//         const url = MediaWikiURL.getDiffUrl(
//             revisionID,
//             +mw.util.getParamValue("diff"),
//             {
//                 fragment: "rollbackPreview",
//             }
//         );
//
//         redirect(url);
//     }
//
//     /**
//      * Ask the user to provide a rollback reason and then rollback the
//      * given page to the target revision with that reason.
//      * @param context The rollback context.
//      * @param defaultReason The default reason to use.
//      */
//     static async promptRollbackReason(
//         context: RevertContext,
//         defaultReason: string
//     ): Promise<void> {
//         await Revert.redirectIfNotLatest(context.targetRevision);
//         const dialog = new RedWarnUI.InputDialog({
//             width: "40vw",
//             ...i18next.t("ui:rollback"),
//             defaultText: defaultReason,
//         });
//         const reason = await dialog.show();
//         if (reason != null) return this.rollback(context, reason);
//     }
//
//     static async pseudoRollback(
//         context: RevertContext,
//         reason: string
//     ): Promise<void> {
//         const { fromInjector, progressBar, targetRevision } = context;
//
//         if (!targetRevision.isPopulated()) targetRevision.populate();
//         const latestCleanRevision = await targetRevision.page.getLatestRevisionNotByUser(
//             targetRevision.user.username
//         );
//
//         this.redirectIfNotLatest(targetRevision, context.redirectOnChange);
//
//         const summary = i18next.t("mediawiki:summaries.revert", {
//             username: targetRevision.user.username,
//             targetRevisionId: latestCleanRevision.revisionID,
//             targetRevisionEditor: latestCleanRevision.user.username,
//             version: RW_VERSION_TAG,
//             reason,
//         });
//         const res = await MediaWikiAPI.postWithEditToken({
//             action: "edit",
//             format: "json",
//             pageid: targetRevision.page.pageID,
//             summary,
//             undo: targetRevision.revisionID, // current
//             undoafter: latestCleanRevision.revisionID, // restore version
//             tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
//                 ? "RedWarn"
//                 : null,
//         });
//         if (!res.edit) {
//             // Error occurred or other issue
//             Log.error(res);
//             // Show rollback options again (todo)
//             // $("#rwCurrentRevRollbackBtns").show();
//             // $("#rwRollbackInProgress").hide();
//
//             RedWarnUI.Toast.quickShow({
//                 content: i18next.t("ui:toasts.rollbackError"),
//             });
//         } else {
//             if (fromInjector) {
//                 progressBar.close();
//                 // return DiffViewerInjector.showRevertDoneOptions(
//                 //     context,
//                 //     targetRevision.user.username,
//                 //     defaultWarnIndex
//                 // );
//             }
//         }
//     }
//
//     static async standardRollback(
//         context: RevertContext,
//         reason: string,
//         defaultWarnIndex?: keyof Warnings
//     ): Promise<void> {
//         const { fromInjector, progressBar, targetRevision } = context;
//         try {
//             if (!targetRevision.isPopulated()) targetRevision.populate();
//
//             const summary = i18next.t("mediawiki:summaries.rollback", {
//                 username: targetRevision.user.username,
//                 reason,
//                 version: RW_VERSION_TAG,
//             });
//             await MediaWikiAPI.api.rollback(
//                 targetRevision.page.title,
//                 targetRevision.user.username,
//                 {
//                     summary,
//                     tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
//                         ? "RedWarn"
//                         : null,
//                 }
//             );
//         } catch (e) {
//             // Error occurred or other issue
//             Log.error(e);
//             // Show rollback options again
//             // $("#rwCurrentRevRollbackBtns").show();
//             // $("#rwRollbackInProgress").hide();
//             RedWarnUI.Toast.quickShow({
//                 content: i18next.t("ui:toasts.rollbackError"),
//             });
//         }
//
//         if (fromInjector) {
//             progressBar.close();
//             // return DiffViewerInjector.showRevertDoneOptions(
//             //     context,
//             //     targetRevision.user.username,
//             //     defaultWarnIndex
//             // );
//         }
//     }
//
//     static async rollback(
//         context: RevertContext,
//         reason: string,
//         defaultWarnIndex?: keyof Warnings
//     ): Promise<void> {
//         const { targetRevision, progressBar } = context;
//         // Show progress bar
//         $("#rwCurrentRevRollbackBtns").hide();
//         $("#rwRollbackInProgress").show();
//
//         progressBar.open();
//
//         await Revert.redirectIfNotLatest(targetRevision);
//
//         if (ClientUser.i.inGroup("rollbacker")) {
//             switch (
//                 Configuration.Revert.rollbackMethod.value as RevertMethod // need to cast since inferred type is weird in switch/case
//             ) {
//                 case RevertMethod.Rollback:
//                     return await this.standardRollback(
//                         context,
//                         reason,
//                         defaultWarnIndex
//                     );
//                 case RevertMethod.Undo:
//                     return await this.pseudoRollback(
//                         context,
//                         reason,
//                         defaultWarnIndex
//                     );
//
//                 // fall through
//                 case RevertMethod.Unset:
//                 default:
//                     Log.error(
//                         `RollbackMethod is invalid (${Configuration.Revert.rollbackMethod.value}), resetting`
//                     );
//                     const dialog = new RedWarnUI.Dialog({
//                         actions: [
//                             {
//                                 data: "rollback",
//                                 action: async () => {
//                                     Configuration.Revert.rollbackMethod.value =
//                                         RevertMethod.Rollback;
//                                     await Configuration.save();
//                                     return await this.standardRollback(
//                                         context,
//                                         reason,
//                                         defaultWarnIndex
//                                     );
//                                 },
//                                 text: i18next.t(
//                                     "ui:rollbackAvailableDialog.actions.rollback"
//                                 ),
//                             },
//                             {
//                                 data: "revert",
//                                 action: async () => {
//                                     Configuration.Revert.rollbackMethod.value =
//                                         RevertMethod.Undo;
//                                     await Configuration.save();
//                                     return await this.pseudoRollback(
//                                         context,
//                                         reason,
//                                         defaultWarnIndex
//                                     );
//                                 },
//                                 text: i18next.t(
//                                     "ui:rollbackAvailableDialog.actions.revert"
//                                 ),
//                             },
//                         ],
//                         content: `${i18next.t(
//                             "ui:rollbackAvailableDialog.content"
//                         )}`,
//                     });
//                     return void (await dialog.show());
//             }
//         } else {
//             return await this.pseudoRollback(context, reason, defaultWarnIndex);
//         }
//     }
//
//     static async acceptInjector(i: () => any): Promise<any> {
//         return RW_WIKIS_SPEEDUP.includes(RedWarnStore.wikiID) && (await i());
//     }
// }
