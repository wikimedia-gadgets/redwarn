import { DisplayInformation } from "rww/config/user/Setting";
import random from "rww/util/random";
import RWUIElement, { RWUIElementProperties } from "./RWUIElement";

export interface RWUIPreferencesItemProperties extends RWUIElementProperties {
    name: string;
    /**
     * Used to track preferences items.
     * @internal
     */
    key?: string;
    displayInfo: DisplayInformation;
}

export type RWUIPreferencesItemID = string;

export class RWUIPreferencesItem extends RWUIElement {
    public static readonly elementName = "rwPreferencesItem";

    /**
     * The HTMLDivElement which contains the item.
     */
    element?: HTMLDivElement;

    /**
     * A unique identifier for this dialog, to allow multiple active dialogs.
     */
    key: string;

    /**
     * The result of the item.
     */
    public result: any;

    protected constructor(readonly props: RWUIPreferencesItemProperties) {
        super();
        this.key = `preferencesItem_${props.key ?? random(16)}`;
        this.props = props;
    }

    /**
     * Renders the preferences item.
     */
    render(): HTMLDivElement {
        throw new Error("Attempted to call abstract method");
    }
}
