import { BaseProps, h } from "tsx-dom";
import expandDataAttributes from "rww/styles/material/util/expandDataAttributes";

export interface MaterialIconButtonProperties extends BaseProps {
    onClick?: (event: MouseEvent) => void;
    label?: string;
    icon: string;
    iconColor?: string;
    /**
     * The tooltip of this button.
     *
     * If the tooltip is a string, that string is used for the tooltip. If the
     * tooltip is unset, the label will be used for the tooltip. If the tooltip
     * is set to `false`, a tooltip will not be shown.
     */
    tooltip?: string | false;
}

export default function (props: MaterialIconButtonProperties): JSX.Element {
    const { onClick, label, icon, iconColor, tooltip } = props;
    return (
        <button
            type="button"
            class="mdc-icon-button material-icons"
            aria-label={label}
            data-rw-mdc-tooltip={
                (typeof tooltip === "string" ||
                    (tooltip !== false && !!label)) &&
                (tooltip ?? label)
            }
            onClick={onClick}
            style={`color:${iconColor ?? "initial"};`}
            {...expandDataAttributes(props)}
        >
            {icon}
        </button>
    );
}
