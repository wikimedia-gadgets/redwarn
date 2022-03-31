import i18next from "i18next";
import { h } from "tsx-dom";
import { upgradeMaterialDialog } from "app/styles/material/Material";
import MaterialButton from "app/styles/material/ui/components/MaterialButton";
import MaterialReportingDialogPage from "app/styles/material/ui/components//MaterialReportingDialogPage";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "app/styles/material/ui/MaterialDialog";
import {
    RWUIReportingDialog,
    RWUIReportingDialogProps,
} from "app/ui/elements/RWUIReportingDialog";
import toCSS from "app/styles/material/util/toCSS";
import MaterialReportingDialogUser from "./components/MaterialReportingDialogUser";
import {
    isEmailReportVenue,
    isPageReportVenue,
    isUserModeReportVenue,
    ReportVenue,
} from "app/mediawiki/report/ReportVenue";
import { Page, User, UserAccount } from "app/mediawiki";
import MaterialReportingDialogInfo from "app/styles/material/ui/components/MaterialReportingDialogInfo";
import "../css/reportingDialog.css";
import MaterialDialogValidator, {
    ValidationCheck,
} from "app/styles/material/ui/components/MaterialDialogValidator";

export default class MaterialReportingDialog extends RWUIReportingDialog {
    target: User | Page = null;
    reason?: string = null;
    comments?: string = null;

    mrdTarget:
        | ReturnType<typeof MaterialReportingDialogPage>
        | ReturnType<typeof MaterialReportingDialogUser>;
    mrdInfo: ReturnType<typeof MaterialReportingDialogInfo>;
    mrdValidator: ReturnType<typeof MaterialDialogValidator>;
    mrdConfirm: JSX.Element;

    get venue(): ReportVenue {
        return this.props.venue;
    }

    get validationChecks(): ValidationCheck[] {
        return [
            {
                id: "target",
                test: () => this.target != null,
            },
            {
                id: "targetMissing",
                test: () => this.mrdTarget.valid(),
            },
            {
                id: "self",
                test: () =>
                    !isUserModeReportVenue(this.props.venue) ||
                    (this.target instanceof User &&
                        this.target.username !== UserAccount.current.username),
            },
            {
                id: "exists",
                test: () =>
                    !isPageReportVenue(this.props.venue) ||
                    this.props.venue.existCheck == null ||
                    !this.props.venue.page.latestCachedRevision ||
                    this.props.venue.page.latestCachedRevision.content ==
                        null ||
                    new RegExp(
                        this.props.venue.existCheck.source.replace(
                            /\\k<target>/g,
                            (this.target instanceof User
                                ? this.target.username
                                : this.target.title.getPrefixedText()
                            ).replace(/[_ ]/g, "[_ ]")
                        ),
                        this.props.venue.existCheck.flags
                    ).test(this.props.venue.page.latestCachedRevision.content),
            },
            {
                id: "reason",
                test: () =>
                    !isPageReportVenue(this.props.venue) ||
                    (this.reason != null && this.reason.length > 0) ||
                    (this.comments != null && this.comments.length > 0),
            },
            {
                id: "short",
                test: () =>
                    !isEmailReportVenue(this.props.venue) ||
                    (this.comments != null &&
                        this.comments
                            // Strip repeating characters (likely spam).
                            .replace(/([a-z])\1{2,}/gi, "").length > 30),
            },
        ];
    }

    constructor(props: RWUIReportingDialogProps) {
        super(props);

        if (!this.props.title)
            this.props.title = i18next.t("ui:reporting.title", {
                venue: props.venue.name,
            });
    }

    show(): Promise<any> {
        return upgradeMaterialDialog(this, {
            onPostInit: () => {
                if (isPageReportVenue(this.props.venue)) {
                    this.props.venue.page.getLatestRevision().then(() => {
                        this.uiValidate();
                    });
                }
            },
            onClose: (event) => {
                if (event.detail.action === "confirm") {
                    return {
                        target: this.target,
                        reason: this.reason,
                        comments: this.comments,
                        venue: this.props.venue,
                    };
                } else if (event.detail.action === "cancel") {
                    return null;
                }
            },
        }).then((v) => v.wait());
    }

    renderTarget(): JSX.Element {
        if (isUserModeReportVenue(this.props.venue)) {
            return (this.mrdTarget = (
                <MaterialReportingDialogUser
                    reportingDialog={this}
                    originalTarget={this.props.target as User}
                />
            ) as ReturnType<typeof MaterialReportingDialogUser>);
        } else {
            return (this.mrdTarget = (
                <MaterialReportingDialogPage
                    reportingDialog={this}
                    originalTarget={this.props.target as Page}
                />
            ) as ReturnType<typeof MaterialReportingDialogPage>);
        }
    }

    renderInfo(): JSX.Element {
        return (this.mrdInfo = (
            <MaterialReportingDialogInfo reportingDialog={this} />
        ) as ReturnType<typeof MaterialReportingDialogInfo>);
    }

    render(): HTMLDialogElement {
        this.element = (
            <MaterialDialog
                id={this.id}
                surfaceProperties={{
                    class: "rw-mdc-reportingDialog",
                    style: toCSS({ minWidth: "700px" }),
                }}
            >
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent style={toCSS({ width: "100%" })}>
                    {this.venue.notice && (
                        <span class="rw-mdc-reportingDialog--notice">
                            {this.venue.notice}
                        </span>
                    )}
                    {this.renderTarget()}
                    {this.renderInfo()}
                </MaterialDialogContent>
                <MaterialDialogActions>
                    {
                        (this.mrdValidator = (
                            <MaterialDialogValidator
                                validators={this.validationChecks}
                                languageKey={"ui:reporting.validation.fail"}
                                detailedLanguageKey={
                                    "ui:reporting.validation.failDetailed"
                                }
                            />
                        ) as ReturnType<typeof MaterialDialogValidator>)
                    }
                    <MaterialButton dialogAction="cancel">
                        {i18next.t<string>("ui:cancel")}
                    </MaterialButton>
                    {
                        (this.mrdConfirm = (
                            <MaterialButton dialogAction="confirm" raised>
                                {i18next.t<string>("ui:reporting.ok")}
                            </MaterialButton>
                        ))
                    }
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;

        return this.element;
    }

    uiValidate(): void {
        // Race condition might have this function called before the dialog is rendered.
        // In this case, just silently fail.
        if (this.mrdValidator) {
            const validation = this.mrdValidator.validator.update();
            this.mrdConfirm.toggleAttribute("disabled", validation !== true);
        }
    }
}
