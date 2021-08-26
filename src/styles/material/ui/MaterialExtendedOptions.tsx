import { RWUIExtendedOptions } from "rww/ui/elements/RWUIExtendedOptions";
import { getMaterialStorage } from "rww/styles/material/data/MaterialStyleStorage";
import {
    registerMaterialDialog,
    upgradeMaterialDialog
} from "rww/styles/material/Material";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle
} from "rww/styles/material/ui/MaterialDialog";
import { h } from "tsx-dom";
import i18next from "i18next";
import MaterialButton from "rww/styles/material/ui/components/MaterialButton";
import {
    MaterialList,
    MaterialListItem
} from "rww/styles/material/ui/components/MaterialList";
import PageIcons from "rww/ui/definitions/PageIcons";
import "../css/extendedOptions.css";
import toCSS from "rww/styles/material/util/toCSS";
import { Configuration } from "rww/config/user/Configuration";

export default class MaterialExtendedOptions extends RWUIExtendedOptions {
    show(): Promise<void> {
        const styleStorage = getMaterialStorage();
        registerMaterialDialog(this);
        const dialog = upgradeMaterialDialog(this);

        return new Promise((resolve) => {
            dialog.listen("MDCDialog:closed", async () => {
                styleStorage.dialogTracker.delete(this.id);
                resolve();
            });
        });
    }

    renderOptions(): JSX.Element[] {
        const items: JSX.Element[] = [];

        PageIcons.forEach((icon) => {
            if (
                !(
                    Configuration.UI.pageIcons.value?.[icon.id]?.enabled ??
                    icon.default
                ) &&
                icon.visible()
            ) {
                items.push(
                    <MaterialListItem
                        icon={icon.icon}
                        color={icon.color ?? "black"}
                        onClick={icon.action}
                    >
                        {`${i18next.t(`ui:pageIcons.${icon.id}`)}`}
                    </MaterialListItem>
                );
            }
        });

        return items;
    }

    render(): HTMLDialogElement {
        return (this.element = (
            <MaterialDialog
                id={this.id}
                surfaceProperties={{
                    style: "min-width: 35vw;"
                }}
                containerProperties={{
                    class: "rw-mdc-extendedOptions"
                }}
            >
                <MaterialDialogTitle tabIndex={0}>
                    <span style={toCSS({ fontWeight: "bold" })}>
                        {i18next.t("ui:extendedOptions.title").toString()}
                    </span>
                </MaterialDialogTitle>
                <MaterialDialogContent>
                    <MaterialList>{...this.renderOptions()}</MaterialList>
                </MaterialDialogContent>
                <MaterialDialogActions>
                    <MaterialButton dialogAction="close">
                        {i18next.t<string>("ui:close")}
                    </MaterialButton>
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement);
    }
}
