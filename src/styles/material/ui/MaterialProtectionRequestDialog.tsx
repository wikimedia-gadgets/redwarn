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
                <MaterialDialogTitle
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "200",
                        fontSize: "45px",
                        lineHeight: "48px",
                        borderStyle: "none",
                        marginTop: "4vh"
                    }}
                    tabIndex={0}
                >
                    <span style={{ float: "left" }}>
                        {this.props.title ??
                            i18next.t("ui:protectionRequest.title").toString()}
                    </span>
                </MaterialDialogTitle>
                <MaterialDialogContent
                    style={{
                        height: "400px",
                        overflowY: "auto",
                        overflowX: "hidden"
                    }}
                ></MaterialDialogContent>
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
