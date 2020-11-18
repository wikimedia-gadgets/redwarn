import Style from "./Style";
import MaterialStyle from "./material/Material";

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        RedWarnStyles: Style[];
    }
}

export const DefaultRedWarnStyles = [MaterialStyle];

export default window.RedWarnStyles;
