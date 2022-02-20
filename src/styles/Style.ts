import { RedWarnHook, RedWarnHookEventTypes } from "rww/event/RedWarnHookEvent";
import { Dependency } from "rww/data/Dependencies";
import { RWUIElements } from "rww/ui/RedWarnUI";
import i18next from "i18next";

type URLString = string;

interface Style {
    name: string;
    version: string;

    // Mapped by language.
    meta?: {
        [key: string]: {
            displayName?: string;
            description?: string;
            author?: string | string[]; // Must be wiki usernames

            homepage?: URLString; // URL

            repository?: URLString; // URL
            issues?: URLString; // URL

            banner?: URLString; // URL of Image
        };
    };

    dependencies?: Dependency[];
    storage?: Record<string, any>;

    classMap: {
        [T in keyof typeof RWUIElements]: typeof RWUIElements[T];
    };

    hooks?: { [key in RedWarnHookEventTypes]?: RedWarnHook[] };
}

export default Style;

export abstract class StyleStorage {}

export function getStyleMeta(style: Style): Style["meta"][string] {
    return (
        style.meta[i18next.language ?? "en-US"] ??
        style.meta["en-US"] ??
        Object.values(style.meta)[0]
    );
}
