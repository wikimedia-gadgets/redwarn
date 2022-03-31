import type {
    ProtectionLevel,
    ProtectionRequestTarget,
    SerializedWarning,
    SerializedWarningCategories,
    Warning,
    WarningLevel,
    WarningLevelSignature,
} from "app/mediawiki";
import { WarningCategory } from "app/mediawiki";
import type { SerializableRevertOption } from "app/mediawiki/revert/RevertOptions";
import { RevertOption } from "app/mediawiki/revert/RevertOptions";
import { ReportVenue } from "app/mediawiki/report/ReportVenue";

/**
 * This is a configuration file used by RedWarn to provide wiki-specific
 * features and details. Each per-wiki configuration should be stored
 * in `Project:RedWarn/configuration.json` of that wiki, otherwise it
 * will fall back to a generic configuration which does not enable most
 * features of RedWarn.
 *
 * This schema uses the English Wikipedia configuration as an example.
 */
interface WikiConfigurationBase {
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
         * The short name of the report venue to use, as defined in the "reporting"
         * section of the configuration file. This is case insensitive.
         *
         * @example "AIV"
         */
        reportVenue?: string;
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
        vandalismWarning?: string | Warning;
        /**
         * Warning signatures are indicators that a talk page has a warning on
         * it. If a talk page has a warning under the current month that matches
         * a signature, the warning level will be raised to the highest level
         * triggered.
         *
         * @example { "1": { "type": "includes", "substring": "<!--uw:1-->" } }
         */
        signatures?: Record<Exclude<WarningLevel, 0>, WarningLevelSignature[]>;
        /**
         * The available warning categories for this wiki. This aids in categorizing
         * user warnings in the `warnings` array. This is an array of warning category
         * IDs (as used in the array) with their respective labels.
         *
         * @example { "common": { "label": "Common warnings" } }
         */
        categories?: SerializedWarningCategories | WarningCategory[];
        /**
         * A full list of user warnings available on this wiki. This is required to
         * enable user warnings. Each warning contains data about the warning, its
         * template name, and a user-friendly name, along with additional tags for
         * searching.
         */
        warnings: Record<string, SerializedWarning> | Record<string, Warning>;
        /**
         * A list of user group IDs which require an additional confirmation before
         * warning. This is to prevent users from warning administrators or other
         * tenured editors that are defined in the array.
         */
        restrictedGroups?: string[];
    };
    /**
     * Revert options determine the options show to a user when viewing a diff page.
     * If not supplied, this will only show built-in options (which include normal
     * rollback and good-faith reverts).
     */
    revertOptions?:
        | Record<string, SerializableRevertOption>
        | Record<string, RevertOption>;
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
         * Text to use for the duration of protection.
         */
        duration: {
            temporary: string;
            indefinite: string;
        };
        /**
         * Display information for deprotection.
         */
        unprotect?: Omit<ProtectionLevel, "id">;
        /**
         * Levels of protection available on this wiki. If this is not supplied, protection
         * level detection will be disabled and no option will be provided to target specific
         * protection levels when requesting page protection.
         */
        levels?: ProtectionLevel[];
        /**
         * Target pages for page protection requests.
         */
        requests:
            | ProtectionRequestTarget
            | Record<"increase" | "decrease", ProtectionRequestTarget>;
        /**
         * Built-in reasons for page protection. If this is not supplied, the wiki's protection
         * options will be used instead (MediaWiki:Protect-dropdown).
         */
        reasons?: string[] | Record<string, string[]>;
    };
    /**
     * Possible reporting venues on a given wiki. This can support noticeboard venues
     * (such as Project-namespace pages which can be seen by the public) or user
     * email venues (such as role accounts which forward emails to a private list).
     */
    reporting: ReportVenue[];
}

export default WikiConfigurationBase;
