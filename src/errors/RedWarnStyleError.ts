import Style from "app/styles/Style";
import { RWErrors, RWFormattedError } from "./RWError";

export class StyleMissingError extends RWFormattedError<{ styleId: string }> {
    static readonly code = RWErrors.StyleMissing;
    static readonly message = 'The style "{{styleId}}" could not be found.';
}

export class StyleLoadError extends RWFormattedError<{ style: Style }> {
    static readonly code = RWErrors.StyleMissing;
    static readonly message =
        'An error ocurred while the style "{{style.name}}" was loading.';
}
