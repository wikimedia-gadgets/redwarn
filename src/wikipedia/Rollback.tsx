import { MDCTooltip } from "@material/tooltip";
import { MDCRipple } from "@material/ripple";
import { MDCLinearProgress } from "@material/linear-progress";
import { BaseProps, h as TSX } from "tsx-dom";
import RedWarnStore from "../data/RedWarnStore";
import redirect from "../util/redirect";
import WikipediaAPI from "./API";
import Revision from "./Revision";
import {
    RW_VERSION,
    RW_VERSION_TAG,
    RW_WIKIS_TAGGABLE,
} from "../data/RedWarnConstants";
import RWUI from "../ui/RWUI";
import i18next from "i18next";
import type { MDCComponent } from "@material/base";
import type { MDCFoundation } from "@material/base/foundation";

export default class Rollback {
    private constructor(public rollbackRev: Revision) {}

    static async factory(rollbackRev: Revision = {}): Promise<Rollback> {
        rollbackRev.revid ??= Rollback.detectRollbackRevId();
        rollbackRev.page ??= mw.config.get("wgRelevantPageName");
        rollbackRev.user ??= (
            await WikipediaAPI.isLatestRevision(rollbackRev)
        ).user;

        return new this(rollbackRev);
    }

    static async init(): Promise<void> {
        if ($("table.diff").length > 0) {
            // DETECT DIFF HERE - if diff table is present
            const instance = await this.factory();
            await instance.loadIcons();
        } else if (
            mw.config
                .get("wgRelevantPageName")
                .includes("Special:Contributions")
        ) {
            // Special contribs page
            this.contribsPageIcons();
        }
    }

    async welcomeRevUser(): Promise<void> {
        // Send welcome to user who made most recent revision
        // TODO toasts
        // rw.visuals.toast.show("Please wait...", false, false, 1000);
        await this.rollbackRev.user.quickWelcome();
    }
    selectFromDisabled(): void {
        // TODO: this function solely relies on dialogs, so that needs to be done first
        throw new Error("Method not implemented.");
    }
    async promptRestoreReason(revID: string): Promise<void> {
        // TODO: this function solely relies on dialogs, so that needs to be done first
        throw new Error("Method not implemented.");
    }
    static detectRollbackRevId(failIfNone = true): number {
        const isNLatest = $("#mw-diff-ntitle1")
            .text()
            .includes("Latest revision");
        const isOLatest = $("#mw-diff-otitle1")
            .text()
            .includes("Latest revision");
        if (isNLatest) {
            // Return the revID of the edit on the right
            return +$("#mw-diff-ntitle1 > strong > a")
                .attr("href")
                .split("&")[1]
                .split("=")[1];
        } else if (isOLatest) {
            return +$("#mw-diff-otitle1 > strong > a")
                .attr("href")
                .split("&")[1]
                .split("=")[1];
        } else if (failIfNone) {
            // BUG!
            new RWUI.Dialog({
                title: "Error",
                content: [
                    "An error occurred! (rollback getRollbackRevId failed via final else!)",
                ],
                actions: [
                    {
                        data: "report",
                        text: "Report Bug",
                        action: () => {
                            // TODO report bug
                            /* rw.ui.reportBug(
                        "rollback getRollbackRevID failed via final else! related URL: " +
                            window.location.href
                    ) */
                        },
                    },
                ],
            }).show();
        }
        return null;
    }

    async preview(): Promise<void> {
        // TODO dialog
        //rw.ui.loadDialog.show("Loading preview...");
        // Check if latest, else redirect
        /* rw.info.isLatestRevision(mw.config.get("wgRelevantPageName"), rw.rollback.getRollbackrevID(), un=>{
            // Fetch latest revision not by user
            rw.info.latestRevisionNotByUser(mw.config.get("wgRelevantPageName"), un, (content, summary, rID) => {
                // Got it! Now open preview dialog

                // Add handler for when page loaded
                let url = rw.wikiIndex + "?title="+ mw.config.get("wgRelevantPageName") +"&diff="+ rID +"&oldid="+ mw.util.getParamValue("diff") +"&diffmode=source#rollbackPreview";
                redirect(url); // goto in current tab
            });
        }); */
        const { user } = await WikipediaAPI.isLatestRevision(this.rollbackRev);
        const { revid } = await WikipediaAPI.latestRevisionNotByUser(
            mw.config.get("wgRelevantPageName"),
            user.username
        );
        const url =
            RedWarnStore.wikiIndex +
            "?title=" +
            mw.config.get("wgRelevantPageName") +
            "&diff=" +
            revid +
            "&oldid=" +
            mw.util.getParamValue("diff") +
            "&diffmode=source#rollbackPreview";
        redirect(url);
    }

    async loadIcons(): Promise<void> {
        // Check if page is editable, if not, don't show
        if (!mw.config.get("wgIsProbablyEditable")) {
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

        let currentRevIcons = (
            <span id="rwCurrentRevRollbackBtns"></span>
        ) as HTMLSpanElement;

        RollbackIcons.forEach((icon, i) => {
            const id = `rwRollback_${i}`;
            let clickHandler;

            if (icon.actionType === "function") {
                clickHandler = icon.action(this);
            } else {
                if (!icon.promptReason) {
                    clickHandler = () =>
                        this.rollback(icon.summary, icon.ruleIndex);
                } else {
                    clickHandler = () =>
                        this.promptRollbackReason(icon.summary);
                }
            }

            if (icon.enabled) {
                /* const elem = (
                    <div id={id} class="icon material-icons">
                        <span
                            style={{
                                cursor: "pointer",
                                fontSize: "28px",
                                paddingRight: "5px",
                                color: icon.color,
                            }}
                            onClick={clickHandler}
                        ></span>
                    </div>
                );
                const iconElem = (
                    <div class="mdl-tooltip mdl-tooltip--large" for={id}>
                        {icon.name}
                    </div>
                ); */
                const button = (
                    <button
                        class="mdc-icon-button material-icons"
                        aria-label={icon.name}
                        data-tooltip-id={`${id}T`}
                        style={{
                            fontSize: "28px",
                            paddingRight: "5px",
                            color: icon.color,
                        }}
                        id={id}
                        onClick={clickHandler}
                    >
                        {icon.icon}
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
                        <div class="mdc-tooltip__surface">{icon.name}</div>
                    </div>
                );
                toInit.push({ el: tooltip, component: MDCTooltip });
                currentRevIcons.appendChild(button);
                currentRevIcons.appendChild(tooltip);
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
                    <div class="mdc-linear-progress__buffer-bar"></div>
                    <div class="mdc-linear-progress__buffer-dots"></div>
                </div>
                <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                    <span class="mdc-linear-progress__bar-inner"></span>
                </div>
                <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                    <span class="mdc-linear-progress__bar-inner"></span>
                </div>
            </div>
        );
        this.progressBarElement = new MDCLinearProgress(progressBar);
        this.progressBarElement.initialize();

        const rollbackDoneIcons = (
            <span id="rwRollbackDoneIcons" style="display:none;">
                <div style="height:5px"></div>
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
                <div style="height:5px"></div>
            </span>
        );

        /* <button
                    class="mdc-icon-button material-icons"
                    aria-label="Go to latest revision"
                    data-tooltip-id="RWRBDONEmrevPgT"
                    id="RWRBDONEmrevPg"
                >
                    watch_later
                </button>
                <div
                    id="RWRBDONEmrevPgT"
                    class="mdc-tooltip"
                    role="tooltip"
                    aria-hidden="true"
                >
                    <div class="mdc-tooltip__surface">
                        Go to latest revision
                    </div>
                </div>
                &nbsp; &nbsp; */

        RollbackDoneIcons.forEach((icon) => {
            const button = (
                <button
                    class="mdc-icon-button material-icons"
                    aria-label={icon.name}
                    data-tooltip-id={`rwRBDoneIcon_${icon.id}T`}
                    id={`rwRBDoneIcon_${icon.id}`}
                >
                    {icon.icon}
                </button>
            );
            toInit.push({ el: button, component: MDCRipple });

            const tooltip = (
                <div
                    id={`rwRBDoneIcon_${icon.id}T`}
                    class="mdc-tooltip"
                    role="tooltip"
                    aria-hidden="true"
                >
                    <div class="mdc-tooltip__surface">{icon.name}</div>
                </div>
            );
            toInit.push({ el: tooltip, component: MDCTooltip });

            rollbackDoneIcons.append(button, tooltip, "&nbsp; &nbsp;");
        });

        currentRevIcons = (
            <div>
                {currentRevIcons}
                <span id="rwRollbackInProgress" style="display:none;">
                    {progressBar}
                    <div style="height:5px"></div>
                    {/* <!-- spacer --> */}
                    <span style="font-family: Roboto;font-size: 16px;">
                        Reverting...
                    </span>
                    <br />
                    <div style="height:5px"></div>
                    {/* <!-- spacer --> */}
                </span>
                {rollbackDoneIcons}
            </div>
        );

        // idk why eslint decides to die for me
        // eslint-disable-next-line quotes
        const twinkleLoadedBeforeUs = $('div[id^="tw-revert"]').length > 0;

        const left = isLeftLatest ? (
            currentRevIcons
        ) : (
            <RestoreElement left={true} rollback={this} />
        );
        if (twinkleLoadedBeforeUs) {
            // eslint-disable-next-line quotes
            $('.diff-otitle > div[id^="tw-revert"]').after(left);
        } else {
            $(".diff-otitle").prepend(left);
        }

        const right = isLatest ? (
            currentRevIcons
        ) : (
            <RestoreElement left={false} rollback={this} />
        ); // if the latest rev, show the accurate revs, else, don't
        if (twinkleLoadedBeforeUs) {
            // eslint-disable-next-line quotes
            $('.diff-ntitle > div[id^="tw-revert"]').after(right);
        } else {
            $(".diff-ntitle").prepend(right);
        }

        setTimeout(() => {
            toInit.forEach((c) => new c.component(c.el).initialize());
        }, 100);
    }
    async promptRollbackReason(summary: string): Promise<void> {
        // TODO: this function solely relies on dialogs, so that needs to be done first

        await WikipediaAPI.isLatestRevision(this.rollbackRev);
    }

    async rollback(
        reason: string,
        defaultWarnIndex: number,
        showRollbackDoneOps = true
    ): Promise<void> {
        // Show progress bar
        $("#rwCurrentRevRollbackBtns").hide();
        $("#rwRollbackInProgress").show();

        this.progressBar(0, 0);

        const rev = await WikipediaAPI.isLatestRevision(this.rollbackRev);

        const pseudoRollbackCallback = async () => {
            this.progressBar(25, 0);

            const latestRev = await WikipediaAPI.latestRevisionNotByUser(
                mw.config.get("wgRelevantPageName"),
                rev.user.username
            );

            if (latestRev.parentid === Rollback.detectRollbackRevId()) {
                // looks like that there is a newer revision! redirect to it.
                WikipediaAPI.goToLatestRevision(this.rollbackRev.page);
                return; // stop here.
            }

            const summary = i18next.t("wikipedia:summaries.revert", {
                username: rev.user.username,
                targetRevisionId: latestRev.revid,
                targetRevisionUser: latestRev.user.username,
            });
            const res = await WikipediaAPI.postWithEditToken({
                action: "edit",
                format: "json",
                title: mw.config.get("wgRelevantPageName"),
                summary:
                    summary +
                    ": " +
                    reason +
                    " [[w:en:WP:RW|(RW " +
                    RW_VERSION_TAG +
                    ")]]", // summary sign here
                undo: rev.revid, // current
                undoafter: latestRev.revid, // restore version
                tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
                    ? "RedWarn"
                    : null,
            });
            if (!res.edit) {
                // Error occured or other issue
                console.error(res);
                // Show rollback icons again (todo)
                $("#rwCurrentRevRollbackBtns").show();
                $("#rwRollbackInProgress").hide();

                // TODO toast
                /* rw.visuals.toast.show(
                    "Sorry, there was an error, likely an edit conflict. Your rollback has not been applied."
                ); */
            } else {
                this.progressBar(100, 100);

                let resolve: (value?: any) => void;
                const promise = new Promise<void>((res) => {
                    resolve = res;
                });
                setTimeout(() => {
                    if (showRollbackDoneOps) {
                        resolve(
                            this.showRollbackDoneOps(
                                rev.user.username,
                                defaultWarnIndex
                            )
                        );
                    } else {
                        resolve();
                    }
                });
                return await promise;
            }
        };

        const rollbackCallback = async () => {
            this.progressBar(70, 70);

            try {
                await WikipediaAPI.api.rollback(
                    mw.config.get("wgRelevantPageName"),
                    rev.user.username,
                    {
                        // TODO i18n
                        summary:
                            "Rollback edit(s) by [[Special:Contributions/" +
                            rev.user +
                            "|" +
                            rev.user +
                            "]] ([[User_talk:" +
                            rev.user +
                            "|talk]]): " +
                            reason +
                            " [[w:en:WP:RW|(RW " +
                            RW_VERSION +
                            ")]]", // summary sign here
                        tags: RW_WIKIS_TAGGABLE.includes(RedWarnStore.wikiID)
                            ? "RedWarn"
                            : null,
                    }
                );
            } catch (e) {
                // Error occurred or other issue
                console.error(e);
                // Show rollback icons again
                $("#rwCurrentRevRollbackBtns").show();
                $("#rwRollbackInProgress").hide();
                // TODO toast
                /* rw.visuals.toast.show(
                    "Sorry, there was an error, likely an edit conflict. Your rollback has not been applied."
                ); */
            }

            this.progressBar(100, 100);

            let resolve: (value?: any) => void;
            const promise = new Promise<void>((res) => {
                resolve = res;
            });
            setTimeout(() => {
                if (showRollbackDoneOps) {
                    resolve(
                        this.showRollbackDoneOps(
                            rev.user.username,
                            defaultWarnIndex
                        )
                    );
                } else {
                    resolve();
                }
            });
            return await promise;
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
                    return await rollbackCallback(); // Do rollback
                } else {
                    return await pseudoRollbackCallback(); // rollback-like
                }
            }
        } else {
            return await pseudoRollbackCallback();
        }
    }

    getDisabledHTMLandHandlers(): HTMLElement[] {
        // Open a new dialog with all the disabled icons so user can select one. Click handlers are already registered, so we just call rw.rollback.clickHandlers.[elID]();
        // Load Rollback current rev icons (rev14)
        const finalIconStr: HTMLElement[] = [];
        RollbackIcons.forEach((icon, i) => {
            if (icon.enabled) {
                return;
            } // if icon is enabled, we can skip
            if (icon.name == "More Options") {
                return;
            } // does nothing here, so not needed

            const elID = "rwRollback_" + i; // get the ID for the new icons

            // Establish element with all the info
            finalIconStr.push(
                <div>
                    <div
                        class="mdl-button mdl-js-button"
                        style="width:100%; text-align: left;"
                        onClick={() =>
                            window.parent.postMessage(
                                `rwRollbackBtn${elID}`,
                                "*"
                            )
                        }
                    >
                        <span
                            class="material-icons"
                            style={`padding-right:20px;color:${icon.color};`}
                        >
                            {icon.icon}
                        </span>
                        <span
                            style={
                                icon.name.length > 40 ? "font-size: 12px;" : ""
                            }
                        >
                            {icon.name}
                        </span>
                    </div>
                    <hr style="margin:0" />
                </div>
            );

            // Add click event handler
            // TODO dialog
            RedWarnStore.messageHandler.addMessageHandler(
                "rwRollbackBtn" + elID,
                () => {
                    /* dialogEngine.closeDialog(() => {
                        // close dialog, then
                        rw.rollback.clickHandlers[elID](); // send our callback
                    }); */
                }
            );
        });

        // Now return HTML (rw16)
        return finalIconStr;
    }

    private progressBarElement: MDCLinearProgress | null;
    progressBar(progress: number, buffer: number): void {
        if (!this.progressBarElement) {
            return;
        }

        // Update the progress bar
        this.progressBarElement.progress = progress;
        this.progressBarElement.buffer = buffer;
    }

    showRollbackDoneOps(un: string, warnIndex: number): void {
        // Clear get hidden handler to stop errors in more options menu
        this.getDisabledHTMLandHandlers = () => {
            return [];
        }; // return w empty string

        const clickHandlerFactory = (
            handler: (
                rollback: Rollback,
                username: string,
                warnIndex: number
            ) => any
        ) => () => handler(this, un, warnIndex);

        // Add click handlers

        RollbackDoneIcons.forEach((icon) => {
            $(`#rwRBDoneIcon_${icon.id}`).on(
                "click",
                clickHandlerFactory(icon.action)
            );
        });

        // TODO config
        // Now perform default (if set)
        /*         if (
            rw.config.rwRollbackDoneOption != null ||
            rw.config.rwRollbackDoneOption != "none"
        )
            $(`#${rw.config.rwRollbackDoneOption}`).click(); */

        // Hides other icons and shows the rollback done options and also checks for defaults, also adds click handlers
        $("#rwRollbackInProgress").fadeOut(() => {
            // fade out - looks smoother
            $("#rwRollbackDoneIcons").fadeIn(); //show our icons
        });
    }

    // CONTRIBS PAGE
    static contribsPageIcons(): void {
        // For each (current) tag
        $("span.mw-uctop").each((i, el) => {
            // Add rollback options (${i} inserts i at that point to ensure it is a unique ID)
            /* $(el).html(`current
                    <span id="rw-currentRev${i}" style="cursor:default"> <!-- Wrapper -->
                        <span style="font-family:Roboto;font-weight:400;"> &nbsp; <!-- Styling container -->
                            <!-- Links -->
                            <a style="color:green;cursor:pointer;" id="rw-currentRevPrev${i}" onclick="rw.rollback.contribsPageRollbackPreview(${i});">prev</a> &nbsp;
                            <a style="color:red;cursor:pointer;" id="rw-currentRevRvv${i}" onclick="rw.rollback.contribsPageRollbackVandal(${i});">rvv</a> &nbsp;
                            <a style="color:blue;cursor:pointer;" id="rw-currentRevRb${i}" onclick="rw.rollback.contribsPageRollback(${i});">rb</a>

                            <!-- Tooltips -->
                            <div class="mdl-tooltip" data-mdl-for="rw-currentRevPrev${i}">
                                Preview Rollback
                            </div>
                            <div class="mdl-tooltip" data-mdl-for="rw-currentRevRvv${i}">
                                Quick rollback Vandalism
                            </div>
                            <div class="mdl-tooltip" data-mdl-for="rw-currentRevRb${i}">
                                Rollback
                            </div>
                        </span>
                    </span>
                    `); */
            // TODO i18n

            const previewLink = (
                <a
                    style="color:green;cursor:pointer;"
                    id={`rw-currentRevPrev${i}`}
                    onClick={() => this.contribsPageRollbackPreview(i)}
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
                    onClick={() => this.contribsPageRollbackVandal(i)}
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
                    onClick={() => this.contribsPageRollback(i)}
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

    static contribsPageRollback(i: number): void {
        throw new Error("Method not implemented.");
    }

    static contribsPageRollbackVandal(i: number): void {
        throw new Error("Method not implemented.");
    }

    static contribsPageRollbackPreview(i: number): void {
        throw new Error("Method not implemented.");
    }
}

interface ActionRollback {
    actionType: "rollback";
    promptReason: boolean;
    summary: string;
    ruleIndex?: number;
}

interface ActionFunction {
    actionType: "function";
    action: (rollback: Rollback) => () => any;
}

type RollbackAction = ActionFunction | ActionRollback;

interface RollbackIconBase {
    enabled: boolean;
    name: string;
    color: string;
    icon: string;
}

export type RollbackIcon = RollbackIconBase & RollbackAction;
export const RollbackIcons: RollbackIcon[] = [
    // rev14, icon IDs and everything for current rollback - from left to right - usually loaded from config
    // WARNING: CHANGING ORDER WILL MESS UP CONFIGS.
    // DEFAULT ENABLED ICONS
    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback vandalism",
        color: "red", // css colour
        icon: "delete_forever",
        actionType: "rollback",
        promptReason: false, // add extra info? false = quick rollback, otherwise not
        summary: "[[WP:VANDAL|Vandalism]]", // Set summary
        ruleIndex: 0, // used for autowarn
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback unexplained content removal",
        color: "orange", // css colour
        icon: "format_indent_increase",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:CRV|Unexplained content removal]]", // Set summary
        ruleIndex: 3, // used for autowarn
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback non-constructive edit",
        color: "gold", // css colour
        icon: "work_outline",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "non-constructive", // Set summary
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Rollback",
        color: "blue", // css colour
        icon: "replay",
        actionType: "rollback",
        promptReason: true, // add extra info?
        summary: "", // Set summary
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Assume Good Faith and Rollback",
        color: "green", // css colour
        icon: "thumb_up",
        actionType: "rollback",
        promptReason: true, // add extra info?
        summary: "Reverting [[WP:AGF|good faith]] edits", // Set summary
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Preview Rollback",
        color: "black", // css colour
        icon: "compare_arrows",
        actionType: "function",
        action: (rollback: Rollback) => () => rollback.preview(), // Callback
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Quick Template",
        color: "black", // css colour
        icon: "library_add",
        actionType: "function",
        action: (rollback: Rollback) => () => rollback.welcomeRevUser(), // Callback
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "More Options",
        color: "black", // css colour
        icon: "more_vert",
        actionType: "function",
        action: (rollback: Rollback) => () => rollback.selectFromDisabled(), // Callback
    },

    // END DEFAULT ENABLED ICONS
    // DEFAULT DISABLED ICONS

    // RED
    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback 3RR",
        color: "red", // css colour
        icon: "filter_3",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:3RR]]", // Set summary
        ruleIndex: 84, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback personal attacks towards another editor",
        color: "red", // css colour
        icon: "offline_bolt",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Personal attack towards another editor ([[WP:NPA]])", // Set summary
        ruleIndex: 22, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback copyright violation",
        color: "red", // css colour
        icon: "copyright",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Likely [[WP:COPYVIO|copyright violation]]", // Set summary
        ruleIndex: 79, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback BLP violation",
        color: "red", // css colour
        icon: "face",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Fails [[WP:BLP]]", // Set summary
        ruleIndex: 5, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback advertising/promotional",
        color: "red", // css colour
        icon: "monetization_on",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary:
            "Using Wikipedia for [[WP:NOTADVERTISING|advertising and/or promotion]] is not permitted.", // Set summary
        ruleIndex: 16, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback unnecessary or inappropriate external links",
        color: "red", // css colour
        icon: "link_off",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary:
            "Addition of unnecessary/inappropriate [[WP:EL|external links]]", // Set summary
        ruleIndex: 19, // used for autowarn
    },

    // ORANGE
    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback no reliable source",
        color: "orange", // css colour
        icon: "history_edu",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:RS|Not providing a reliable source]]", // Set summary
        ruleIndex: 15, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback disruptive editing",
        color: "orange", // css colour
        icon: "error",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Disruptive editing", // Set summary
        ruleIndex: 1, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback factual errors",
        color: "orange", // css colour
        icon: "menu_book",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "likely [[WP:PROVEIT|factual errors]]", // Set summary
        ruleIndex: 7, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback joke edit",
        color: "orange", // css colour
        icon: "child_care",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Joke edit", // Set summary
        ruleIndex: 10, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback NPOV issues",
        color: "orange", // css colour
        icon: "campaign",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "per [[WP:NPOV]]", // Set summary
        ruleIndex: 17, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback talk in article",
        color: "orange", // css colour
        icon: "announcement",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary:
            "Please use the article [[WP:TPHELP|talk page]] or [[WP:FIXIT|be bold]] and fix the problem", // Set summary
        ruleIndex: 66, // used for autowarn
    },

    // BLUE
    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback manual of style issues",
        color: "blue", // css colour
        icon: "brush",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:MOS|Manual of Style]] issues", // Set summary
        ruleIndex: 31, // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback test edits",
        color: "blue", // css colour
        icon: "build",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:SANDBOX|test edits]]", // Set summary
        ruleIndex: 2, // used for autowarn
    },
];

export interface RollbackDoneIcon {
    name: string;
    icon: string;
    action: (rollback: Rollback, username: string, warnIndex: number) => any;
    id: string;
}
export const RollbackDoneIcons: RollbackDoneIcon[] = [
    {
        name: "Go to latest revision",
        icon: "watch_later",
        action: (rollback: Rollback): Promise<void> =>
            WikipediaAPI.goToLatestRevision(rollback.rollbackRev.page),
        id: "latestRev",
    },
    {
        name: "New Message",
        icon: "send",
        action: (): void => {
            // TODO new message
            /* rw.ui.newMessage(un) */
        },
        id: "newMsg",
    },
    {
        name: "Quick Template",
        icon: "library_add",
        action: (): void => {
            // TODO quick template
            /* rw.quickTemplate.openSelectPack(un) */
        },
        id: "quickTemplate",
    },
    {
        name: "Warn User",
        icon: "report",
        action: (): void => {
            // TODO auto warn
            /* rw.ui.beginWarn(
                false,
                un,
                mw.config.get("wgRelevantPageName"),
                null,
                null,
                null,
                warnIndex != null ? warnIndex : null
            ) */
        },
        id: "warnUser",
    },
    {
        name: "Report to Admin",
        icon: "gavel",
        action: (): void => {
            // TODO admin report
            /* rw.ui.adminReportSelector(un) */
        },
        id: "reportUser",
    },
];

interface RestoreProps extends BaseProps {
    rollback: Rollback;
    left: boolean;
}

function RestoreElement(props: RestoreProps) {
    return (
        <div>
            <div
                id={`rOld${props.left ? "1" : "2"}`}
                class="icon material-icons"
            >
                <span
                    style="cursor: pointer; font-size:28px; padding-right:5px; color:purple;"
                    onClick={() => {
                        props.rollback.promptRestoreReason(
                            $(
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
                </span>
            </div>
            <div
                class="mdl-tooltip mdl-tooltip--large"
                for={`rOld${props.left ? "1" : "2"}`}
            >
                Restore this version
            </div>
        </div>
    );
}
