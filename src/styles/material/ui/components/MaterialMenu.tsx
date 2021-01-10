import { MDCMenu } from "@material/menu";
import { BaseProps, h } from "tsx-dom";

/* Specificity is key */
type MaterialMenuID = string;

export interface MaterialMenuAction {
    label: string;
    icon?: string;
    action?: () => any;
}

export interface MaterialMenuProps extends BaseProps {
    id: MaterialMenuID;
    items: MaterialMenuAction[];
}

const MaterialMenuTracker = new Map<MaterialMenuID, MDCMenu>();

/**
 * Opens a menu.
 *
 * Note that the actual menu needs to be spawned in the DOM for
 * this to work.
 */
export function openMenu(id: MaterialMenuID): void {
    const menu = MaterialMenuTracker.get(id);
    menu.open = true;

    document.querySelectorAll("[data-menu-id]").forEach((element) => {
        console.log(menu.root);
        if (element.getAttribute("data-menu-id") === menu.root.id) {
            const viewportOffset = element.getBoundingClientRect();
            menu.setAbsolutePosition(
                viewportOffset.left,
                viewportOffset.top + element.clientHeight
            );
        }
    });
}

export default function (props: MaterialMenuProps): JSX.Element {
    // The span allows the animation event to fire.
    const menu = (
        <span data-append-event={true}>
            <div id={props.id} class="mdc-menu mdc-menu-surface">
                <ul
                    class="mdc-list"
                    role="menu"
                    aria-hidden="true"
                    aria-orientation="vertical"
                    tabIndex={-1}
                >
                    {props.items.map<JSX.Element>((menuAction) => {
                        return (
                            <li
                                class="mdc-list-item"
                                role="menuitem"
                                onClick={() => {
                                    menuAction.action();
                                }}
                            >
                                <span class="mdc-list-item__ripple" />
                                {menuAction.icon && (
                                    <span class="mdc-list-item__graphic material-icons">
                                        {menuAction.icon}
                                    </span>
                                )}
                                <span class="mdc-list-item__text">
                                    {menuAction.label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </span>
    );

    menu.addEventListener("animationstart", () => {
        if (menu.parentElement !== document.body) {
            document.body.appendChild(menu);
        }
        MaterialMenuTracker.set(
            props.id,
            new MDCMenu(menu.querySelector(".mdc-menu"))
        );
    });

    return menu;
}
