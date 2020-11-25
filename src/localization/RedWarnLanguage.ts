interface RedWarnLanguageMeta {
    /**
     * The name of the language pack.
     */
    name: string;

    /**
     * The translators of the language pack.
     */
    translators: string[];

    /**
     * The license of the language pack.
     */
    license: string | { url: string; text: string };

    /**
     * The version code of the language pack.
     */
    version: string;

    /**
     * The links associated with this lanaguge pack, which may include its
     * wiki page, repository, or documentation page.
     */
    links: { [key: string]: string };
}

/**
 * A RedWarn Language Pack, composed of translation keys and strings,
 * including metadata about the pack itself.
 *
 * All language packs should be loaded by `preInit`, as language
 * initialization happens in the `init` loading stage.
 */
interface RedWarnLanguage {
    /**
     * The IETF language tag for this language.
     */
    tag: string;

    /**
     * The ID for this language pack, used to differentiate packs
     * with the same IETF language tag.
     *
     * This can be anything you want (as long as this does not
     * conflict with other packs), so be creative.
     */
    id: string;

    /**
     * Metadata for this language pack.
     */
    meta: Partial<RedWarnLanguageMeta>;

    /**
     * Translation strings.
     */
    namespaces: Record<string, Record<string, any>>;
}

export default RedWarnLanguage;
