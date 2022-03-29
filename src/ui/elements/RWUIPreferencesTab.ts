import { PrimitiveSetting, Setting } from "rww/config/user/Setting";
import RWUIElement, { RWUIElementProperties } from "./RWUIElement";

export interface RWUIPreferencesTabProperties extends RWUIElementProperties {
    title: string;
    items: Setting<any>[];
    active: boolean;
    onChange: (setting: PrimitiveSetting<any>) => void;
}

export class RWUIPreferencesTab extends RWUIElement {
    public static readonly elementName = "rwPreferencesTab";

    /**
     * The HTMLDivElement which contains the tab.
     */
    element?: HTMLDivElement;

    /**
     * The HTMLButtonElement which contains the tab bar item.
     */
    tabBarElement?: HTMLButtonElement;

    constructor(readonly props: RWUIPreferencesTabProperties) {
        super();
    }

    /**
     * Renders the preferences tab.
     */
    render(): HTMLDivElement {
        throw new Error("Attempted to call abstract method");
    }

    /**
     * Renders the preferences tab bar item.
     */
    renderTabBarItem(): HTMLButtonElement {
        throw new Error("Attempted to call abstract method");
    }

    /**
     * Activates the tab.
     */
    activate(): void {
        throw new Error("Attempted to call abstract method");
    }
}
