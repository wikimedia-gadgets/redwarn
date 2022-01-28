import { RWUIProtectionRequestDialog } from "rww/ui/elements/RWUIProtectionRequestDialog";
import ProtectionRequest, {
    ProtectionDuration
} from "rww/mediawiki/protection/ProtectionRequest";
import { upgradeMaterialDialog } from "rww/styles/material/Material";
import RedWarnStore from "rww/data/RedWarnStore";
import { Page, ProtectionLevel } from "rww/mediawiki";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle
} from "rww/styles/material/ui/MaterialDialog";
import { h } from "tsx-dom";
import i18next from "i18next";
import MaterialButton from "rww/styles/material/ui/components/MaterialButton";
import toCSS from "rww/styles/material/util/toCSS";
import MaterialRadioField, {
    MaterialRadioFieldElement,
    MaterialRadioFieldProps
} from "rww/styles/material/ui/components/MaterialRadioField";
import "../css/protectionRequestDialog.css";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import { capitalize } from "rww/util";
import MaterialProtectionRequestDialogPage from "rww/styles/material/ui/components/MaterialProtectionRequestDialogPage";
import ProtectionEntry from "rww/mediawiki/protection/ProtectionEntry";
import MaterialTextInput, {
    MaterialTextInputComponents,
    MaterialTextInputUpgrade
} from "rww/styles/material/ui/components/MaterialTextInput";
import MaterialSelect, {
    MaterialSelectElement,
    MaterialSelectItem
} from "rww/styles/material/ui/components/MaterialSelect";
import { MaterialRadioProps } from "rww/styles/material/ui/components/MaterialRadio";
import MaterialIcon from "./components/MaterialIcon";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";
import RedWarnUI from "rww/ui/RedWarnUI";

/**
 * A specific test performed to validate the values of a {@link MaterialProtectionRequestDialog}.
 */
interface MaterialProtectionRequestDialogValidationTest {
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
function MaterialProtectionRequestDialogErrors(props: {
    tests: true | MaterialProtectionRequestDialogValidationTest[];
}): JSX.Element {
    if (props.tests === true)
        return (
            <div>
                {i18next.t<string>("ui:protectionRequest.validation.pass")}
            </div>
        );

    // Get the failing tests with their test IDs.
    const failingIds = props.tests.map((v) => v.id);

    return (
        <div>
            {i18next
                .t("ui:protectionRequest.validation.validationDialogIntro", {
                    count: failingIds.length
                })
                .toString()}
            <ul>
                {failingIds.reduce((items: JSX.Element[], id: string) => {
                    items.push(
                        <li>
                            {i18next
                                .t(
                                    "ui:protectionRequest.validation.failDetailed",
                                    {
                                        context: id
                                    }
                                )
                                .toString()}
                        </li>
                    );
                    return items;
                }, [])}
            </ul>
        </div>
    );
}

export default class MaterialProtectionRequestDialog extends RWUIProtectionRequestDialog {
    page: Page = RedWarnStore.currentPage;

    _protectionReasons: Record<string, any>;
    set protectionReasons(reasons: Record<string, string[]>) {
        this._protectionReasons = reasons;

        if (this.elementSet.reason) {
            const reasonDropdown = this.renderReasonDropdown();
            this.elementSet.reason.parentElement.replaceChild(
                reasonDropdown,
                this.elementSet.reason
            );
            this.elementSet.reason = reasonDropdown;
        }

        this.uiValidate();
    }

    _protectionInformation: ProtectionEntry[];
    get protectionInformation(): ProtectionEntry[] {
        return this._protectionInformation;
    }
    set protectionInformation(value: ProtectionEntry[]) {
        if (value == null && this.elementSet.duration) {
            this.elementSet.duration.disable();
        } else if (this.elementSet.duration) {
            this.elementSet.duration.enable();
        }

        if (value == null && this.elementSet.levels != null) {
            this.elementSet.levels.disable();
        } else if (this.elementSet.levels != null) {
            this.elementSet.levels.enable();

            // Automatically select and disable the original value.
            if ((value?.length ?? 0) > 0) {
                for (const entry of value) {
                    if (
                        (entry.type === "edit" && entry.source == null) ||
                        entry.type === "_flaggedrevs"
                    ) {
                        for (const radio of this.elementSet.levels.MDCRadios) {
                            if (radio.radioValue.id === entry.level) {
                                radio.MDCRadio.checked = true;
                                this._level = radio.radioValue;
                            }
                        }
                        for (const radio of this.elementSet.duration
                            .MDCRadios) {
                            if (
                                (entry.expiry === "infinity") ==
                                radio.radioValue
                            ) {
                                radio.MDCRadio.checked = true;
                                radio.MDCRadio.disabled = true;
                            } else {
                                radio.MDCRadio.disabled = false;
                            }
                        }
                    }
                }
            } else {
                // No protection.
                for (const radio of this.elementSet.levels.MDCRadios) {
                    if (radio.radioValue.id === null) {
                        radio.MDCRadio.checked = true;
                    }
                }
                this.elementSet.duration.reset();
                this.elementSet.duration.disable();
            }
        }

        this._protectionInformation = value;
    }

    private _level: ProtectionLevel;
    get level(): ProtectionLevel {
        return this._level;
    }
    get reason(): string {
        return this.elementSet.reason?.valueSet[
            this.elementSet.reason.MDCSelect.value
        ];
    }
    private _duration: ProtectionDuration;
    get duration(): ProtectionDuration {
        return this._duration;
    }
    get additionalInformation(): string {
        return this.elementSet.additionalInformation?.components?.textField
            ?.value;
    }

    get helperText(): string {
        return this.elementSet.errorText.innerText;
    }
    set helperText(text: string) {
        this.elementSet.errorText.innerText = text;
    }

    elementSet: Partial<{
        dialogConfirmButton: JSX.Element;
        levels: MaterialRadioFieldElement<ProtectionLevel>;
        titleSelect: ReturnType<typeof MaterialProtectionRequestDialogPage>;
        reason: MaterialSelectElement<string>;
        additionalInformation: {
            element: JSX.Element;
            components: MaterialTextInputComponents;
        };
        duration: MaterialRadioFieldElement<boolean>;
        errorButton: JSX.Element;
        errorText: JSX.Element;
    }> = {};

    show(): Promise<ProtectionRequest> {
        return upgradeMaterialDialog(this, {
            onClose: async (event) => {
                if (event.detail.action === "confirm") {
                    return {
                        page: this.page,
                        level: this.level,
                        reason: this.reason,
                        additionalInformation: this.additionalInformation,
                        duration: this.duration
                    };
                } else return null;
            }
        }).then((v) => v.wait());
    }

    renderLevels(): MaterialRadioFieldElement<ProtectionLevel> {
        const radioButtons: MaterialRadioFieldProps<
            ProtectionLevel
        >["radios"] = [];

        for (const level of [
            Object.assign(RedWarnWikiConfiguration.c.protection.unprotect, {
                id: null
            }),
            ...RedWarnWikiConfiguration.c.protection.levels
        ]) {
            if (level.requestable === false) continue;

            radioButtons.push({
                children: (
                    <div
                        style={toCSS({
                            display: "inline-block"
                        })}
                        class={"rw-mdc-prd-protectionLevel"}
                    >
                        {level.iconURL ? (
                            <img alt={level.name} src={level.iconURL} />
                        ) : (
                            <span
                                class="material-icons"
                                style={toCSS({
                                    color: level.color ?? "black"
                                })}
                            >
                                {level.id === null ? "lock_open" : "lock"}
                            </span>
                        )}
                        <span class={"rw-mdc-protectionLevels--name"}>
                            {capitalize(level.name)}
                        </span>
                    </div>
                ),
                value: level
            });
        }

        return (
            <MaterialRadioField<ProtectionLevel>
                radios={radioButtons}
                direction="vertical"
                disabled
                onChange={(level) => {
                    this._level = level;

                    if (level.id !== null) {
                        this.elementSet.duration.enable();

                        for (const entry of this.protectionInformation) {
                            if (
                                ((entry.type === "edit" &&
                                    entry.source == null) ||
                                    entry.type === "_flaggedrevs") &&
                                level.id === entry.level
                            ) {
                                for (const radio of this.elementSet.duration
                                    .MDCRadios) {
                                    if (
                                        (entry.expiry === "infinity") ==
                                        radio.radioValue
                                    ) {
                                        radio.MDCRadio.checked = true;
                                        radio.MDCRadio.disabled = true;
                                    }
                                }
                            }
                        }
                    } else {
                        this.elementSet.duration.reset();
                        this.elementSet.duration.disable();
                    }

                    this.uiValidate();
                }}
            />
        ) as MaterialRadioFieldElement<ProtectionLevel>;
    }

    renderReasonDropdown(): MaterialSelectElement<string> {
        const items: MaterialSelectItem<string>[] = [];

        // Blank (other reason)
        items.push({
            label: "Other reason",
            value: "",
            type: "action"
        });
        if (this._protectionReasons) {
            for (const [key, entries] of Object.entries(
                this._protectionReasons
            )) {
                items.push({
                    type: "header",
                    label: key
                });
                for (const entry of entries) {
                    items.push({
                        label: entry,
                        value: entry,
                        type: "action"
                    });
                }
            }
        }

        const el: MaterialSelectElement<string> = (
            <MaterialSelect<string>
                label={i18next.t("ui:protectionRequest.reasons")}
                items={items}
                required
                onChange={(i, v) => {
                    const field = this.elementSet.additionalInformation
                        ?.components?.textField;
                    if (field) field.required = v.length === 0;

                    this.uiValidate();
                }}
            />
        ) as MaterialSelectElement<string>;
        el.MDCSelect.disabled = this._protectionReasons == null;
        return el;
    }

    renderAdditionalInfo(): JSX.Element {
        const el = (
            <MaterialTextInput
                label={i18next.t("ui:protectionRequest.additionalInformation")}
                area
                outlined
            />
        );

        const components = MaterialTextInputUpgrade(el);

        this.elementSet.additionalInformation = {
            element: el,
            components: components
        };
        components.textField.listen("keydown", () => {
            this.uiValidate();
        });
        components.textField.listen("focusout", () => {
            this.uiValidate();
        });
        return el;
    }

    renderDuration(): MaterialRadioFieldElement<boolean> {
        const radios: Omit<MaterialRadioProps<boolean>, "name">[] = [
            {
                value: false,
                children: <MaterialIcon icon={"timer"} />,
                tooltip: i18next.t("ui:protectionRequest.duration.temporary")
            },
            {
                value: true,
                children: <MaterialIcon icon={"all_inclusive"} />,
                tooltip: i18next.t("ui:protectionRequest.duration.indefinite")
            }
        ];

        return (
            <MaterialRadioField<boolean>
                class={"rw-mdc-prd-duration"}
                radios={radios}
                onChange={(v) => {
                    if (v == null) this._duration = null;
                    else
                        this._duration = v
                            ? ProtectionDuration.Indefinite
                            : ProtectionDuration.Temporary;

                    this.uiValidate();
                }}
            />
        ) as MaterialRadioFieldElement<boolean>;
    }

    render(): HTMLDialogElement {
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "class":
                        "rw-mdc-protectionRequestDialog mdc-dialog__surface",
                    "aria-modal": true,
                    "aria-labelledby":
                        this.props.title ??
                        i18next.t<string>("ui:protectionRequest.title")
                }}
                id={this.id}
            >
                <MaterialDialogTitle tabIndex={0}>
                    <span style={{ float: "left" }}>
                        {this.props.title ??
                            i18next.t<string>("ui:protectionRequest.title")}
                    </span>
                </MaterialDialogTitle>
                <MaterialDialogContent
                    style={toCSS({
                        overflowY: "auto",
                        overflowX: "hidden"
                    })}
                >
                    {
                        (this.elementSet.titleSelect = (
                            <MaterialProtectionRequestDialogPage
                                label={i18next.t(
                                    "ui:protectionRequest.page.label"
                                )}
                                value={RedWarnStore.currentPage.title.getPrefixedText()}
                                parent={this}
                            />
                        ) as ReturnType<
                            typeof MaterialProtectionRequestDialogPage
                        >)
                    }
                    <div class={"rw-mdc-prd-options"}>
                        <div class={"rw-mdc-prd-reason"}>
                            {
                                (this.elementSet.reason = this.renderReasonDropdown())
                            }
                        </div>
                        <div class={"rw-mdc-prd-levels"}>
                            {(this.elementSet.levels = this.renderLevels())}
                        </div>
                        <div class={"rw-mdc-prd-info"}>
                            {this.renderAdditionalInfo()}
                            <div>
                                <span class={"rw-mdc-prd-duration--label"}>
                                    Duration
                                </span>
                                {
                                    (this.elementSet.duration = this.renderDuration())
                                }
                                <p class={"rw-mdc-prd-notice"}>
                                    {i18next.t<string>(
                                        "ui:protectionRequest.notice"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </MaterialDialogContent>
                <MaterialDialogActions>
                    {
                        (this.elementSet.errorButton = (
                            <MaterialIconButton
                                class={"rw-mdc-prd-validation"}
                                icon={"error"}
                                tooltip={i18next
                                    .t(
                                        "ui:protectionRequest.validation.validationFailedIconTooltip"
                                    )
                                    .toString()}
                                onClick={() => {
                                    // Show failed validation tests
                                    const dialog = new RedWarnUI.Dialog({
                                        title: i18next.t(
                                            "ui:protectionRequest.validation.validationDialogTitle"
                                        ),
                                        content: (
                                            <MaterialProtectionRequestDialogErrors
                                                tests={this.validate()}
                                            />
                                        ),
                                        actions: [
                                            {
                                                data: i18next.t(
                                                    "ui:okCancel.ok"
                                                )
                                            }
                                        ]
                                    });
                                    dialog.show();
                                }}
                            />
                        ))
                    }
                    {
                        (this.elementSet.errorText = (
                            <div class={"rw-mdc-dialog-helperText"} />
                        ))
                    }
                    <MaterialButton dialogAction="cancel">
                        {i18next.t<string>("ui:okCancel.cancel")}
                    </MaterialButton>
                    {
                        (this.elementSet.dialogConfirmButton = (
                            <MaterialButton
                                dialogAction="confirm"
                                action
                                disabled
                            >
                                {i18next.t<string>("ui:protectionRequest.ok")}
                            </MaterialButton>
                        ))
                    }
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;

        return this.element;
    }

    uiValidate(): void {
        const validationResults = this.validate();
        this.elementSet.dialogConfirmButton.toggleAttribute(
            "disabled",
            validationResults !== true
        );
        this.element.toggleAttribute(
            "data-invalid",
            validationResults !== true
        );
        if (validationResults !== true) {
            this.helperText = i18next.t(
                "ui:protectionRequest.validation.fail",
                {
                    context: validationResults[0].id
                }
            );
        } else {
            this.helperText = i18next.t("ui:protectionRequest.validation.pass");
        }
    }

    /**
     * Determines whether or not this dialog is ready for confirmation.
     */
    validate(): true | MaterialProtectionRequestDialogValidationTest[] {
        const tests: MaterialProtectionRequestDialogValidationTest[] = [
            {
                id: "noLevel",
                condition: this.level == null
            },
            {
                id: "noDuration",
                condition: this.level?.id !== null && this.duration == null
            },
            {
                id: "levelEqual",
                condition:
                    // No protection
                    (this.level?.id === null &&
                        this.protectionInformation.filter(
                            (v) =>
                                (v.type === "edit" && v.source == null) ||
                                v.type === "_flaggedrevs"
                        ).length === 0) ||
                    // Has protection
                    this.protectionInformation?.some(
                        (v) =>
                            ((v.type === "edit" && v.source == null) ||
                                v.type === "_flaggedrevs") &&
                            v.expiry === "infinity" &&
                            this.duration === ProtectionDuration.Indefinite
                    )
            },
            {
                id: "noReason",
                condition: this.reason == null
            },
            {
                id: "noAdditionalReason",
                condition:
                    this.reason != null &&
                    this.reason.length === 0 &&
                    this.additionalInformation.length === 0
            }
        ];

        const fails = tests.filter((v) => v.condition);

        if (fails.length > 0) {
            return fails;
        } else {
            return true;
        }
    }
}
