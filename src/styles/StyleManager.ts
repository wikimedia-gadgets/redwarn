import semanticDifference from "rww/util/semanticDifference";
import { DefaultRedWarnStyles } from "./RedWarnStyles";
import Style from "./Style";
import { DefaultRedWarnStyle } from "rww/styles/StyleConstants";
import { RedWarnStyleMissingError } from "rww/errors/RedWarnStyleError";
import Dependencies from "rww/data/Dependencies";

export default class StyleManager {
    public static get defaultStyle(): string {
        return DefaultRedWarnStyle;
    }

    public static ready = false;

    static get styles(): Style[] {
        return window.RedWarnStyles;
    }

    static set styles(newStyles: Style[]) {
        window.RedWarnStyles = newStyles;
    }

    // Restrict `activeStyle` to a private setter.
    private static _activeStyle: Style;
    static get activeStyle(): Style {
        return this._activeStyle;
    }

    static async initialize(): Promise<void> {
        if (this.styles == null) {
            this.styles = DefaultRedWarnStyles;
        } else {
            this.styles.push(...DefaultRedWarnStyles);
            this.cleanStyles();
        }

        this._activeStyle = this.findStyle(this.defaultStyle);

        if (this._activeStyle == null) {
            mw.notify(
                "RedWarn styles loading failed. You might have loaded no styles at all."
            );
        } else {
            await Dependencies.resolve([StyleManager.activeStyle.dependencies]);
            this.ready = true;
        }
    }

    static setStyle(id: string): Style {
        const foundStyle = this.findStyle(id);
        if (foundStyle == null) throw new RedWarnStyleMissingError(id);
        return foundStyle;
    }

    static findStyle(id: string): Style | null {
        return this.styles.find((v) => v.name === id) ?? null;
    }

    static cleanStyles(): void {
        let finalStyles = this.styles;

        for (const style of this.styles) {
            // Metadata checks

            if (style.name == null) {
                mw.notify("Found unnamed style. Skipping.");
                continue;
            } else if (style.version == null) {
                mw.notify("Found non-versioned style. Skipping.");
                continue;
            }

            // Version collision checking
            const styleVersions: Record<string, Style> = {};

            if (styleVersions[style.name] == null) {
                styleVersions[style.name] = style;
            } else {
                // -1 means the style being loaded is older than the current.
                // 0 means they styles are of the same version.
                // 1 means they style being loaded is newer than the current.
                switch (
                    semanticDifference(
                        style.version,
                        styleVersions[style.name].version
                    )
                ) {
                    case -1:
                        mw.notify(
                            `Older version of style "${style.name}" (${style.version}) found. Skipping.`
                        );
                        break;
                    case 0:
                        mw.notify(
                            `Same version of style "${style.name}" (${style.version}). Make sure you're not loading a style twice.`
                        );
                        break;
                    case 1:
                        mw.notify(
                            `Newer version of style "${style.name}" (${
                                style.version
                            }) found. Discarding old version (${
                                styleVersions[style.name].version
                            }).`
                        );
                        styleVersions[style.name] = style;
                        break;
                }
            }

            // Check
            finalStyles = Object.values(styleVersions);
        }

        this.styles = finalStyles;
    }
}
