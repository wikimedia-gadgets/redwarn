import { Configuration } from "rww/config/user/Configuration";
import RWUIElement, { RWUIElementProperties } from "./RWUIElement";

export interface RWUIPreferencesProperties extends RWUIElementProperties {
    excludeTabs?: string[];
}

export class RWUIPreferences extends RWUIElement {
    public static readonly elementName = "rwPreferences";

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
