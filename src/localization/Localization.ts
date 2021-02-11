import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { RW_VERSION_TAG } from "rww/data/RedWarnConstants";
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
    private static assertLanguages(): void {
        if (window.RedWarnLanguages == null) {
            window.RedWarnLanguages = [];
        }
        require("./en-US/RWLEnglish");

        this.cleanLanguages();
    }

    /**
     * Cleans the `RedWarnLanguages` global variable in the event of
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
        this.assertLanguages();
        await i18next.use(LanguageDetector).init({
            fallbackLng: this.fallbackLanguage,
            debug: true,
            returnObjects: true,
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
