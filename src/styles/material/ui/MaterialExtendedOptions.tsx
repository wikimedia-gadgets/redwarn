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
import {
    MaterialActionSeverityColors,
    MaterialHighContrastActionSeverityColors,
} from "app/styles/material/ui/MaterialDiffIcons";

export default class MaterialExtendedOptions extends RWUIExtendedOptions {
    show(): Promise<void> {
        return upgradeMaterialDialog<void>(this).then((v) => v.wait());
    }

    renderOptions(): JSX.Element[] {
        const items: JSX.Element[] = [];

        if (this.props.showDiffIcons) {
            items.push(
                <MaterialListSubheader>
                    {i18next.t<string>("ui:extendedOptions.extraRevertOptions")}
                </MaterialListSubheader>
            );
            for (const diffIcon of Object.values(RevertOptions.loaded)) {
                if (diffIcon.enabled) continue;

                const color =
                    (diffIcon.color ??
                    Configuration.Accessibility.highContrast.value
                        ? MaterialHighContrastActionSeverityColors[
                              diffIcon.severity
                          ]
                        : MaterialActionSeverityColors[diffIcon.severity]) ||
                    "black";
                items.push(
                    <MaterialListItem
                        icon={diffIcon.icon}
                        color={color}
                        iconColor={color}
                        data-rw-revert-option={diffIcon.id}
                    >
                        {diffIcon.name}
                    </MaterialListItem>
                );
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
                    <MaterialButton dialogAction="close">
                        {i18next.t<string>("ui:close")}
                    </MaterialButton>
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement);
    }
}
