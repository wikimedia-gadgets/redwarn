/* eslint-disable @typescript-eslint/no-unused-vars */

// TODO @chlod
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RWUIElementProperties {}

/**
 * The RWUIElement is the basis of all elements used by RedWarn. The idea behind
 * RWUIElement is to standardize UI elements (buttons, radios, sliders, etc.)
 * while also making a system flexible enough to handle styling and custom
 * elements.
 */
export default abstract class RWUIElement {
    /**
     * Renders the element.
     */
    abstract render(): Element;
}
