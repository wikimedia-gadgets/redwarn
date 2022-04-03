import { RWUIExtendedOptions } from "app/ui/elements/RWUIExtendedOptions";
import { upgradeMaterialDialog } from "app/styles/material/Material";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "app/styles/material/ui/MaterialDialog";
import { h } from "tsx-dom";
import i18next from "i18next";
import MaterialButton from "app/styles/material/ui/components/MaterialButton";
import {
    MaterialList,
    MaterialListDivider,
    MaterialListItem,
    MaterialListSubheader,
} from "app/styles/material/ui/components/MaterialList";
import PageIcons from "app/ui/definitions/PageIcons";
import "../css/extendedOptions.css";
import toCSS from "app/styles/material/util/toCSS";
import { Configuration } from "app/config/user/Configuration";
import RevertOptions from "app/mediawiki/revert/RevertOptions";
import MaterialDiffIcons, {
    getRevertOptionClickHandler,
    MaterialActionSeverityColors,
    MaterialHighContrastActionSeverityColors,
} from "app/styles/material/ui/MaterialDiffIcons";
import { Revert } from "app/mediawiki";
import UIInjectors from "app/ui/injectors/UIInjectors";

export default class MaterialExtendedOptions extends RWUIExtendedOptions {
    private closeButton: HTMLButtonElement;

    show(): Promise<void> {
        return upgradeMaterialDialog<void>(this).then((v) => v.wait());
    }

    renderOptions(): JSX.Element[] {
        const items: JSX.Element[] = [];

        const ldi = UIInjectors.i.diffViewerInjector.latestDiffIcons;
        if (
            (this.props.showDiffIcons ?? Revert.isDiffPage()) &&
            ldi instanceof MaterialDiffIcons
        ) {
            items.push(
                <MaterialListSubheader>
                    {i18next.t<string>("ui:extendedOptions.extraRevertOptions")}
                </MaterialListSubheader>
            );
            for (const revertOption of Object.values(RevertOptions.loaded)) {
                if (revertOption.enabled) continue;

                const color =
                    (revertOption.color ??
                    Configuration.Accessibility.highContrast.value
                        ? MaterialHighContrastActionSeverityColors[
                              revertOption.severity
                          ]
                        : MaterialActionSeverityColors[
                              revertOption.severity
                          ]) || "black";
                const item = (
                    <MaterialListItem
                        icon={revertOption.icon}
                        color={color}
                        iconColor={color}
                    >
                        {revertOption.name}
                    </MaterialListItem>
                );
                items.push(item);
                item.addEventListener("click", () => {
                    getRevertOptionClickHandler(ldi, revertOption)();
                    this.closeButton.click();
                });
            }
            items.push(<MaterialListDivider />);
        }

        PageIcons().forEach((icon) => {
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
                        {`${icon.name ?? i18next.t(`ui:pageIcons.${icon.id}`)}`}
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
                    style: "min-width: 35vw;",
                }}
                containerProperties={{
                    class: "rw-mdc-extendedOptions",
                }}
            >
                <MaterialDialogTitle tabIndex={0}>
                    <span style={toCSS({ fontWeight: "bold" })}>
                        {i18next.t<string>("ui:extendedOptions.title")}
                    </span>
                </MaterialDialogTitle>
                <MaterialDialogContent>
                    <MaterialList>{...this.renderOptions()}</MaterialList>
                </MaterialDialogContent>
                <MaterialDialogActions>
                    {
                        (this.closeButton = (
                            <MaterialButton dialogAction="close">
                                {i18next.t<string>("ui:close")}
                            </MaterialButton>
                        ) as HTMLButtonElement)
                    }
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement);
    }
}
