import RWUIElement, { RWUIElementProperties } from "./RWUIElement";

export type RWUIPreferencesItemProperties = RWUIElementProperties

export class RWUIPreferencesItem extends RWUIElement {
    public static readonly elementName = "rwPreferencesTab";

    /**
     * The HTMLDivElement which contains the tab.
     */
    element?: HTMLDivElement;

    constructor(readonly props: RWUIPreferencesItemProperties) {
        super();
    }

    /**
     * Renders the preferences tab.
     */
    render(): HTMLDivElement {
        throw new Error("Attempted to call abstract method");
    }
}
