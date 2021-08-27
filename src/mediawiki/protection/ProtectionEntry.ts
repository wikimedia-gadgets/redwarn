interface ProtectionEntryBase {
    /**
     * Protection level for this entry. Value comes from $wgRestrictionLevels.
     */
    level: string;
    /**
     * Expiry of this entry, either as an ISO-8601 string or "infinity".
     */
    expiry: Date | "infinity";
}

interface MediaWikiProtectionEntry extends ProtectionEntryBase {
    /**
     * Dependent on $wgRestrictionTypes.
     */
    type: "edit" | "move" | "create" | "upload" | string;
    /**
     * Only set if this entry is cascading.
     */
    cascade?: "";
    /**
     * If the protection was cascaded from a different page, this value is set
     * to the page originally protected.
     */
    source?: string;
}

interface FlaggedRevsProtectionEntry extends ProtectionEntryBase {
    type: "_flaggedrevs";
}

type ProtectionEntry = MediaWikiProtectionEntry | FlaggedRevsProtectionEntry;
export default ProtectionEntry;

export function isFlaggedRevsProtectionEntry(
    entry: ProtectionEntry
): entry is FlaggedRevsProtectionEntry {
    return entry.type === "_flaggedrevs";
}
