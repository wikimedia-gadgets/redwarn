import { h } from "tsx-dom";
import { generateId } from "rww/util";
import classMix from "../../util/classMix";
import { MDCTab } from "@material/tab";

export interface MaterialTabBarItemProps {
    title: string;
    icon?: string;
    id?: string;
    active?: boolean;
    focusOnActivate?: boolean;
}

// Private storage variable. No need to put it into {@link MaterialStyleStorage}.
const MaterialTabBarItemTrack = new Map<
    string,
    {
        element: JSX.Element;
        props: MaterialTabBarItemProps;
        component?: MDCTab;
    }
>();

export default function ({
    id,
    icon,
    title,
    active = false,
    focusOnActivate = true,
}: MaterialTabBarItemProps): JSX.Element {
    const _id = !id ? `rwTabBarItem__${generateId(8)}` : id;

    const tabBarItemElement = (
        <button
            class="mdc-tab mdc-tab--active"
            role="tab"
            aria-selected={active ? "true" : "false"}
            id={_id}
        >
            <span class="mdc-tab__content">
                {icon ? (
                    <span
                        class="mdc-tab__icon material-icons"
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                ) : null}

                <span class="mdc-tab__text-label">{title}</span>
            </span>
            <span
                class={classMix(
                    "mdc-tab-indicator",
                    active ? "mdc-tab-indicator--active" : ""
                )}
            >
                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline" />
            </span>
            <span class="mdc-tab__ripple" />
            <div class="mdc-tab__focus-ring" />
        </button>
    );

    const tabBarItem = new MDCTab(tabBarItemElement);
    tabBarItem.focusOnActivate = focusOnActivate;
    if (active) {
        tabBarItem.activate();
    } else {
        tabBarItem.deactivate();
    }

    // set in map
    MaterialTabBarItemTrack.set(_id, {
        element: tabBarItemElement,
        props: {
            title,
            icon,
            id: _id,
            active,
            focusOnActivate,
        },
        component: tabBarItem,
    });

    return tabBarItemElement;
}

export function getMaterialTabBarItemComponent(element: JSX.Element): MDCTab {
    const id = element.id;
    if (!id) {
        throw new Error("MaterialTabBarItem has no id");
    }
    const track = MaterialTabBarItemTrack.get(id);
    return track.component || new MDCTab(element);
}
