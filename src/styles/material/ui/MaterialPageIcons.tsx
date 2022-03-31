import { RWUIPageIcons } from "app/ui/elements/RWUIPageIcons";
import { h } from "tsx-dom";
import PageIcons from "app/ui/definitions/PageIcons";
import MaterialIconButton from "app/styles/material/ui/components/MaterialIconButton";
import i18next from "i18next";

import "../css/pageIcons.css";
import { Configuration } from "app/config/user/Configuration";

export default class MaterialPageIcons extends RWUIPageIcons {
    public static readonly elementName = "rwPageIcons";

    /**
     * This element, as returned by {@link RWUIPageIcons.render}.
     */
    self: HTMLElement;

    renderIcons(): JSX.Element[] {
        const icons: JSX.Element[] = [];

        PageIcons().forEach((icon) => {
            if (
                ((Configuration.UI.pageIcons.value?.[icon.id]?.enabled ??
                    icon.default) &&
                    icon.visible()) ||
                icon.required
            ) {
                icons.push(
                    <MaterialIconButton
                        class="rw-mdc-pageIcons-icon"
                        icon={icon.icon}
                        iconColor={icon.color ?? "black"}
                        tooltip={`${
                            icon.name ?? i18next.t(`ui:pageIcons.${icon.id}`)
                        }`}
                        onClick={icon.action}
                    />
                );
            }
        });

        return icons;
    }

    /**
     * Returns the rendered page icons.
     */
    render(): JSX.Element {
        return (this.self = <div>{this.renderIcons()}</div>);
    }
}
