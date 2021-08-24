import type {
    SerializedWarning,
    SerializedWarningCategories,
    WarningLevel,
    WarningLevelSignature
} from "rww/mediawiki";
import type { SerializableRevertOption } from "rww/data/RevertOptions";

/**
 * This is a configuration file used by RedWarn to provide wiki-specific
 * features and details. Each per-wiki configuration should be stored
 * in `Project:RedWarn/configuration.json` of that wiki, otherwise it
 * will fall back to a generic configuration which does not enable most
 * features of RedWarn.
 *
 * This schema uses the English Wikipedia configuration as an example.
 */
interface RawWikiConfiguration {
    /**
     * The config version specifies the current version of this configuration
     * file. RedWarn will try to upgrade outdated configuration files based
     * on this number.
     *
     * @example 1
     */
    configVersion: number;
    /**
     * The wiki ID for this wiki. This is used to determine whether or not
     * this configuration does not belong to the wiki where RedWarn is
     * running. This should be equal to the `wgWikiID` MediaWiki configuration
     * constant.
     *
     * @example "enwiki"
     */
    wiki: string;
    /**
     * Metadata regarding connections to RedWarn on this wiki. This can be omitted
     * if all values are default.
     */
    meta?: {
        /**
         * The RedWarn tag. This must be a valid page tag name in Special:Tags.
         * Setting this to an improper value will make all RedWarn edits fail
         * to save.
         *
         * @example "RedWarn"
         */
        tag?: string;
        /**
         * The link to the local RedWarn documentation page. This is used in all
         * edit summaries. If this is being used in a Wikimedia Foundation wiki,
         * this value is usually set to `[[w:en:WP:RW|RedWarn]]`. This may differ
         * for other wikis, such as Fandom wikis, which might use
         * `[[wikipedia:WP:RW|RedWarn]]` instead. If your wiki has a local page
         * for this, you can set this to `[[Project:RedWarn]]` or a similar page.
         *
         * @example "[[w:en:WP:RW|RedWarn]]"
         */
        link: string;
    };
    /**
     * Configures every available user warning on this wiki. This requires working
     * user warning templates, along with special metadata to classify warnings
     * properly.
     */
    warnings?: {
        /**
         * A template used to inform anonymous editors that the warning received
         * may not be for them. This is appended on a new line after the actual
         * warning template.
         *
         * @example "{{subst:Shared IP advice}}"
         */
        ipAdvice?: string | null;
        /**
         * The warning template for vandalism edits. This is used by reverts done
         * on a user's contributions page. If unavailable, contributions rollbacks
         * will instead bear a summary of "Possible vandalism" in the user's set
         * language. This value refers to the ID of a warning found in the `warnings`
         * array.
         *
         * @example "vandalism"
         */
        vandalismWarning?: string;
        /**
         * Warning signatures are indicators that a talk page has a warning on
         * it. If a talk page has a warning under the current month that matches
         * a signature, the warning level will be raised to the highest level
         * triggered.
         *
         * @TJS-example { "1": { "type": "includes", "substring": "<!--uw:1-->" } }
         */
        signatures?: Record<Exclude<WarningLevel, 0>, WarningLevelSignature[]>;
        /**
         * The available warning categories for this wiki. This aids in categorizing
         * user warnings in the `warnings` array. This is an array of warning category
         * IDs (as used in the array) with their respective labels.
         *
         * @TJS-example { "common": { "label": "Common warnings" } }
         */
        categories?: SerializedWarningCategories;
        /**
         * A full list of user warnings available on this wiki. This is required to
         * enable user warnings. Each warning contains data about the warning, its
         * template name, and a user-friendly name, along with additional tags for
         * searching.
         */
        warnings: Record<string, SerializedWarning>;
    };
    /**
     * Revert options determine the options show to a user when viewing a diff page.
     * If not supplied, this will only show built-in options (which include normal
     * rollback and good-faith reverts).
     */
    revertOptions?: Record<string, SerializableRevertOption>;
    /**
     * Protection options facilitates page protection requests for wikis which allow
     * page protection requests. This also enables support for wikis which have FlaggedRevs,
     * such as some Wikimedia Foundation wikis. If not supplied, page protection requests
     * will be disabled.
     */
    protection?: {
        /**
         * Whether or not this wiki is using the FlaggedRevs extension. If set to true,
         * a special level in `levels` must be supplied with the ID `_flaggedrevs`.
         *
         * @default false
         */
        flaggedrevs?: boolean;
        /**
         * Levels of protection available on this wiki. If this is not supplied, protection
         * level detection will be disabled and no option will be provided to target specific
         * protection levels when requesting page protection.
         */
        levels?: ProtectionLevel[];
        /**
         * Target pages for page protection requests.
         */
        requests: Record<"increase" | "decrease", PageProtectionRequestTarget>;
    };
}

// TODO: Move to dedicated class.
/**
 * A page or section where page protection requests will be added.
 */
interface PageProtectionRequestTarget {
    /**
     * The target page to add to.
     *
     * @TJS-example Wikipedia:Requests for page protection/Increase
     */
    page: string;
    /**
     * The target section ID to add to. If each request adds a new level
     * 2 heading, this value should be set to "new".
     */
    section?: number | "new";
    /**
     * The wikitext to add to the target page/section.
     */
    template: string;
    /**
     * Whether or not the content will be appended or prepended to the
     * target page/section.
     *
     * @default "prepend"
     */
    method?: "append" | "prepend";
    /**
     * The amount of new lines to add before/after each request when
     * appending/prepending, respectively.
     *
     * @default 0
     */
    extraLines: 0;
}

// TODO: Move to dedicated class.
/**
 * A protection level provided by the wiki, used in protection level detection
 * and page protection requests.
 */
interface ProtectionLevel {
    /**
     * The name of this protection level.
     *
     * @TJS-example semi-protection
     */
    name: string;
    /**
     * A string denoting the status of a page under this protection level.
     *
     * @TJS-example semi-protected
     */
    statusName: string;
    /**
     * The restriction group of this protection level, as defined by the MediaWiki
     * wiki configuration. If this level pertains to the pseudo-level given by
     * FlaggedRevs, this value should be set to `_flaggedrevs`.
     *
     * @TJS-example ["autoconfirmed", "_flaggedrevs"]
     */
    id: string;
    /**
     * Whether or not this can be used as a target protection level when requesting
     * page protection.
     *
     * @default true
     */
    requestable?: boolean;
}

export default RawWikiConfiguration;
