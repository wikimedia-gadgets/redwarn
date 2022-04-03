import { Page, Revert, RevertContextBase, Revision } from "app/mediawiki";
import { h } from "tsx-dom";
import Log from "app/data/RedWarnLog";
import { RWUIDiffIcons } from "app/ui/elements/RWUIDiffIcons";
import RedWarnUI from "app/ui/RedWarnUI";
import { Injector } from "./Injector";

export default class DiffViewerInjector implements Injector {
    private _diffIcons: Partial<Record<"new" | "old", RWUIDiffIcons>> = {};
    get oldDiffIcons(): RWUIDiffIcons {
        return this._diffIcons["old"];
    }
    get newDiffIcons(): RWUIDiffIcons {
        return this._diffIcons["new"];
    }
    get latestDiffIcons(): RWUIDiffIcons {
        return Object.values(this._diffIcons).find(
            (icons) => icons.isLatestIcons
        );
    }

    /**
     * Initialize the injector. If the page is a diff page, this injector
     * will trigger.
     */
    async init(): Promise<void> {
        if (Revert.isDiffPage()) {
            Log.debug("Diff page detected!");
            await this.loadOptions(await this.getContext());
        }
    }

    /**
     * Get the context surrounding the current diff view.
     */
    async getContext(options?: {
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
    loadOptions(
        context: RevertContextBase,
        checkIfEditable = true
    ): Promise<void> {
        if (checkIfEditable && !mw.config.get("wgIsProbablyEditable")) {
            // Unable to edit. Do not present options.
            return;
        }

        document
            .querySelectorAll(".diff-ntitle, .diff-otitle")
            .forEach((host) => {
                const side = host.classList.contains("diff-ntitle")
                    ? "new"
                    : "old";
                this._diffIcons[side] = new RedWarnUI.DiffIcons({
                    ...context,
                    side,
                });

                const icons = (
                    <div class={"rwDiffIcons"}>
                        {this._diffIcons[side].render()}
                    </div>
                );

                // Always show below the Twinkle buttons.
                const twinkleRevertButtons =
                    host.querySelector('[id^="tw-revert"]');

                if (twinkleRevertButtons) twinkleRevertButtons.after(icons);
                else {
                    host.firstElementChild.prepend(icons);
                }
            });
    }
}
