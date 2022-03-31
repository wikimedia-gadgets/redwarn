import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { RW_VERSION_TAG } from "app/data/RedWarnConstants";
import RedWarnLanguage from "./RedWarnLanguage";

declare global {
    interface Window {
        RedWarnLanguages: RedWarnLanguage[];
    }
}

export default class Localization {
    public static readonly fallbackLanguage = "en-US";

    /**
     * Asserts the existence of the global `RedWarnLanguages` array,
     * along with inserting the default English pack as a fallback.
     * @private
     */
    private static async assertLanguages(): Promise<void> {
        if (window.RedWarnLanguages == null) {
            window.RedWarnLanguages = [];
        }
        await import("./lang/en-US/RWLEnglish");

        Localization.cleanLanguages();
    }

    /**
     * Cleans the `RedWarnLanguages` global variable in the events of
     * a language pack double-load.
     * @private
     */
    private static cleanLanguages(): void {
        // Prevent duplicate language packs.
        const loadedLanguages: string[] = [];
        for (const language of window.RedWarnLanguages) {
            if (!loadedLanguages.includes(language.id)) {
                loadedLanguages.push(language.id);
            }
        }
    }

    /**
     * Initialize the localization handler.
     */
    public static async init(): Promise<void> {
        await Localization.assertLanguages();
        await i18next.use(LanguageDetector).init({
            fallbackLng: Localization.fallbackLanguage,
            debug: process.env.NODE_ENV !== "production",
            returnObjects: true,
            interpolation: {
                escapeValue: false,
                format: function (value, format, lang) {
                    const getVariationOfAOrAn = function (
                        value: string,
                        capitalize: boolean
                    ) {
                        const letters = ["a", "e", "i", "o", "u", "h"];
                        const firstLetter = value.substring(0, 1);
                        let correctWordForm: string;
                        if (
                            letters.find(function (l) {
                                return firstLetter === l;
                            })
                        ) {
                            correctWordForm = capitalize ? "An" : "an";
                        } else {
                            correctWordForm = capitalize ? "A" : "a";
                        }

                        return correctWordForm;
                    };

                    if (format === "en-handle-an")
                        return !lang || lang.startsWith("en")
                            ? getVariationOfAOrAn(value, false)
                            : "";
                    if (format === "en-handle-an-capitalized")
                        return !lang || lang.startsWith("en")
                            ? getVariationOfAOrAn(value, true)
                            : "";

                    return value;
                },
            },
        });

        // Register all namespaces from all languages.
        for (const language of window.RedWarnLanguages) {
            for (const namespace of Object.keys(language.namespaces)) {
                i18next.addResourceBundle(
                    language.tag,
                    namespace,
                    language.namespaces[namespace],
                    true
                );
            }
            i18next.addResource(
                language.tag,
                "common",
                "redwarn.version",
                RW_VERSION_TAG
            );
        }
    }
}
