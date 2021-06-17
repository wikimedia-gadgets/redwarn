import { Page, Revert, RevertContextBase, Revision } from "rww/mediawiki";
import { h } from "tsx-dom";
import Log from "rww/data/RedWarnLog";
import { RWUIDiffIcons } from "rww/ui/elements/RWUIDiffIcons";
import RedWarnUI from "rww/ui/RedWarnUI";

export default class DiffViewerInjector {
    /**
     * Initialize the injector. If the page is a diff page, this injector
     * will trigger.
     */
    static async init(): Promise<void> {
        if (Revert.isDiffPage()) {
            Log.debug("Diff page detected!");
            await DiffViewerInjector.loadOptions(
                await DiffViewerInjector.getContext()
            );
        }
    }

    /**
     * Get the context surrounding the current diff view.
     */
    static async getContext(options?: {
        diffIcons?: RWUIDiffIcons;
        baseContext?: RevertContextBase;
    }): Promise<RevertContextBase> {
        const newRevId = mw.config.get("wgDiffNewId");
        const oldRevId = mw.config.get("wgDiffOldId");

        const newRevision: Revision =
            options?.baseContext?.newRevision ??
            Revision.fromID(newRevId, {
                page: Page.fromTitle(mw.config.get("wgRelevantPageName")),
            });

        if (!newRevision.isPopulated()) await newRevision.populate();

        return {
            newRevision: newRevision,
            oldRevision:
                oldRevId !== false
                    ? options?.baseContext?.oldRevision ??
                      Revision.fromID(oldRevId, {
                          page: Page.fromTitle(
                              mw.config.get("wgRelevantPageName")
                          ),
                      })
                    : undefined,
            latestRevision: Revision.fromID(+mw.config.get("wgCurRevisionId")),
        };
    }

    /**
     * Load the revert options. These are the buttons seen at the top of each side of the
     * diff view.
     * @param context The context surrounding the current revert.
     * @param checkIfEditable Check if the page is editable before injecting.
     */
    static loadOptions(
        context: RevertContextBase,
        checkIfEditable = true
    ): Promise<void> {
        if (checkIfEditable && !mw.config.get("wgIsProbablyEditable")) {
            // Unable to edit. Do not present options.
            return;
        }

        const diffIcons = new RedWarnUI.DiffIcons(context);

        const icons = <div id={"rwDiffIcons"}>{diffIcons.render()}</div>;

        // Always show below the Twinkle buttons.
        const twinkleRevertButtons = document.querySelector("#tw-revert");

        if (twinkleRevertButtons) twinkleRevertButtons.after(icons);
        else {
            const newDiffContainer = document.querySelector(".diff-ntitle");
            newDiffContainer.firstElementChild.prepend(icons);
        }
    }
}
