import RWUIElement, { RWUIElementProperties } from "./RWUIElement";
import { RWUIPreferencesTab } from "./RWUIPreferencesTab";

export interface RWUIPreferencesProperties extends RWUIElementProperties {
    tabs: RWUIPreferencesTab[];
}

export class RWUIPreferences extends RWUIElement {
    public static readonly elementName = "rwPreferencesTab";

    /**
     * The HTMLDivElement which contains the tab.
     */
    element?: HTMLDivElement;

    constructor(readonly props: RWUIPreferencesProperties) {
        super();
    }

    /**
     * Renders the preferences tab.
     */
    render(): HTMLDivElement {
        throw new Error("Attempted to call abstract method");
    }
}
