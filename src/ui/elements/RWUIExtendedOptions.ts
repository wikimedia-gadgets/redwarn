import RWUIElement from "./RWUIElement";
import { BaseProps } from "tsx-dom";

export class RWUIExtendedOptions extends RWUIElement {
    public static readonly elementName = "rwExtendedOptions";

    constructor(readonly props: BaseProps) {
        super();
    }

    /**
     * Renders the ExtendedOptions.
     */
    render(): JSX.Element {
        throw new Error("Attempted to call abstract method");
    }
}
