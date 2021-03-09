import { BaseProps, h } from "tsx-dom";
import expandDataAttributes from "rww/styles/material/util/expandDataAttributes";

export interface MaterialButtonProperties extends BaseProps {
    dialogAction?: string | { data: string; text: string };
    icon?: string;
    iconColor?: string;
    contentStyle?: Partial<CSSStyleDeclaration>;
    style?: Partial<CSSStyleDeclaration>;
    onClick?: (event: MouseEvent) => void;
    disabled?: boolean;
}

export default function (props: MaterialButtonProperties): JSX.Element {
    const {
        dialogAction,
        children,
        icon,
        contentStyle,
        iconColor,
        style,
        disabled,
    } = props;
    const classes = ["mdc-button"];

    if (dialogAction) {
        classes.push("mdc-dialog__button");
    }

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
            style={style}
            disabled={disabled}
            {...expandDataAttributes(props)}
        >
            <div class="mdc-button__ripple" />
            {icon && (
                <i
                    class="material-icons mdc-button__icon"
                    aria-hidden="true"
                    {...(iconColor && { style: { color: iconColor } })}
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
