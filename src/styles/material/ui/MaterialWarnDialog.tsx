import { h } from "tsx-dom";
import i18next from "i18next";
import { RWUIWarnDialog } from "rww/ui/elements/RWUIWarnDialog";
import { upgradeMaterialDialog } from "rww/styles/material/Material";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle
} from "./MaterialDialog";
import MaterialWarnDialogUser, {
    MaterialWarnDialogUserController
} from "./components/MaterialWarnDialogUser";
import MaterialWarnDialogReason, {
    MaterialWarnDialogReasonController
} from "rww/styles/material/ui/components/MaterialWarnDialogReason";
import {
    ClientUser,
    MediaWikiAPI,
    User,
    WarningOptions,
    WarningType
} from "rww/mediawiki";
import { isIPAddress, normalize } from "rww/util";

import { RW_SIGNATURE } from "rww/data/RedWarnConstants";

import "../css/warnDialog.css";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import { warningSuffix } from "rww/mediawiki/warn/WarningUtils";
import toCSS from "rww/styles/material/util/toCSS";
import MaterialDialogValidator, {
    ValidationCheck
} from "./components/MaterialDialogValidator";

/**
 * A specific test performed to validate the values of a {@link MaterialWarnDialog}.
 */
interface MaterialWarnDialogValidationTest {
    /** The name of this condition. */
    id: string;
    /**
     * Whether or not this specific validation test passes.
     *
     * If the test fails, the condition should be false.
     */
    condition: boolean;
}

/**
 * Displays the content of a MaterialWarnDialog error popup.
 * @param props Properties of the error dialog.
 * @constructor
 */
function MaterialWarnDialogErrors(props: {
    tests: true | MaterialWarnDialogValidationTest[];
}): JSX.Element {
    if (props.tests === true)
        return <div>{i18next.t<string>("ui:warn.validation.pass")}</div>;

    // Get the failing tests with their test IDs.
    const failingIds = props.tests.map((v) => v.id);

    return (
        <div>
            {i18next
                .t("ui:warn.validation.validationDialogIntro", {
                    count: failingIds.length
                })
                .toString()}
            <ul>
                {failingIds.reduce((items: JSX.Element[], id: string) => {
                    items.push(
                        <li>
                            {i18next
                                .t("ui:warn.validation.failDetailed", {
                                    context: id
                                })
                                .toString()}
                        </li>
                    );
                    return items;
                }, [])}
            </ul>
        </div>
    );
}

export default class MaterialWarnDialog extends RWUIWarnDialog {
    /** The target user of the warning. */
    user: User;

    /** Additional text at the bottom of the dialog. */
    private _helperText: JSX.Element;
    /** Get the additional text at the bottom of the dialog. */
    get helperText(): string {
        return this._helperText?.innerText ?? null;
    }
    /** Set the additional text at the bottom of the dialog. */
    set helperText(value: string) {
        if (this._helperText) this._helperText.innerText = value;
    }
    /** Get the color of the additional text at the bottom of the dialog. */
    get helperTextColor(): string {
        return this._helperText?.style?.color ?? "black";
    }
    /** Set the color of the additional text at the bottom of the dialog. */
    set helperTextColor(value: string) {
        if (this._helperText) this._helperText.style.color = value;
    }

    get validationChecks(): ValidationCheck[] {
        return [
            {
                // Prevent self-warning
                id: "self",
                test: () => this.user?.username !== ClientUser.i.username
            },
            {
                // Asserts user
                id: "user",
                test: () => this.user != null
            },
            {
                // Asserts warning template
                id: "template",
                test: () => this.mwdReason?.MWDReason?.warning != null
            },
            {
                // Asserts warning level is set (given it is a tiered warning)
                id: "level",
                test: () =>
                    (this.mwdReason?.MWDReason?.warning != null &&
                        this.mwdReason?.MWDReason?.warning.type !=
                            WarningType.Tiered) ||
                    this.mwdReason?.MWDReason?.warningLevel != null
            }
        ];
    }

    /** Additional text at the bottom of the dialog. */
    private dialogConfirmButton: JSX.Element;
    /** The MaterialWarnDialogUser component for this dialog. */
    mwdUser: JSX.Element & {
        MWDUser: MaterialWarnDialogUserController;
    };
    /** The MaterialWarnDialogReason component for this dialog. */
    mwdReason: JSX.Element & {
        MWDReason: MaterialWarnDialogReasonController;
    };
    /** The MaterialWarnDialog preview panel for this dialog. */
    private mwdXray: JSX.Element;
    /** The MaterialWarnDialog errors button for this dialog. */
    private mwdErrors: ReturnType<typeof MaterialDialogValidator>;

    /**
     * Get the warning as wikitext.
     */
    get warningWikitext(): string {
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
            this.mwdReason.MWDReason.relatedPage
                ? `|${normalize(this.mwdReason.MWDReason.relatedPage)}`
                : ""
        }${
            this.mwdReason.MWDReason.additionalText
                ? `${this.mwdReason.MWDReason.relatedPage ? "|" : "||"}''${
                      this.mwdReason.MWDReason.additionalText
                  }''`
                : ""
        }}} ${RW_SIGNATURE}${
            isIPAddress(this.mwdUser.MWDUser.user.username) &&
            RedWarnWikiConfiguration.c.warnings?.ipAdvice != null
                ? RedWarnWikiConfiguration.c.warnings.ipAdvice
                : ""
        }`;
    }

    /** The timestamp at which the preview was last updated.  */
    private lastUpdateCall: number;
    /** Updates the preview (x-ray) panel of the dialog. */
    async updatePreview(): Promise<void> {
        // Makes a request to update the preview section
        if (Date.now() - this.lastUpdateCall < 1000) return;

        this.lastUpdateCall = Date.now();
        const warningText = this.warningWikitext;
        if (warningText == null)
            // Not yet ready.
            return;

        // Show loading overlay.
        this.mwdXray.classList.toggle("rw-mdc-warnDialog-xray--loading", true);

        // Make the request
        const requestTime = Date.now();
        const parseRequest = await MediaWikiAPI.post({
            action: "parse",
            format: "json",
            title: this.user?.talkPage?.title?.toString() ?? "Example",
            text: warningText,
            contentmodel: "wikitext",
            prop: "text",
            pst: true,
            assert: "user",
            disablelimitreport: true
        });

        if (+this.mwdXray.getAttribute("data-last-update") > requestTime)
            // Give up if the request took too long.
            return;

        // Disable the loading overlay.
        this.mwdXray.classList.toggle("rw-mdc-warnDialog-xray--loading", false);
        this.mwdXray.querySelector(
            ".rw-mdc-warnDialog-xray--content"
        ).innerHTML =
            parseRequest?.["parse"]?.["text"]?.["*"] ??
            parseRequest?.["parse"]?.["text"] ??
            // Fallback
            `<b>${i18next.t("misc:parser.wikiTxtParseError")}</b>`;

        this.mwdXray.querySelectorAll("a").forEach((anchor) => {
            anchor.target = "_blank";
        });

        this.mwdXray.setAttribute("data-last-update", `${requestTime}`);
        this.uiValidate();
    }

    /**
     * Contrary to {@link MaterialWarnDialog.validate}, this will update
     * the UI parts as well.
     */
    uiValidate(): void {
        const checks = this.mwdErrors.validator.update();
        this.dialogConfirmButton.toggleAttribute("disabled", checks !== true);
    }

    /**
     * Shows the dialog.
     */
    show(): Promise<WarningOptions> {
        return upgradeMaterialDialog(this, {
            onPostInit: (dialog) => {
                dialog.autoStackButtons = false;

                // Automatically grab user information if we're already on a user talk page.
                if (this.user == null && mw.config.get("wgRelevantUserName")) {
                    this.mwdUser.MWDUser.updateUser(
                        User.fromUsername(mw.config.get("wgRelevantUserName"))
                    );
                    this.uiValidate();
                }
            },
            onClose: async (event) => {
                if (event.detail.action === "confirm") {
                    return {
                        warningText: this.warningWikitext,
                        targetUser: this.user,
                        additionalText: this.mwdReason.MWDReason.additionalText,
                        relatedPage: this.mwdReason.MWDReason.relatedPage,
                        warnLevel: this.mwdReason.MWDReason.warningLevel,
                        warning: this.mwdReason.MWDReason.warning
                    };
                } else return null;
            }
        }).then((v) => v.wait());
    }

    /**
     * Renders the dialog body. This does NOT show the dialog to the user.
     */
    render(): HTMLDialogElement {
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "class": "rw-mdc-warnDialog mdc-dialog__surface",
                    "style": {
                        width: this.props.width ?? "50vw",
                        height: "95vh"
                    },
                    "aria-modal": true,
                    "aria-labelledby":
                        this.props.title ?? i18next.t<string>("ui:warn.title")
                }}
                id={this.id}
            >
                <MaterialDialogTitle tabIndex={0}>
                    <span style={{ float: "left" }}>
                        {this.props.title ?? i18next.t<string>("ui:warn.title")}
                    </span>
                </MaterialDialogTitle>
                <br />
                <MaterialDialogContent
                    style={toCSS({
                        overflowY: "auto",
                        overflowX: "hidden"
                    })}
                >
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
                    {this.mwdErrors ??
                        (this.mwdErrors = (
                            <MaterialDialogValidator
                                languageKey={"ui:warn.validation.fail"}
                                detailedLanguageKey={
                                    "ui:warn.validation.failDetailed"
                                }
                                validators={this.validationChecks}
                            />
                        ) as ReturnType<typeof MaterialDialogValidator>)}
                    <MaterialButton dialogAction="cancel">
                        {i18next.t<string>("ui:cancel")}
                    </MaterialButton>
                    {
                        (this.dialogConfirmButton = (
                            <MaterialButton
                                dialogAction="confirm"
                                action
                                raised
                                disabled
                            >
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

/**
 * Properties passed onto MaterialWarnDialog components.
 */
export interface MaterialWarnDialogChildProps {
    warnDialog: MaterialWarnDialog;
}