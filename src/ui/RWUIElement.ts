/* eslint-disable @typescript-eslint/no-unused-vars */

import { RWUIDialog } from "./RWUIDialog";

export type RWUIElementProperties = Record<string, any>;

export default abstract class RWUIElement<
    PropertiesType extends RWUIElementProperties
> {
    public constructor(readonly properties: PropertiesType) {}

    abstract render(): Element;
}

export const RWUIElements = {
    [RWUIDialog.elementName]: RWUIDialog.constructor,
};
