/**
 * Warn User dialog
 * See also:
 * css/warnDialog.css
 * MaterialWarnDialogReason.tsx
 * ./src/ui/elements/RWUIDialog
 */

import "../css/warnDialog.css"; // Specific themes for this dialog

// TSX
import { h } from "tsx-dom";

// Standard dialog components
import {
    RWUIWarnDialog,
    RWUIWarnDialogResult,
} from "rww/ui/elements/RWUIDialog";

// To actually create this dialog
import {
    registerMaterialDialog,
    upgradeMaterialDialog,
} from "rww/styles/material/Material";

// Material UI stuff
import { getMaterialStorage } from "rww/styles/material/data/MaterialStyleStorage";

import MaterialButton from "./components/MaterialButton";

import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";

import MaterialWarnDialogUser, {
    MaterialWarnDialogUserController,
} from "./components/MaterialWarnDialogUser";

// Localisation
import i18next from "i18next";

// Warning reasons list
import MaterialWarnDialogReason, {
    MaterialWarnDialogReasonController,
} from "rww/styles/material/ui/components/MaterialWarnDialogReason";

// MediaWiki hooks
import { ClientUser, MediaWikiAPI, User, WarningType } from "rww/mediawiki";

// RWW Utilities
import { normalize, warningSuffix } from "rww/util";

import { RW_SIGNATURE } from "rww/data/RedWarnConstants"; // typically "~~~~"

// Actual code
export default class MaterialWarnDialog extends RWUIWarnDialog {
    user: User;

    private _helperText: JSX.Element;
    private dialogConfirmButton: JSX.Element;
    get helperText(): string {
        return this._helperText?.innerText ?? null;
    }
    set helperText(value: string) {
        if (this._helperText) this._helperText.innerText = value;
    }
    get helperTextColor(): string {
        return this._helperText?.style?.color ?? "black";
    }
    set helperTextColor(value: string) {
        if (this._helperText) this._helperText.style.color = value;
    }

    private mwdUser: JSX.Element & {
        MWDUser: MaterialWarnDialogUserController;
    };
    private mwdReason: JSX.Element & {
        MWDReason: MaterialWarnDialogReasonController;
    };
    private mwdXray: JSX.Element;

    get warningText(): string {
        if (
            !this.mwdReason?.MWDReason?.warning?.template ||
            (!this.mwdReason?.MWDReason?.warningLevel &&
                this.mwdReason?.MWDReason?.warning?.type === WarningType.Tiered)
        )
            return null;

        // Don't worry about transclusion: The entire script output is nowiki'd.
        return `{{subst:${
            this.mwdReason.MWDReason.warning.template
        }${warningSuffix(this.mwdReason.MWDReason.warningLevel)}${
            this.mwdReason.MWDReason.relatedPage &&
            `|${normalize(this.mwdReason.MWDReason.relatedPage)}`
        }${
            this.mwdReason.MWDReason.additionalText &&
            `${this.mwdReason.MWDReason.relatedPage ? "|" : "||"}''${
                this.mwdReason.MWDReason.additionalText
            }''`
        }}} ${RW_SIGNATURE}`;
    }

    private lastUpdateCall: number;
    async updatePreview(): Promise<void> {
        // Makes a request to update the preview section
        if (Date.now() - this.lastUpdateCall < 1000) return;

        this.lastUpdateCall = Date.now();
        const warningText = this.warningText;
        if (warningText == null)
            // Not yet ready.
            return;

        const requestTime = Date.now();
        const parseRequest = await MediaWikiAPI.post({
            action: "parse",
            format: "json",
            title: this.user?.talkPage?.title ?? "Example",
            text: warningText,
            contentmodel: "wikitext",
            prop: "text",
            pst: true,
            assert: "user",
            disablelimitreport: true,
        });

        if (+this.mwdXray.getAttribute("data-last-update") > requestTime) {
            // if it takes too long skip
            return; // Give up. We're late.
        }

        this.mwdXray.querySelector(
            ".rw-mdc-warnDialog-xray--content"
        ).innerHTML =
            parseRequest?.["parse"]?.["text"]?.["*"] ??
            parseRequest?.["parse"]?.["text"] ??
            "<b>Sorry, we couldn't decode this WikiText. Check it for syntax errors and try again.</b>"; // if the top two options fail, show this error message - needs localisation!

        this.mwdXray.querySelectorAll("a").forEach((anchor) => {
            anchor.target = "_blank";
        });

        this.mwdXray.setAttribute("data-last-update", `${requestTime}`);
        this.uiValidate();
    }

    validate(): true | string {
        // Validates the content of a warning dialog - needs localisation!
        if (this.mwdReason?.MWDReason?.warning == null)
            return "No warning template selected.";
        if (this.mwdReason?.MWDReason?.warningLevel == null)
            return "No warning level selected.";
        if (this.user == null) return "No user selected.";
        if (this.user?.username === ClientUser.i.username)
            return "Self-warnings are not allowed.";
        return true;
    }

    show(): Promise<RWUIWarnDialogResult> {
        // open the dialog
        const styleStorage = getMaterialStorage();
        registerMaterialDialog(this);
        const dialog = upgradeMaterialDialog(
            this,
            new Map([["autoStackButtons", false]])
        );

        return new Promise((resolve) => {
            dialog.listen(
                "MDCDialog:closed",
                async (event: Event & { detail: { action: string } }) => {
                    if (event.detail.action === "cancel") this._result = null;
                    else {
                        this._result = {
                            warningText: this.warningText,
                            targetUser: this.user,
                            additionalText: this.mwdReason.MWDReason
                                .additionalText,
                            relatedPage: this.mwdReason.MWDReason.relatedPage,
                            warnLevel: this.mwdReason.MWDReason.warningLevel,
                            warning: this.mwdReason.MWDReason.warning,
                        };
                    }

                    styleStorage.dialogTracker.delete(this.id);
                    resolve(this._result);
                }
            );
        });
    }

    /**
     * Contrary to {@link MaterialWarnDialog.validate}, this will update
     * the UI parts as well.
     */
    uiValidate(): void {
        const issues = this.validate();
        this.helperText = issues === true ? "" : issues;
        this.helperTextColor = "#f44336"; // Material Red 500
        this.dialogConfirmButton.toggleAttribute("disabled", issues !== true);
    }

    render(): HTMLDialogElement {
        // ACTUAL UI APPEARENCE CODE STARS HERE - needs localisation
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "class": "rw-mdc-warnDialog mdc-dialog__surface",
                    "style": {
                        width: this.props.width ?? "50vw",
                        height: "95vh",
                    },
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog",
                }}
                id={this.id}
            >
                <MaterialDialogTitle
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "200",
                        fontSize: "45px",
                        lineHeight: "48px",
                        borderStyle: "none",
                        marginTop: "4vh",
                    }}
                    tabIndex={0}
                >
                    <span style={{ float: "left" }}>
                        {this.props.title ?? "Warn User"}
                    </span>
                </MaterialDialogTitle>
                <MaterialDialogContent
                    style={{
                        height: "400px",
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    <hr style={{ margin: "0" }} />
                    {this.mwdUser ??
                        (this.mwdUser = (
                            <MaterialWarnDialogUser
                                warnDialog={this}
                                originalUser={this.props.targetUser}
                            />
                        ) as JSX.Element & {
                            MWDUser: MaterialWarnDialogUserController;
                        })}
                    {this.mwdReason ??
                        (this.mwdReason = (
                            <MaterialWarnDialogReason
                                warnDialog={this}
                                defaultReason={this.props.defaultWarnReason}
                                defaultLevel={this.props.defaultWarnLevel}
                                relatedPage={this.props.relatedPage}
                            />
                        ) as JSX.Element & {
                            MWDReason: MaterialWarnDialogReasonController;
                        })}
                    {this.mwdXray ??
                        (this.mwdXray = (
                            <fieldset class={"rw-mdc-warnDialog-xray"}>
                                <legend>Preview</legend>
                                <div
                                    class={"rw-mdc-warnDialog-xray--content"}
                                />
                            </fieldset>
                        ))}
                </MaterialDialogContent>
                <MaterialDialogActions>
                    {this._helperText ??
                        (this._helperText = (
                            <div class={"rw-mdc-dialog-helperText"} />
                        ))}

                    <MaterialButton dialogAction="cancel">
                        {i18next.t<string>("ui:okCancel.cancel")}
                    </MaterialButton>

                    {
                        (this.dialogConfirmButton = (
                            <MaterialButton dialogAction="confirm" disabled>
                                {i18next.t<string>("ui:warn.ok")}
                            </MaterialButton>
                        ))
                    }
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;
        this.uiValidate();
        return this.element;
    }
}

export interface MaterialWarnDialogChildProps {
    warnDialog: MaterialWarnDialog;
}
