import "../css/warnDialog.css";

import { h } from "tsx-dom";
import { RWUIWarnDialog } from "rww/ui/elements/RWUIDialog";
import {
    registerMaterialDialog,
    upgradeMaterialDialog,
} from "rww/styles/material/Material";
import { getMaterialStorage } from "rww/styles/material/storage/MaterialStyleStorage";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";
import MaterialWarnDialogUser from "./components/MaterialWarnDialogUser";
import i18next from "i18next";
import MaterialWarnDialogReason from "rww/styles/material/ui/components/MaterialWarnDialogReason";
import type { User } from "rww/mediawiki";

export default class MaterialWarnDialog extends RWUIWarnDialog {
    user: User;

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
                        // TODO get warn results
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
                    <MaterialWarnDialogUser
                        warnDialog={this}
                        originalUser={this.props.targetUser}
                    />
                    <MaterialWarnDialogReason warnDialog={this} />
                </MaterialDialogContent>
                <MaterialDialogActions>
                    <MaterialButton dialogAction="confirm">
                        {i18next.t<string>("ui:warn.ok")}
                    </MaterialButton>

                    <MaterialButton dialogAction="cancel">
                        {i18next.t<string>("ui:okCancel.cancel")}
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
