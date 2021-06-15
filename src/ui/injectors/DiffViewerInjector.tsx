import { Page, Revert, RevertContext, Revision } from "rww/mediawiki";
import { RevertOption } from "rww/definitions/RevertOptions";
import { BaseProps, h } from "tsx-dom";
import { RWUISelectionDialogItem } from "../elements/RWUIDialog";
import Log from "rww/data/RedWarnLog";
import { RWUIDiffIcons } from "rww/ui/elements/RWUIDiffIcons";

function getRollbackOptionClickHandler(
    context: RevertContext,
    option: RevertOption
): () => void {
    switch (option.actionType) {
        case "custom":
            return () => option.action(context);
        case "revert":
            return () =>
                Revert.revert(
                    Object.assign(context, { revertOption: option }),
                    option.summary
                );
        case "promptedRevert":
            return () =>
                Revert.promptRollbackReason(
                    Object.assign(context, { revertOption: option }),
                    option.defaultSummary
                );
    }
}

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
    static async getContext(diffIcons?: RWUIDiffIcons): Promise<RevertContext> {
        const newRevision: Revision = Revision.fromID(
            Revert.getNewerRevisionId(),
            {
                page: Page.fromTitle(mw.config.get("wgRelevantPageName")),
            }
        );
        const oldRevision: Revision = Revision.fromID(
            Revert.getOlderRevisionId(),
            {
                page: Page.fromTitle(mw.config.get("wgRelevantPageName")),
            }
        );

        await newRevision.populate();

        return {
            newRevision,
            oldRevision,
            latestRevision: Revision.fromID(+mw.config.get("wgCurRevisionId")),
            diffIcons,
        };
    }

    /**
     * Load the revert options. These are the buttons seen at the top of each side of the
     * diff view.
     * @param context The context surrounding the current revert.
     * @param checkIfEditable Check if the page is editable before injecting.
     */
    static loadOptions(
        context: RevertContext,
        checkIfEditable = true
    ): Promise<void> {
        return;
        // // Check if the page is editable
        // if (checkIfEditable && !mw.config.get("wgIsProbablyEditable")) {
        //     return; // Can't edit.
        // }
        //
        // interface IInitalizable {
        //     el: HTMLElement;
        //     component: any;
        // }
        //
        // const toInit: IInitalizable[] = [];
        //
        // const isLatest = $("#mw-diff-ntitle1")
        //     .text()
        //     .includes("Latest revision"); // is this the latest revision diff page?
        // const isLeftLatest = $("#mw-diff-otitle1")
        //     .text()
        //     .includes("Latest revision"); // is the left side the latest revision? (rev13 bug fix)
        //
        // let currentRevisionOptions = (
        //     <span id="rwCurrentRevRollbackBtns" />
        // ) as HTMLSpanElement;
        //
        // if (isLatest || isLeftLatest) {
        //     RollbackOptions.forEach((option, i) => {
        //         const id = `rwRollback_${i}`;
        //
        //         if (option.enabled) {
        //             const button = (
        //                 <button
        //                     class="mdc-icon-button material-icons"
        //                     aria-label={option.name}
        //                     data-tooltip-id={`${id}T`}
        //                     style={{
        //                         fontSize: "28px",
        //                         paddingRight: "5px",
        //                         color: option.color,
        //                     }}
        //                     id={id}
        //                     onClick={getRollbackOptionClickHandler(
        //                         context,
        //                         option
        //                     )}
        //                 >
        //                     {option.icon}
        //                 </button>
        //             );
        //             toInit.push({ el: button, component: MDCRipple });
        //
        //             const tooltip = (
        //                 <div
        //                     id={`${id}T`}
        //                     class="mdc-tooltip"
        //                     role="tooltip"
        //                     aria-hidden="true"
        //                 >
        //                     <div class="mdc-tooltip__surface">
        //                         {option.name}
        //                     </div>
        //                 </div>
        //             );
        //             toInit.push({ el: tooltip, component: MDCTooltip });
        //             currentRevisionOptions.appendChild(button);
        //             currentRevisionOptions.appendChild(tooltip);
        //         }
        //     });
        //
        //     const progressBar = (
        //         <div
        //             id="rwRollbackInProgressBar"
        //             role="progressbar"
        //             class="mdc-linear-progress"
        //             aria-label="RedWarn Revert Progress Bar"
        //             aria-valuemin="0"
        //             aria-valuemax="1"
        //             aria-valuenow="0"
        //             style="width:300px; display: block; margin-left: auto; margin-right: auto;"
        //         >
        //             <div class="mdc-linear-progress__buffer">
        //                 <div class="mdc-linear-progress__buffer-bar" />
        //                 <div class="mdc-linear-progress__buffer-dots" />
        //             </div>
        //             <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
        //                 <span class="mdc-linear-progress__bar-inner" />
        //             </div>
        //             <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        //                 <span class="mdc-linear-progress__bar-inner" />
        //             </div>
        //         </div>
        //     );
        //     context.progressBar = new MDCLinearProgress(progressBar);
        //     context.progressBar.initialize();
        //     context.progressBar.determinate = false;
        //     context.progressBar.progress = 0;
        //     context.progressBar.buffer = 0;
        //
        //     const RevertDoneOptions = (
        //         <span id="rwRevertDoneOptions" style="display:none;">
        //             <div style="height:5px" />
        //             <span style="font-family: Roboto;font-size: 16px;display: inline-flex;vertical-align: middle;">
        //                 <span
        //                     class="material-icons"
        //                     style="color:green;cursor:default;"
        //                 >
        //                     check_circle
        //                 </span>
        //                 &nbsp; &nbsp; Revert complete
        //             </span>
        //             <br />
        //             <div style="height:5px" />
        //         </span>
        //     );
        //
        //     Object.entries(RevertDoneOptions).forEach(([id, option]) => {
        //         const button = (
        //             <button
        //                 class="mdc-icon-button material-icons"
        //                 aria-label={option.name}
        //                 data-tooltip-id={`rwRBDoneIcon_${
        //                     RevertDoneOption[+id]
        //                 }T`}
        //                 id={`rwRBDoneOption_${RevertDoneOption[+id]}`}
        //             >
        //                 {option.icon}
        //             </button>
        //         );
        //         toInit.push({ el: button, component: MDCRipple });
        //
        //         const tooltip = (
        //             <div
        //                 id={`rwRBDoneOption_${RevertDoneOption[+id]}T`}
        //                 class="mdc-tooltip"
        //                 role="tooltip"
        //                 aria-hidden="true"
        //             >
        //                 <div class="mdc-tooltip__surface">{option.name}</div>
        //             </div>
        //         );
        //         toInit.push({ el: tooltip, component: MDCTooltip });
        //
        //         $(RevertDoneOptions).append(button, tooltip, "&nbsp;");
        //     });
        //
        //     currentRevisionOptions = (
        //         <div>
        //             {currentRevisionOptions}
        //             <span id="rwRollbackInProgress" style="display:none;">
        //                 {progressBar}
        //                 <div style="height:5px" />
        //                 {/* <!-- spacer --> */}
        //                 <span style="font-family: Roboto;font-size: 16px;">
        //                     Reverting...
        //                 </span>
        //                 <br />
        //                 <div style="height:5px" />
        //                 {/* <!-- spacer --> */}
        //             </span>
        //             {RevertDoneOptions}
        //         </div>
        //     );
        // }
        //
        // const twinkleLoadedBeforeUs = $('div[id^="tw-revert"]').length > 0;
        //
        // const left = isLeftLatest ? (
        //     currentRevisionOptions
        // ) : (
        //     <RestoreElement left={true} />
        // );
        // if (twinkleLoadedBeforeUs) {
        //     $('.diff-otitle > div[id^="tw-revert"]').after(left);
        // } else {
        //     $(".diff-otitle").prepend(left);
        // }
        //
        // if (!isLeftLatest) {
        //     toInit.push(
        //         { el: $("#rOld1")[0], component: MDCRipple },
        //         { el: $("#rOld1T")[0], component: MDCRipple }
        //     );
        // }
        //
        // const right = isLatest ? (
        //     currentRevisionOptions
        // ) : (
        //     <RestoreElement left={false} />
        // ); // if the latest rev, show the accurate revs, else, don't
        // if (twinkleLoadedBeforeUs) {
        //     $('.diff-ntitle > div[id^="tw-revert"]').after(right);
        // } else {
        //     $(".diff-ntitle").prepend(right);
        // }
        //
        // if (!isLatest) {
        //     toInit.push(
        //         { el: $("#rOld2")[0], component: MDCRipple },
        //         { el: $("#rOld2T")[0], component: MDCRipple }
        //     );
        // }
        //
        // setTimeout(() => {
        //     toInit.forEach((c) => new c.component(c.el).initialize());
        // }, 100);
    }

    static getDisabledOptions(
        context: RevertContext
    ): RWUISelectionDialogItem[] {
        // Open a new dialog with all the disabled options so user can select one. Click handlers are already registered, so we just call rw.revert.clickHandlers.[elID]();
        // Load Revert current rev options (rev14)
        const icons: RWUISelectionDialogItem[] = [];
        // RollbackOptions.forEach((option, i) => {
        //     if (option.enabled) {
        //         return;
        //     } // if option is enabled, we can skip
        //     if (option.name == "More Options") {
        //         return;
        //     } // does nothing here, so not needed
        //
        //     const elID = `revert${i}`; // get the ID for the new options
        //
        //     // Establish element with all the info
        //     icons.push({
        //         icon: option.icon,
        //         iconColor: option.color,
        //         data: elID,
        //         content: option.name,
        //         action: getRollbackOptionClickHandler(context, option),
        //     });
        // });

        return icons;
    }
}

interface RestoreProps extends BaseProps {
    left: boolean;
}

function RestoreElement(props: RestoreProps) {
    return (
        <div>
            <button
                class="mdc-icon-button material-icons"
                aria-label="Restore this version"
                data-tooltip-id={`rOld${props.left ? "1" : "2"}T`}
                id={`rOld${props.left ? "1" : "2"}`}
                style={{
                    fontSize: "28px",
                    paddingRight: "5px",
                    color: "purple",
                }}
                onClick={() => {
                    Revert.promptRestore(
                        Revision.fromID(
                            +$(
                                `#mw-diff-${
                                    props.left ? "o" : "n"
                                }title1 > strong > a`
                            )
                                .attr("href")
                                .split("&")[1]
                                .split("=")[1],
                            {
                                page: Page.fromTitle(
                                    mw.config.get("wgRelevantPageName")
                                ),
                            }
                        )
                    );
                }}
            >
                history
            </button>
            <div
                class="mdc-tooltip"
                id={`rOld${props.left ? "1" : "2"}T`}
                role="tooltip"
                aria-hidden="true"
            >
                <div class="mdc-tooltip__surface">Restore this version</div>
            </div>
        </div>
    );
}
