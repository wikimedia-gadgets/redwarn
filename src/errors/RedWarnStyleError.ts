import Style from "rww/styles/Style";

export class RedWarnStyleMissingError extends Error {
    constructor(styleId: string, message?: string) {
        super(message ?? `The style "${styleId}" could not be found.`);
    }
}

export class RedWarnStyleLoadError extends Error {
    constructor(style: Style, message?: string) {
        super(
            message ??
                `An error ocurred while the style "${style.name}" was loading.`
        );
    }
}
