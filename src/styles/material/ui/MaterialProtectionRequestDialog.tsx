import { RWUIProtectionRequestDialog } from "rww/ui/elements/RWUIProtectionRequestDialog";
import ProtectionRequest from "rww/mediawiki/protection/ProtectionRequest";
import { getMaterialStorage } from "rww/styles/material/data/MaterialStyleStorage";
import {
    registerMaterialDialog,
    upgradeMaterialDialog
} from "rww/styles/material/Material";
import RedWarnStore from "rww/data/RedWarnStore";
import { Page, ProtectionLevel, ProtectionRequestTarget } from "rww/mediawiki";
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
import { MaterialTextInputComponents } from "rww/styles/material/ui/components/MaterialTextInput";
import MaterialSelect, {
    MaterialSelectElement,
    MaterialSelectItem
} from "rww/styles/material/ui/components/MaterialSelect";

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
    }

    _protectionInformation: ProtectionEntry[];
    get protectionInformation(): ProtectionEntry[] {
        return this._protectionInformation;
    }
    set protectionInformation(value: ProtectionEntry[]) {
        if (value == null && this.elementSet.levels != null) {
            this.elementSet.levels.disable();
        } else if (this.elementSet.levels != null) {
            this.elementSet.levels.enable();

            // Automatically select and disable the original value.
            if (!value.some((v) => v.type === "edit")) {
                for (const radio of this.elementSet.levels.MDCRadios) {
                    if (radio.radioValue.id === null) {
                        radio.MDCRadio.checked = true;
                        radio.MDCRadio.disabled = true;
                    }
                }
            } else {
                for (const entry of value) {
                    if (
                        entry.type === "edit" ||
                        entry.type === "_flaggedrevs"
                    ) {
                        for (const radio of this.elementSet.levels.MDCRadios) {
                            if (radio.radioValue.id === entry.level) {
                                radio.MDCRadio.checked = true;
                                radio.MDCRadio.disabled = true;
                            }
                        }
                    }
                }
            }
        }

        this._protectionInformation = value;
    }

    // TODO getter
    level: ProtectionLevel;
    // TODO getter
    target: ProtectionRequestTarget;
    // TODO getter
    reason: string;

    elementSet: Partial<{
        dialogConfirmButton: JSX.Element;
        levels: MaterialRadioFieldElement<ProtectionLevel>;
        titleSelect: ReturnType<typeof MaterialProtectionRequestDialogPage>;
        reason: MaterialSelectElement<string>;
        additionalInformation: {
            element: JSX.Element;
            components: MaterialTextInputComponents;
        };
    }> = {};

    show(): Promise<ProtectionRequest> {
        const styleStorage = getMaterialStorage();
        registerMaterialDialog(this);
        const dialog = upgradeMaterialDialog(this);

        return new Promise((resolve) => {
            dialog.listen(
                "MDCDialog:closed",
                async (event: Event & { detail: { action: string } }) => {
                    if (event.detail.action === "confirm") {
                        this._result = {
                            page: this.page,
                            level: this.level,
                            target: this.target,
                            reason: this.reason
                        };
                    } else this._result = null;

                    if (!!this._result && this.props.autoRequest) {
                    }

                    styleStorage.dialogTracker.delete(this.id);
                    resolve(this._result);
                }
            );
        });
    }

    renderLevels(): MaterialRadioFieldElement<ProtectionLevel> {
        const radioButtons: MaterialRadioFieldProps<
            ProtectionLevel
        >["radios"] = [];

        for (const level of [
            Object.assign(RedWarnWikiConfiguration.c.protection.deprotect, {
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
            />
        ) as MaterialRadioFieldElement<ProtectionLevel>;
    }

    renderReasonDropdown(): MaterialSelectElement<string> {
        const items: MaterialSelectItem<string>[] = [];

        // Blank (other reason)
        items.push({
            label: "",
            value: null,
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
                onChange={(i, v) => {
                    this.reason = v;
                }}
                class={"rw-mdc-prd-reason"}
                required
            />
        ) as MaterialSelectElement<string>;
        el.MDCSelect.disabled = this._protectionReasons == null;
        return el;
    }

    render(): HTMLDialogElement {
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "class":
                        "rw-mdc-protectionRequestDialog mdc-dialog__surface",
                    "style": {
                        width: this.props.width ?? "70vw",
                        height: "95vh"
                    },
                    "aria-modal": true,
                    "aria-labelledby":
                        this.props.title ??
                        i18next.t("ui:protectionRequest.title").toString()
                }}
                id={this.id}
            >
                <MaterialDialogTitle tabIndex={0}>
                    <span style={{ float: "left" }}>
                        {this.props.title ??
                            i18next.t("ui:protectionRequest.title").toString()}
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
                        {(this.elementSet.reason = this.renderReasonDropdown())}
                        {(this.elementSet.levels = this.renderLevels())}
                    </div>
                </MaterialDialogContent>
                <MaterialDialogActions>
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
}
