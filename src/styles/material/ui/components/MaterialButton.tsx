import { BaseProps, h } from "tsx-dom";
import expandDataAttributes from "rww/styles/material/util/expandDataAttributes";
import toCSS from "rww/styles/material/util/toCSS";
import { Configuration } from "rww/config/user/Configuration";

export interface MaterialButtonProperties extends BaseProps {
    class?: string;
    action?: boolean; // whether or not this button is an action button, such as "ok", "submit", etc. used for accessibility
    dialogAction?: string | { data: string; text: string };
    icon?: string;
    iconColor?: string;
    raised?: boolean;
    contentStyle?: Partial<CSSStyleDeclaration>;
    style?: Partial<CSSStyleDeclaration>;
    onClick?: (event: MouseEvent) => void;
    disabled?: boolean;
}

export default function (props: MaterialButtonProperties): JSX.Element {
    const {
        action,
        dialogAction,
        children,
        icon,
        contentStyle,
        iconColor,
        style,
        disabled,
        raised,
    } = props;
    const classes = ["mdc-button", ...(props.class ?? [])];

    if (dialogAction) classes.push("mdc-dialog__button");

    // Raised only if specifically asked, or an action button and user has set to raise action buttons in their config
    if (
        raised ||
        (action && Configuration.Accessibility.raiseActionButtons.value)
    )
        classes.push("mdc-button--raised");

    return (
        <button
            type="button"
            class={classes.join(" ")}
            data-mdc-dialog-action={
                dialogAction == null
                    ? false
                    : typeof dialogAction === "string"
                    ? dialogAction
                    : dialogAction.data
            }
            style={toCSS(style)}
            disabled={disabled}
            {...expandDataAttributes(props)}
            onClick={props.onClick}
        >
            <div class="mdc-button__ripple" />
            {icon && (
                <i
                    class="material-icons mdc-button__icon"
                    aria-hidden="true"
                    {...(iconColor && { style: toCSS({ color: iconColor }) })}
                >
                    {icon}
                </i>
            )}
            <span
                class="mdc-button__label"
                {...(contentStyle && { style: contentStyle })}
            >
                {children}
            </span>
        </button>
    );
}
