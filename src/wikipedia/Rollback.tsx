import { linearProgress } from "material-components-web";
import { BaseProps, h as TSX } from "tsx-dom";
import RedWarnStore from "../data/RedWarnStore";
import redirect from "../util/redirect";
import WikipediaAPI from "./API";

export default class Rollback {
    static getRollbackRevId(): string {
        const isNLatest = $("#mw-diff-ntitle1")
            .text()
            .includes("Latest revision");
        const isOLatest = $("#mw-diff-otitle1")
            .text()
            .includes("Latest revision");
        if (isNLatest) {
            // Return the revID of the edit on the right
            return $("#mw-diff-ntitle1 > strong > a")
                .attr("href")
                .split("&")[1]
                .split("=")[1];
        } else if (isOLatest) {
            return $("#mw-diff-otitle1 > strong > a")
                .attr("href")
                .split("&")[1]
                .split("=")[1];
        } else {
            // BUG!
            // TODO dialog
            /* rw.ui.confirmDialog(
                "A very weird error occurred. (rollback getRollbackRevID failed via final else!)",
                "REPORT BUG",
                () =>
                    rw.ui.reportBug(
                        "rollback getRollbackRevID failed via final else! related URL: " +
                            window.location.href
                    ),
                "",
                () => {},
                0
            ); */
        }
    }

    static async preview(): Promise<void> {
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
        const un = await WikipediaAPI.isLatestRevision(
            mw.config.get("wgRelevantPageName"),
            this.getRollbackRevId()
        );
        const { revid } = await WikipediaAPI.latestRevisionNotByUser(
            mw.config.get("wgRelevantPageName"),
            un
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

    static async loadIcons(): Promise<void> {
        // Check if page is editable, if not, don't show
        if (!mw.config.get("wgIsProbablyEditable")) {
            // Can't edit, so exit
            return;
        }

        // else, continue :)

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
                clickHandler = icon.action;
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
                const elem = (
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
                );
                currentRevIcons.appendChild(elem);
                currentRevIcons.appendChild(iconElem);
            }
        });

        currentRevIcons = (
            <div>
                {currentRevIcons}
                <span id="rwRollbackInProgress" style="display:none;">
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
                    <div style="height:5px"></div>
                    {/* <!-- spacer --> */}
                    <span style="font-family: Roboto;font-size: 16px;">
                        Reverting...
                    </span>
                    <br />
                    <div style="height:5px"></div>
                    {/* <!-- spacer --> */}
                </span>
                {/* <!-- Rollback complete icons --> */}
                <span id="rwRollbackDoneIcons" style="display:none;">
                    {/* <!-- Done indicator --> */}
                    <div style="height:5px"></div>
                    {/* <!-- spacer --> */}
                    <span style="font-family: Roboto;font-size: 16px;display: inline-flex;vertical-align: middle;">
                        <span
                            class="material-icons"
                            style="color:green;cursor:default;"
                        >
                            check_circle
                        </span>
                        &nbsp;&nbsp; Rollback complete
                    </span>
                    <br />
                    <div style="height:5px"></div>
                    {/* <!-- spacer --> */}
                    {/* <!-- CONTROL ICONS - todo add onclick events --> */}
                    <div id="RWRBDONEmrevPg" class="icon material-icons">
                        <span style="cursor: pointer;">watch_later</span>
                    </div>
                    <div
                        class="mdl-tooltip mdl-tooltip--large"
                        for="RWRBDONEmrevPg"
                    >
                        Go to latest revision
                    </div>
                    &nbsp;&nbsp;
                    <div id="RWRBDONEnewUsrMsg" class="icon material-icons">
                        <span style="cursor: pointer;">send</span>
                    </div>
                    <div
                        class="mdl-tooltip mdl-tooltip--large"
                        for="RWRBDONEnewUsrMsg"
                    >
                        New Message
                    </div>
                    &nbsp;&nbsp;
                    <div id="RWRBDONEwelcomeUsr" class="icon material-icons">
                        <span style="cursor: pointer;">library_add</span>
                    </div>
                    <div
                        class="mdl-tooltip mdl-tooltip--large"
                        for="RWRBDONEwelcomeUsr"
                    >
                        Quick Template
                    </div>
                    &nbsp;&nbsp;
                    <div id="RWRBDONEwarnUsr" class="icon material-icons">
                        <span style="cursor: pointer;">report</span>
                    </div>
                    <div
                        class="mdl-tooltip mdl-tooltip--large"
                        for="RWRBDONEwarnUsr"
                    >
                        Warn User
                    </div>
                    &nbsp;&nbsp;
                    <div id="RWRBDONEreportUsr" class="icon material-icons">
                        <span style="cursor: pointer;">gavel</span>
                    </div>
                    <div
                        class="mdl-tooltip mdl-tooltip--large"
                        for="RWRBDONEreportUsr"
                    >
                        Report to Admin
                    </div>
                </span>
            </div>
        );

        // idk why eslint decides to die for me
        // eslint-disable-next-line quotes
        const twinkleLoadedBeforeUs = $('div[id^="tw-revert"]').length > 0;

        const left = isLeftLatest ? (
            currentRevIcons
        ) : (
            <RestoreElement left={true} />
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
            <RestoreElement left={false} />
        ); // if the latest rev, show the accurate revs, else, don't
        if (twinkleLoadedBeforeUs) {
            // eslint-disable-next-line quotes
            $('.diff-ntitle > div[id^="tw-revert"]').after(right);
        } else {
            $(".diff-ntitle").prepend(right);
        }

        // TODO visuals
        /* setTimeout(()=>{
            // Register all tooltips after 50ms (just some processing time)
            for (const item of document.getElementsByClassName("mdl-tooltip")) {
                rw.visuals.register(item);
            }

            // Register progressbar
            rw.visuals.register($("#rwRollbackInProgressBar")[0]);
        },100); */
    }

    static async rollback(
        reason: string,
        defaultWarnIndex: number
    ): Promise<void> {
        // Show progress bar
        $("#rwCurrentRevRollbackBtns").hide();
        $("#rwRollbackInProgress").show();
    }

    static getDisabledHTMLandHandlers(): HTMLElement[] {
        // Open a new dialog with all the disabled icons so user can select one. Click handlers are already registered, so we just call rw.rollback.clickHandlers.[elID]();
        // Load Rollback current rev icons (rev14)
        const finalIconStr: HTMLElement[] = [];
        RollbackIcons.forEach((icon, i) => {
            if (icon.enabled) return; // if icon is enabled, we can skip
            if (icon.name == "More Options") return; // does nothing here, so not needed

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

    private static progressBarElement = new linearProgress.MDCLinearProgress(
        $("#rwRollbackInProgressBar")[0]
    );
    static progressBar(progress: number, buffer: number): void {
        if ($("#rwRollbackInProgressBar").length < 1) return;

        // Update the progress bar
        this.progressBarElement.progress = progress;
        this.progressBarElement.buffer = buffer;
    }

    static showRollbackDoneOps(un: string, warnIndex: number): void {
        // Clear get hidden handler to stop errors in more options menu
        this.getDisabledHTMLandHandlers = () => {
            return [];
        }; // return w empty string
        // Add click handlers
        $("#RWRBDONEmrevPg").click(() =>
            WikipediaAPI.isLatestRevision(
                mw.config.get("wgRelevantPageName"),
                0,
                () => {}
            )
        ); // go to latest revision
        $("#RWRBDONEnewUsrMsg").click(() => rw.ui.newMsg(un)); // send message
        $("#RWRBDONEwelcomeUsr").click(() => {
            // TODO quick template
            /* rw.quickTemplate.openSelectPack(un) */
        }); // quick template
        $("#RWRBDONEwarnUsr").click(() =>
            rw.ui.beginWarn(
                false,
                un,
                mw.config.get("wgRelevantPageName"),
                null,
                null,
                null,
                warnIndex != null ? warnIndex : null
            )
        ); // Warn User
        $("#RWRBDONEreportUsr").click(() => rw.ui.adminReportSelector(un)); // report to admin

        // Now perform default (if set)
        if (
            rw.config.rwRollbackDoneOption != null ||
            rw.config.rwRollbackDoneOption != "none"
        )
            $(`#${rw.config.rwRollbackDoneOption}`).click();

        // Hides other icons and shows the rollback done options and also checks for defaults, also adds click handlers
        $("#rwRollbackInProgress").fadeOut(() => {
            // fade out - looks smoother
            $("#rwRollbackDoneIcons").fadeIn(); //show our icons
        });
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
    action: () => void;
}

type RollbackAction = ActionFunction | ActionRollback;

interface RollbackIconBase {
    enabled: boolean;
    name: string;
    color: string;
    icon: string;
}

interface RestoreProps extends BaseProps {
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
                        Rollback.promptRestoreReason(
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
        action: () => Rollback.preview(), // Callback
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Quick Template",
        color: "black", // css colour
        icon: "library_add",
        actionType: "function",
        action: () => Rollback.welcomeRevUser(), // Callback
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "More Options",
        color: "black", // css colour
        icon: "more_vert",
        actionType: "function",
        action: () => Rollback.selectFromDisabled(), // Callback
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
