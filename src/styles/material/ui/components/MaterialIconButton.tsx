import { BaseProps, h } from "tsx-dom";
import expandDataAttributes from "rww/styles/material/util/expandDataAttributes";
import { MDCRipple } from "@material/ripple";

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
    class?: string | string[];
    id?: string;
    disabled?: boolean;
    ripple?: boolean;
}

export default function (props: MaterialIconButtonProperties): JSX.Element {
    const { onClick, label, icon, iconColor, tooltip, ripple } = props;
    const iconButton = (
        <button
            id={props.id}
            type="button"
            class={`mdc-icon-button material-icons ${
                props.class
                    ? Array.isArray(props.class)
                        ? props.class.join(" ")
                        : props.class
                    : ""
            }`}
            disabled={props.disabled}
            aria-label={label}
            data-rw-mdc-tooltip={
                (typeof tooltip === "string" ||
                    (tooltip !== false && !!label)) &&
                (tooltip ?? label)
            }
            onClick={onClick}
            style={[...(iconColor ? [`color:${iconColor}`] : [])].join(";")}
            {...expandDataAttributes(props)}
            data-mdc-ripple-is-unbounded={true}
        >
            {(ripple ?? true) && <span class="mdc-icon-button__ripple" />}
            {icon}
        </button>
    );

    if (ripple ?? true) {
        new MDCRipple(iconButton);
    }

    return iconButton;
}
