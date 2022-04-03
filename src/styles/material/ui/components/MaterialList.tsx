import { BaseProps, h } from "tsx-dom";
import { MDCRipple } from "@material/ripple";
import { MDCList } from "@material/list/component";
import toCSS from "app/styles/material/util/toCSS";
import classMix from "app/styles/material/util/classMix";

export function MaterialList(
    props: BaseProps & JSX.HTMLAttributes & { initialized?: boolean }
): JSX.Element {
    const el = (
        <ul
            {...Object.fromEntries(
                Object.entries(props).filter(
                    ([k]) => !["children", "initialized"].includes(k)
                )
            )}
            class={`mdc-list ${props.class ?? ""}`}
        >
            {props.children}
        </ul>
    );

    if (props.initialized !== false) new MDCList(el);

    return el;
}

export function MaterialListItem(
    props: BaseProps &
        JSX.HTMLAttributes & {
            icon?: string;
            iconColor?: string;
            color?: string;
        }
): JSX.Element {
    const ripple = <span class="mdc-list-item__ripple" />;
    new MDCRipple(ripple);
    return (
        <li
            {...Object.fromEntries(
                Object.entries(props).filter(
                    ([k]) => !["children", "icon"].includes(k)
                )
            )}
            class={classMix([
                "mdc-list-item",
                "mdc-list-item--with-one-line",
                props.class,
            ])}
        >
            {ripple}
            {props.icon && (
                <span
                    class="mdc-deprecated-list-item__graphic material-icons"
                    aria-hidden="true"
                    style={toCSS({
                        color: props.iconColor ?? props.color ?? undefined,
                    })}
                >
                    {props.icon}
                </span>
            )}
            <span
                class="mdc-list-item__text"
                style={toCSS({
                    color: props.color ?? undefined,
                })}
            >
                {props.children}
            </span>
        </li>
    );
}
export function MaterialListSubheader(props: BaseProps): JSX.Element {
    return <h3 class={"mdc-list-group__subheader"}>{props.children}</h3>;
}
export function MaterialListDivider(): JSX.Element {
    return <li role="separator" class={"mdc-list-divider"} />;
}
