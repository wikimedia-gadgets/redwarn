import { BaseProps, h } from "tsx-dom";
import { generateId } from "rww/util";
import { MDCTabBar, MDCTabBarActivatedEvent } from "@material/tab-bar";
import Log from "rww/data/RedWarnLog";

export interface MaterialTabBarProps extends BaseProps {
    focusOnActivate?: boolean;
    activeTabIndex?: number;
    onActivate?: (event: MDCTabBarActivatedEvent) => void;
    useAutomaticActivation?: boolean;
    id?: string;
}

export default function ({
    id,
    children,
    focusOnActivate = true,
    useAutomaticActivation = true,
    activeTabIndex = 0,
    onActivate,
}: MaterialTabBarProps): JSX.Element {
    const _id = !id ? `rwTabBar__${generateId(8)}` : id;

    const tabBarElement = (
        <div class="mdc-tab-bar" role="tablist" id={_id}>
            <div class="mdc-tab-scroller">
                <div class="mdc-tab-scroller__scroll-area">
                    <div class="mdc-tab-scroller__scroll-content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    const tabBar = new MDCTabBar(tabBarElement);
    tabBar.focusOnActivate = focusOnActivate;
    tabBar.useAutomaticActivation = useAutomaticActivation;
    tabBar.activateTab(activeTabIndex);

    // listen for activated
    tabBar.listen("MDCTabBar:activated", (event: MDCTabBarActivatedEvent) => {
        Log.debug("tab bar activate", { index: event.detail.index });

        if (event.detail.index !== activeTabIndex) {
            if (typeof onActivate === "function") {
                Log.trace("tab bar running onActivate", { onActivate });
                onActivate(event);
            }
        }
    });

    return tabBarElement;
}
