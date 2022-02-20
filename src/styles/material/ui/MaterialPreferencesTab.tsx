import { RWUIPreferencesTab } from "rww/ui/elements/RWUIPreferencesTab";
import { h } from "tsx-dom";
import MaterialTabBarItem, {
    getMaterialTabBarItemComponent,
} from "./components/MaterialTabBarItem";
import { MDCTab } from "@material/tab";
import classMix from "../util/classMix";
import MaterialPreferencesItem from "./MaterialPreferencesItem";

/**
 * The MaterialPreferencesTab is a handling class used for different tabs in the preferences page.
 */
export default class MaterialPreferencesTab extends RWUIPreferencesTab {
    tabBarItemComponent?: MDCTab;

    renderTabBarItem(): HTMLButtonElement {
        this.tabBarElement = (
            <MaterialTabBarItem
                title={this.props.title}
                active={this.props.active}
            />
        ) as HTMLButtonElement;
        this.tabBarItemComponent = getMaterialTabBarItemComponent(
            this.tabBarElement
        );

        return this.tabBarElement;
    }

    render(): HTMLDivElement {
        const items = this.props.items
            .filter((item) => item.displayInfo != null)
            .flatMap((item) => {
                const preferencesItem = new MaterialPreferencesItem({
                    name: item.displayInfo.title,
                    setting: item,
                    onChange: (value) =>
                        this.props.onChange({ id: item.id, value }),
                });
                return [preferencesItem.render()];
            });
        return (this.element = (
            <div
                class={classMix(
                    "rw-preferences-tab",
                    this.props.active
                        ? "rw-preferences-tab--active"
                        : "rw-preferences-tab--inactive"
                )}
            >
                {items}
            </div>
        ) as HTMLDivElement);
    }

    activate(): void {
        this.tabBarItemComponent?.activate();
        // change classes
        this.element.classList.remove("rw-preferences-tab--inactive");
        this.element.classList.add("rw-preferences-tab--active");
    }

    deactivate(): void {
        this.tabBarItemComponent?.deactivate();
        // change classes
        this.element.classList.remove("rw-preferences-tab--active");
        this.element.classList.add("rw-preferences-tab--inactive");
    }
}
