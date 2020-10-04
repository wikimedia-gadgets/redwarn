/* eslint-disable @typescript-eslint/no-unused-vars */

import {RWUIDialog} from "./RWUIDialog";
import RWUIButton from "./RWUIButton";

export default abstract class RWUIElement<PropertiesType extends Record<string, any>> {

    protected constructor(readonly properties : PropertiesType) { }

    abstract render() : Element;
    onAppend(element : Element) : void { /* legitimately nothing */ }

}

export const RWUIElements = {
    [RWUIDialog.elementName]: RWUIDialog,
    [RWUIButton.elementName]: RWUIButton
};