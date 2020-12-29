import MaterialStyle from "./material/Material";
import Style from "./Style";

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        RedWarnStyles: Style[];
    }
}

export const DefaultRedWarnStyles = [MaterialStyle];

export default window.RedWarnStyles;
