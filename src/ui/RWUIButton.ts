import RWUIElement from "./RWUIElement";

export interface RWUIButtonProperties {
    text: string,
    action: () => void
}

export default abstract class RWUIButton extends RWUIElement<RWUIButtonProperties> {

    static elementName : "rwButton" = "rwButton";

}