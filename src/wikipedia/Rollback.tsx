import {MDCLinearProgress} from "@material/linear-progress";
import {MDCRipple} from "@material/ripple";
import {MDCTooltip} from "@material/tooltip";
import i18next from "i18next";
import {BaseProps, h} from "tsx-dom";
import {RW_VERSION_TAG, RW_WIKIS_TAGGABLE} from "../data/RedWarnConstants";
import RedWarnStore from "../data/RedWarnStore";
import {RWUISelectionDialogItem} from "../ui/elements/RWUIDialog";
import RWUI from "../ui/RWUI";
import redirect from "../util/redirect";
import WikipediaAPI from "./API";
import Revision from "./Revision";
import WikipediaURL from "./URL";
import {Warnings} from "./Warnings";
import {RollbackOption, RollbackOptions,} from "../definitions/RollbackOptions";
import {RollbackDoneOptions} from "../definitions/RollbackDoneOptions";

function getRollbackOptionClickHandler(
    context: Rollback,
    option: RollbackOption
): () => void {
    let clickHandler;

    if (option.actionType === "function") {
        clickHandler = option.action(context);
    } else {
        if (!option.promptReason) {
            clickHandler = () =>
                this.rollback(option.summary, option.ruleIndex);
        } else {
            clickHandler = () => this.promptRollbackReason(option.summary);
        }
    }

    return clickHandler;
}

interface RollbackContext {
    reason: string;
    targetRevision: Revision;
    defaultWarnIndex?: keyof Warnings;
    showRollbackDoneOptions?: boolean;
}

export default class Rollback {
    private constructor(
        public rollbackRevision: Revision,
        private redirectOnUpdate = true
    ) {}

    static async factory(
        rollbackRev: Revision = new Revision(),
        noRedirects?: boolean
    ): Promise<Rollback> {
        rollbackRev.revisionID ??= Rollback.getRevisionId(true);
        rollbackRev.page ??= mw.config.get("wgRelevantPageName");
        try {
            rollbackRev.user ??= (
                await WikipediaAPI.isLatestRevision(rollbackRev, true)
            ).user;
        } catch (e) {
            console.log("redwarn: No latest revisions");
        }

        return new this(rollbackRev, noRedirects);
    }

    static async init(): Promise<void> {
        if ($("table.diff").length > 0) {
            // DETECT DIFF HERE - if diff table is present
            const instance = await this.factory();
            await instance.loadOptions();
        } else if (
            mw.config
                .get("wgRelevantPageName")
                .includes("Special:Contributions")
        ) {
            // Special contribs page
            this.contribsPageOptions();
        }
    }

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
    static isDiffPage() : true | "onlyrev" | false {
        return mw.config.get("wgDiffOldId") === false ? "onlyrev" : !!mw.config.get("wgDiffNewId");
    }

    async welcomeRevUser(): Promise<void> {
        // Send welcome to user who made most recent revision
        // TODO toasts
        // rw.visuals.toast.show("Please wait...", false, false, 1000);
        await this.rollbackRevision.user.quickWelcome();
    }
    async promptRestoreReason(revID: number): Promise<void> {
        const dialog = new RWUI.InputDialog(i18next.t("ui:restore"));
        const reason = await dialog.show();
        if (reason !== null) {
            this.restore(revID, reason);
        }
    }
    async restore(revID: number, reason: string): Promise<void> {
        const latest = await WikipediaAPI.getRevision(
            this.rollbackRevision.page
        );
        const restoreRev = await WikipediaAPI.getRevision(
            this.rollbackRevision.page,
            revID
        );
        const result = await WikipediaAPI.postWithEditToken({
            action: "edit",
            title: this.rollbackRevision.page,
            summary: i18next.t("wikipedia:summaries.restore", {
                revID,
                revUser: restoreRev.user.username,
                reason,
            }),
            undo: latest.revisionID,
            undoafter: revID,
            tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
                ? "RedWarn"
                : null,
        });
        if (!result.edit) {
            console.error(result);
            // TODO toasts
            //rw.visuals.toast.show("Sorry, there was an error, likely an edit conflict. This edit has not been restored.");
        } else if (!this.redirectOnUpdate) {
            WikipediaAPI.goToLatestRevision(this.rollbackRevision.page);
        }
    }

    /**
     * Grab the newer revision ID from the diff view. This also handles situations
     * where the diff view is reversed.
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
            return (newId > oldId && newer) || (newId < oldId && !newer) ? newId : oldId;
        } else
            {return null;}
    }

    /**
     * Grab the newer revision ID from the diff view. This also handles situations
     * where the diff view is reversed.
     *
     * @returns The newer revision. `null` if the page is not a valid diff page.
     */
    static getNewerRevisionId : typeof Rollback.getRevisionId =
        () => Rollback.getRevisionId(true);
    /**
     * Grab the older revision ID from the diff view. This also handles situations
     * where the diff view is reversed.
     *
     * @returns The older revision. `null` if the page is not a valid diff page.
     */
    static getOlderRevisionId : typeof Rollback.getRevisionId =
        () => Rollback.getRevisionId(false);

    async preview(): Promise<void> {
        // TODO dialog
        //rw.ui.loadDialog.show("Loading preview...");
        // Check if latest, else redirect
        const { user } = await WikipediaAPI.isLatestRevision(
            this.rollbackRevision,
            this.redirectOnUpdate
        );
        const { revisionID } = await WikipediaAPI.latestRevisionNotByUser(
            this.rollbackRevision.page,
            user.username
        );
        const url = WikipediaURL.getDiffUrl(
            `${revisionID}`,
            mw.util.getParamValue("diff"),
            "rollbackPreview"
        );
        redirect(url);
    }

    loadOptions(checkIfEditable = true): Promise<void> {
        // Check if page is editable, if not, don't show
        if (checkIfEditable && !mw.config.get("wgIsProbablyEditable")) {
            // Can't edit, so exit
            return;
        }

        // else, continue :)

        interface IInitalizable {
            el: HTMLElement;
            component: any;
        }

        const toInit: IInitalizable[] = [];

        const isLatest = $("#mw-diff-ntitle1")
            .text()
            .includes("Latest revision"); // is this the latest revision diff page?
        const isLeftLatest = $("#mw-diff-otitle1")
            .text()
            .includes("Latest revision"); // is the left side the latest revision? (rev13 bug fix)

        let currentRevisionOptions = (
            <span id="rwCurrentRevRollbackBtns" />
        ) as HTMLSpanElement;

        if (isLatest || isLeftLatest) {
            RollbackOptions.forEach((option, i) => {
                const id = `rwRollback_${i}`;

                if (option.enabled) {
                    const button = (
                        <button
                            class="mdc-icon-button material-icons"
                            aria-label={option.name}
                            data-tooltip-id={`${id}T`}
                            style={{
                                fontSize: "28px",
                                paddingRight: "5px",
                                color: option.color,
                            }}
                            id={id}
                            onClick={getRollbackOptionClickHandler(
                                this,
                                option
                            )}
                        >
                            {option.icon}
                        </button>
                    );
                    toInit.push({ el: button, component: MDCRipple });

                    const tooltip = (
                        <div
                            id={`${id}T`}
                            class="mdc-tooltip"
                            role="tooltip"
                            aria-hidden="true"
                        >
                            <div class="mdc-tooltip__surface">
                                {option.name}
                            </div>
                        </div>
                    );
                    toInit.push({ el: tooltip, component: MDCTooltip });
                    currentRevisionOptions.appendChild(button);
                    currentRevisionOptions.appendChild(tooltip);
                }
            });

            const progressBar = (
                <div
                    id="rwRollbackInProgressBar"
                    role="progressbar"
                    class="mdc-linear-progress"
                    aria-label="RedWarn Rollback Progress Bar"
                    aria-valuemin="0"
                    aria-valuemax="1"
                    aria-valuenow="0"
                    style="width:300px; display: block; margin-left: auto; margin-right: auto;"
                >
                    <div class="mdc-linear-progress__buffer">
                        <div class="mdc-linear-progress__buffer-bar" />
                        <div class="mdc-linear-progress__buffer-dots" />
                    </div>
                    <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                        <span class="mdc-linear-progress__bar-inner" />
                    </div>
                    <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                        <span class="mdc-linear-progress__bar-inner" />
                    </div>
                </div>
            );
            this.progressBarElement = new MDCLinearProgress(progressBar);
            this.progressBarElement.initialize();
            this.progressBarElement.determinate = false;
            this.progressBarElement.progress = 0;
            this.progressBarElement.buffer = 0;

            const rollbackDoneOptions = (
                <span id="rwRollbackDoneOptions" style="display:none;">
                    <div style="height:5px" />
                    <span style="font-family: Roboto;font-size: 16px;display: inline-flex;vertical-align: middle;">
                        <span
                            class="material-icons"
                            style="color:green;cursor:default;"
                        >
                            check_circle
                        </span>
                        &nbsp; &nbsp; Rollback complete
                    </span>
                    <br />
                    <div style="height:5px" />
                </span>
            );

            RollbackDoneOptions.forEach((option) => {
                const button = (
                    <button
                        class="mdc-icon-button material-icons"
                        aria-label={option.name}
                        data-tooltip-id={`rwRBDoneIcon_${option.id}T`}
                        id={`rwRBDoneOption_${option.id}`}
                    >
                        {option.icon}
                    </button>
                );
                toInit.push({ el: button, component: MDCRipple });

                const tooltip = (
                    <div
                        id={`rwRBDoneOption_${option.id}T`}
                        class="mdc-tooltip"
                        role="tooltip"
                        aria-hidden="true"
                    >
                        <div class="mdc-tooltip__surface">{option.name}</div>
                    </div>
                );
                toInit.push({ el: tooltip, component: MDCTooltip });

                $(rollbackDoneOptions).append(button, tooltip, "&nbsp;");
            });

            currentRevisionOptions = (
                <div>
                    {currentRevisionOptions}
                    <span id="rwRollbackInProgress" style="display:none;">
                        {progressBar}
                        <div style="height:5px" />
                        {/* <!-- spacer --> */}
                        <span style="font-family: Roboto;font-size: 16px;">
                            Reverting...
                        </span>
                        <br />
                        <div style="height:5px" />
                        {/* <!-- spacer --> */}
                    </span>
                    {rollbackDoneOptions}
                </div>
            );
        }

        const twinkleLoadedBeforeUs = $('div[id^="tw-revert"]').length > 0;

        const left = isLeftLatest ? (
            currentRevisionOptions
        ) : (
            <RestoreElement left={true} rollback={this} />
        );
        if (twinkleLoadedBeforeUs) {
            $('.diff-otitle > div[id^="tw-revert"]').after(left);
        } else {
            $(".diff-otitle").prepend(left);
        }

        if (!isLeftLatest) {
            toInit.push(
                { el: $("#rOld1")[0], component: MDCRipple },
                { el: $("#rOld1T")[0], component: MDCRipple }
            );
        }

        const right = isLatest ? (
            currentRevisionOptions
        ) : (
            <RestoreElement left={false} rollback={this} />
        ); // if the latest rev, show the accurate revs, else, don't
        if (twinkleLoadedBeforeUs) {
            $('.diff-ntitle > div[id^="tw-revert"]').after(right);
        } else {
            $(".diff-ntitle").prepend(right);
        }

        if (!isLatest) {
            toInit.push(
                { el: $("#rOld2")[0], component: MDCRipple },
                { el: $("#rOld2T")[0], component: MDCRipple }
            );
        }

        setTimeout(() => {
            toInit.forEach((c) => new c.component(c.el).initialize());
        }, 100);
    }
    async promptRollbackReason(summary: string): Promise<void> {
        await WikipediaAPI.isLatestRevision(
            this.rollbackRevision,
            this.redirectOnUpdate
        );
        const dialog = new RWUI.InputDialog({
            ...i18next.t("ui:rollback"),
            defaultText: summary,
        });
        const reason = await dialog.show();
        if (reason !== null) {
            this.rollback(reason);
        }
    }

    async pseudoRollback({
        targetRevision,
        defaultWarnIndex,
        reason,
        showRollbackDoneOptions,
    }: RollbackContext) : Promise<void> {
        const latestRev = await WikipediaAPI.latestRevisionNotByUser(
            this.rollbackRevision.page,
            targetRevision.user.username
        );

        if (latestRev.parentID === this.rollbackRevision.revisionID) {
            if (this.redirectOnUpdate) {
                // TODO show toast
            } else {
                // looks like that there is a newer revision! redirect to it.
                WikipediaAPI.goToLatestRevision(this.rollbackRevision.page);
                return; // stop here.
            }
        }

        const summary = i18next.t("wikipedia:summaries.revert", {
            username: targetRevision.user.username,
            targetRevisionId: latestRev.revisionID,
            targetRevisionEditor: latestRev.user.username,
            version: RW_VERSION_TAG,
            reason,
        });
        const res = await WikipediaAPI.postWithEditToken({
            action: "edit",
            format: "json",
            title: this.rollbackRevision.page,
            summary,
            undo: targetRevision.revisionID, // current
            undoafter: latestRev.revisionID, // restore version
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

            // TODO toast
            /* rw.visuals.toast.show(
                "Sorry, there was an error, likely an edit conflict. Your rollback has not been applied."
            ); */
        } else {
            this.progressBarElement.close();
            return showRollbackDoneOptions
                ? this.showRollbackDoneOps(
                      targetRevision.user.username,
                      defaultWarnIndex
                  )
                : null;
        }
    }

    async standardRollback({
        targetRevision,
        defaultWarnIndex,
        reason,
        showRollbackDoneOptions,
    }: RollbackContext) : Promise<void> {
        try {
            const summary = i18next.t("wikipedia:summaries.rollback", {
                username: targetRevision.user.username,
                reason,
                version: RW_VERSION_TAG,
            });
            await WikipediaAPI.api.rollback(
                this.rollbackRevision.page,
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
            // TODO toast
            /* rw.visuals.toast.show(
                "Sorry, there was an error, likely an edit conflict. Your rollback has not been applied."
            ); */
        }

        this.progressBarElement.close();
        return showRollbackDoneOptions
            ? this.showRollbackDoneOps(
                  targetRevision.user.username,
                  defaultWarnIndex
              )
            : null;
    }

    async rollback(
        reason: string,
        defaultWarnIndex?: keyof Warnings,
        showRollbackDoneOptions = true
    ): Promise<void> {
        // Show progress bar
        $("#rwCurrentRevRollbackBtns").hide();
        $("#rwRollbackInProgress").show();

        this.progressBarElement.open();

        const targetRevision = await WikipediaAPI.isLatestRevision(
            this.rollbackRevision,
            this.redirectOnUpdate
        );

        const context: RollbackContext = {
            targetRevision: targetRevision,
            defaultWarnIndex: defaultWarnIndex,
            reason: reason,
            showRollbackDoneOptions: showRollbackDoneOptions,
        };

        if (WikipediaAPI.hasGroup("rollbacker")) {
            // TODO config dialog
            if (/* !rw.config.rollbackMethod */ false) {
                /* rw.ui.confirmDialog(`
                You have rollback permissions!
                Would you like to use the faster rollback API in future or continue using a rollback-like setting?
                You can change this in your preferences at any time.`,
                "USE ROLLBACK", ()=>{
                    dialogEngine.closeDialog();
                    rw.config.rollbackMethod = "rollback";
                    rw.info.writeConfig(true, ()=>rollbackCallback()); // save config and callback
                },
                "KEEP USING ROLLBACK-LIKE",()=>{
                    dialogEngine.closeDialog();
                    rw.config.rollbackMethod = "pseudoRollback";
                    rw.info.writeConfig(true, ()=>pseudoRollbackCallback()); // save config and callback
                },45); */
            } else {
                // Config set, complete callback - remember, this is feature restricted so we won't get here without RB perms
                // TODO config
                if (/* rw.config.rollbackMethod */ "rollback" == "rollback") {
                    // Rollback selected
                    return await this.standardRollback(context); // Do rollback
                } else {
                    return await this.pseudoRollback(context); // rollback-like
                }
            }
        } else {
            return await this.pseudoRollback(context);
        }
    }

    getDisabledOptions(): RWUISelectionDialogItem[] {
        // Open a new dialog with all the disabled options so user can select one. Click handlers are already registered, so we just call rw.rollback.clickHandlers.[elID]();
        // Load Rollback current rev options (rev14)
        const icons: RWUISelectionDialogItem[] = [];
        RollbackOptions.forEach((option, i) => {
            if (option.enabled) {
                return;
            } // if option is enabled, we can skip
            if (option.name == "More Options") {
                return;
            } // does nothing here, so not needed

            const elID = `rollback${i}`; // get the ID for the new options

            // Establish element with all the info
            icons.push({
                icon: option.icon,
                iconColor: option.color,
                data: elID,
                content: option.name,
                action: getRollbackOptionClickHandler(this, option),
            });
        });

        return icons;
    }

    private progressBarElement: MDCLinearProgress | null;

    showRollbackDoneOps(un: string, warnIndex: keyof Warnings): void {
        // Clear get hidden handler to stop errors in more options menu
        this.getDisabledOptions = () => []; // return empty

        const clickHandlerFactory = (
            handler: (
                rollback: Rollback,
                username: string,
                warnIndex: keyof Warnings
            ) => any
        ) => () => handler(this, un, warnIndex);

        // Add click handlers

        RollbackDoneOptions.forEach((option) => {
            $(`#rwRBDoneOption_${option.id}`).on(
                "click",
                clickHandlerFactory(option.action)
            );
        });

        // TODO config
        // Now perform default (if set)
        /*         if (
            rw.config.rwRollbackDoneOption != null ||
            rw.config.rwRollbackDoneOption != "none"
        )
            $(`#${rw.config.rwRollbackDoneOption}`).click(); */

        // Hides other options and shows the rollback done options and also checks for defaults, also adds click handlers
        $("#rwRollbackInProgress").fadeOut(() => {
            // fade out - looks smoother
            $("#rwRollbackDoneOptions").fadeIn(); //show our options
        });
    }

    // CONTRIBS PAGE
    static contribsPageOptions(): void {
        // For each (current) tag
        $("span.mw-uctop").each((i, el) => {
            // TODO i18n

            const li = $(el).closest("li");

            const rollback = new Rollback({
                page: li.find("a.mw-contributions-title").text(),
                revisionID: +li.attr("data-mw-revisionID"),
            });

            const previewLink = (
                <a
                    style="color:green;cursor:pointer;"
                    id={`rw-currentRevPrev${i}`}
                    onClick={() => rollback.preview()}
                    aria-describedby={`rw-currentRevPrev${i}T`}
                >
                    prev
                </a>
            );
            const previewTooltip = (
                <div
                    id={`rw-currentRevPrev${i}T`}
                    class="mdc-tooltip"
                    role="tooltip"
                    aria-hidden="true"
                >
                    <div class="mdc-tooltip__surface">Preview Rollback</div>
                </div>
            );

            const vandalLink = (
                <a
                    style="color:red;cursor:pointer;"
                    id={`rw-currentRevRvv${i}`}
                    onClick={() =>
                        rollback.rollback(
                            "[[WP:VANDAL|Possible vandalism]]",
                            "vandalism"
                        )
                    }
                    aria-describedby={`rw-currentRevRvv${i}T`}
                >
                    rvv
                </a>
            );
            const vandalTooltip = (
                <div
                    id={`rw-currentRevRvv${i}T`}
                    class="mdc-tooltip"
                    role="tooltip"
                    aria-hidden="true"
                >
                    <div class="mdc-tooltip__surface">
                        Quick Rollback Vandalism
                    </div>
                </div>
            );

            const rollbackLink = (
                <a
                    style="color:blue;cursor:pointer;"
                    id={`rw-currentRevRb${i}`}
                    onClick={() => rollback.promptRollbackReason("")}
                    aria-describedby={`rw-currentRevRb${i}T`}
                >
                    rb
                </a>
            );
            const rollbackTooltip = (
                <div
                    id={`rw-currentRevRb${i}T`}
                    class="mdc-tooltip"
                    role="tooltip"
                    aria-hidden="true"
                >
                    <div class="mdc-tooltip__surface">Rollback</div>
                </div>
            );

            const wrapper = (
                <span id="rw-currentRev${i}" style="cursor:default">
                    {/* <!-- Wrapper --> */}
                    <span style="font-family:Roboto;font-weight:400;">
                        &nbsp; {/* <!-- Styling container --> */}
                        {previewLink}&nbsp;
                        {vandalLink}&nbsp;
                        {rollbackLink}&nbsp;
                        {previewTooltip}&nbsp;
                        {vandalTooltip}&nbsp;
                        {rollbackTooltip}
                    </span>
                </span>
            );

            $(el).append(wrapper);

            // need to initialize *after* appending to dom since mdc looks for anchor elem
            const mdcPreviewTooltip = new MDCTooltip(previewTooltip);
            mdcPreviewTooltip.initialize();

            const mdcVandalTooltip = new MDCTooltip(vandalTooltip);
            mdcVandalTooltip.initialize();

            const mdcRollbackTooltip = new MDCTooltip(rollbackTooltip);
            mdcRollbackTooltip.initialize();
        });
    }
}

interface RestoreProps extends BaseProps {
    rollback: Rollback;
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
                    props.rollback.promptRestoreReason(
                        +$(
                            `#mw-diff-${
                                props.left ? "o" : "n"
                            }title1 > strong > a`
                        )
                            .attr("href")
                            .split("&")[1]
                            .split("=")[1]
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
