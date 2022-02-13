import { Setting } from "rww/config/user/Setting";
import RWUIElement, { RWUIElementProperties } from "./RWUIElement";

export interface RWUIPreferencesTabProperties extends RWUIElementProperties {
    title: string;
    items: Setting<any>[];
}

export class RWUIPreferencesTab extends RWUIElement {
    public static readonly elementName = "rwPreferencesTab";

    /**
     * The HTMLDivElement which contains the tab.
     */
    element?: HTMLDivElement;

    constructor(readonly props: RWUIPreferencesTabProperties) {
        super();
    }

    /**
     * Renders the preferences tab.
     */
    render(): HTMLDivElement {
        throw new Error("Attempted to call abstract method");
    }
}
