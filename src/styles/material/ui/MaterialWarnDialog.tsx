import "../css/warnDialog.css";

import { h } from "tsx-dom";
import { RWUIWarnDialog } from "rww/ui/elements/RWUIDialog";
import {
    registerMaterialDialog,
    upgradeMaterialDialog,
} from "rww/styles/material/Material";
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
import i18next from "i18next";
import MaterialWarnDialogReason, {
    MaterialWarnDialogReasonController,
} from "rww/styles/material/ui/components/MaterialWarnDialogReason";
import type { User } from "rww/mediawiki";
import { MediaWikiAPI } from "rww/mediawiki";
import { warningSuffix } from "rww/util";
import { RW_SIGNATURE } from "rww/data/RedWarnConstants";

export default class MaterialWarnDialog extends RWUIWarnDialog {
    user: User;
    private _helperText: JSX.Element;
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
        if (!this.mwdReason?.MWDReason) return null;

        // Don't worry about transclusion: The entire script output is nowiki'd.
        return `{{subst:${
            this.mwdReason.MWDReason.warning.template
        }${warningSuffix(this.mwdReason.MWDReason.warningLevel)}${
            this.mwdReason.MWDReason.relatedPage &&
            `|${this.mwdReason.MWDReason.relatedPage}`
        }${
            this.mwdReason.MWDReason.additionalText &&
            `${this.mwdReason.MWDReason.relatedPage ? "|" : "||"}''${
                this.mwdReason.MWDReason.additionalText
            }''`
        }}} ${RW_SIGNATURE}`;
    }

    private lastUpdateCall: number;
    async updatePreview(): Promise<void> {
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
            title: this.user.talkPage.title,
            text: warningText,
            contentmodel: "wikitext",
            prop: "text",
            pst: true,
            assert: "user",
            disablelimitreport: true,
        });

        if (+this.mwdXray.getAttribute("data-last-update") > requestTime) {
            return; // Give up. We're late.
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // const previewHTML = require("../plain/mediawikiPreview.html.txt")
        //     .replace(/--wikiUrl/g, RedWarnStore.wikiBase)
        //     .replace(/--content/g, parseRequest?.["parse"]?.["text"] ?? "<b>Parsing failed.</b>");
        const previewHTML =
            parseRequest?.["parse"]?.["text"]?.["*"] ??
            parseRequest?.["parse"]?.["text"] ??
            "<b>Parsing failed.</b>";

        this.mwdXray.querySelector(
            ".rw-mdc-warnDialog-xray--content"
        ).innerHTML = previewHTML;

        this.mwdXray.querySelectorAll("a").forEach((anchor) => {
            anchor.target = "_blank";
        });

        this.mwdXray.setAttribute("data-last-update", `${requestTime}`);
    }

    show(): Promise<any> {
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
                        this._result = this.warningText;
                    }

                    const res = styleStorage.dialogTracker.get(this.id).result;
                    styleStorage.dialogTracker.delete(this.id);
                    resolve(res);
                }
            );
        });
    }

    render(): HTMLDialogElement {
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
                            <div class={"rw-mdc-warnDialog-helperText"} />
                        ))}

                    <MaterialButton dialogAction="cancel">
                        {i18next.t<string>("ui:okCancel.cancel")}
                    </MaterialButton>

                    <MaterialButton dialogAction="confirm">
                        {i18next.t<string>("ui:warn.ok")}
                    </MaterialButton>
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;
        return this.element;
    }
}

export interface MaterialWarnDialogChildProps {
    warnDialog: MaterialWarnDialog;
}
