/**
 * A protection level provided by the wiki, used in protection level detection
 * and page protection requests.
 */
export interface ProtectionLevel {
    /**
     * The name of this protection level.
     *
     * @example semi-protection
     */
    name: string;
    /**
     * A string denoting the status of a page under this protection level.
     *
     * @example semi-protected
     */
    statusName: string;
    /**
     * The restriction group of this protection level, as defined by the MediaWiki
     * wiki configuration. If this level pertains to the pseudo-level given by
     * FlaggedRevs, this value should be set to `_flaggedrevs`.
     *
     * @example ["autoconfirmed", "_flaggedrevs"]
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
