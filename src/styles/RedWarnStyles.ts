import MaterialStyle from "./material/Material";
import Style from "./Style";

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        RedWarnStyles: Style[];
    }
}

// Do not lazy-load the Material style!
export const DefaultRedWarnStyles = [MaterialStyle];

export default window.RedWarnStyles;
