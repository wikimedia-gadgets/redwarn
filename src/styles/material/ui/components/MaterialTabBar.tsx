import { BaseProps, h } from "tsx-dom";
import { generateId } from "rww/util";
import { MDCTabBar, MDCTabBarActivatedEvent } from "@material/tab-bar";
import Log from "rww/data/RedWarnLog";
import RWUIElement from "rww/ui/elements/RWUIElement";

export interface MaterialTabBarProps extends BaseProps {
    focusOnActivate?: boolean;
    activeTabIndex?: number;
    onActivate?: (event: MDCTabBarActivatedEvent) => void;
    useAutomaticActivation?: boolean;
    id?: string;
}

class MaterialTabBar extends RWUIElement {
    id: string;

    constructor(private props: MaterialTabBarProps) {
        super();
        this.id = !this.props.id ? `rwTabBar__${generateId(8)}` : this.props.id;
    }

    render(): JSX.Element {
        const tabBarElement = (
            <div class="mdc-tab-bar" role="tablist" id={this.id}>
                <div class="mdc-tab-scroller">
                    <div class="mdc-tab-scroller__scroll-area">
                        <div class="mdc-tab-scroller__scroll-content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );

        const tabBar = new MDCTabBar(tabBarElement);
        tabBar.focusOnActivate = this.props.focusOnActivate;
        tabBar.useAutomaticActivation = this.props.useAutomaticActivation;
        tabBar.activateTab(this.props.activeTabIndex);

        // listen for activated
        tabBar.listen(
            "MDCTabBar:activated",
            (event: MDCTabBarActivatedEvent) => {
                Log.debug("tab bar activate", { index: event.detail.index });

                if (event.detail.index !== this.props.activeTabIndex) {
                    if (typeof this.props.onActivate === "function") {
                        Log.trace("tab bar running onActivate", {
                            onActivate: this.props.onActivate,
                        });
                        this.props.onActivate(event);
                        this.props.activeTabIndex = event.detail.index;
                    }
                }
            }
        );

        return tabBarElement;
    }
}

export { MaterialTabBar as MaterialTabBarController };
export default function generator(
    props: MaterialTabBarProps
): JSX.Element & { TabBar: MaterialTabBar } {
    const tabBar = new MaterialTabBar(props);
    return Object.assign(tabBar.render(), {
        TabBar: tabBar,
    });
}
