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

export default class MaterialProtectionRequestDialog extends RWUIProtectionRequestDialog {
    page: Page = RedWarnStore.currentPage;
    // TODO getter
    level: ProtectionLevel;
    // TODO getter
    target: ProtectionRequestTarget;
    // TODO getter
    reason: string;

    elementSet: Partial<{
        dialogConfirmButton: JSX.Element;
        levels: MaterialRadioFieldElement<ProtectionLevel>;
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
                                lock
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
            />
        ) as MaterialRadioFieldElement<ProtectionLevel>;
    }

    render(): HTMLDialogElement {
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "class":
                        "rw-mdc-protectionRequestDialog mdc-dialog__surface",
                    "style": {
                        width: this.props.width ?? "50vw",
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
                    <div>
                        <div class={"rw-mdc-protectionRequestDialog--title"}>
                            {this.page.title.getPrefixedText()}
                        </div>
                        <p>Determining page protection level...</p>
                    </div>
                    {(this.elementSet.levels = this.renderLevels())}
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
