import { RWUIPreferencesTab } from "rww/ui/elements/RWUIPreferencesTab";
import { h } from "tsx-dom";
import MaterialTabBarItem, {
    getMaterialTabBarItemComponent,
} from "./components/MaterialTabBarItem";
import { MDCTab } from "@material/tab";
import classMix from "../util/classMix";

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
        return (this.element = (
            <div
                class={classMix(
                    "rw-preferences-tab",
                    this.props.active
                        ? "rw-preferences-tab--active"
                        : "rw-preferences-tab--inactive"
                )}
            ></div>
        ) as HTMLDivElement);
    }

    activate(): void {
        //
    }
}
