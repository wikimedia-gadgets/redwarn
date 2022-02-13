import { Setting } from "rww/config/user/Setting";
import RWUIElement, { RWUIElementProperties } from "./RWUIElement";

export interface RWUIPreferencesItemProperties extends RWUIElementProperties {
    name: string;
    setting: Setting<any>;
}

export type RWUIPreferencesItemID = string;

export class RWUIPreferencesItem extends RWUIElement {
    public static readonly elementName = "rwPreferencesItem";

    /**
     * The HTMLDivElement which contains the item.
     */
    element?: HTMLDivElement;

    /**
     * The result of the item.
     */
    public result: any;

    protected constructor(readonly props: RWUIPreferencesItemProperties) {
        super();
        this.props = props;
    }

    /**
     * Renders the preferences item.
     */
    render(): HTMLDivElement {
        throw new Error("Attempted to call abstract method");
    }
}
