// Bit flags
import { PageIcon } from "rww/ui/definitions/PageIcons";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import i18next from "i18next";
import RedWarnStore from "rww/data/RedWarnStore";
import Log from "rww/data/RedWarnLog";
import RedWarnUI from "rww/ui/RedWarnUI";
import { capitalize } from "rww/util";

/**
 * Display locations for a ReportVenue. This uses a bit map, meaning each
 * enum member must occupy a different bit of a number. This puts the
 * theoretical limit of the allowed number of display locations at 64, but
 * not all of it will be used.
 */
export enum ReportVenueDisplayLocations {
    None,
    PageOptions = 1 << 0,
    ExtendedOptions = 1 << 1,
}

export enum ReportVenueMode {
    Page,
    User,
}

interface BaseReportVenue {
    name: string;
    shortName?: string;
    icon: string;
    color?: string;
    allowedNamespaces: number[];
    display: ReportVenueDisplayLocations;

    mode: ReportVenueMode;
    type: string;
}

interface UserReportVenueMode extends BaseReportVenue {
    mode: ReportVenueMode.User;
    /**
     * A list of user group IDs which require an additional confirmation before
     * warning. This is to prevent users from warning administrators or other
     * tenured editors that are defined in the array.
     */
    restrictedGroups?: string[];
}

export function isUserModeReportVenue(obj: any): obj is UserReportVenueMode {
    return obj.mode === ReportVenueMode.User;
}

interface PageReportVenueMode extends BaseReportVenue {
    mode: ReportVenueMode.Page;
}

export function isPageModeReportVenue(obj: any): obj is PageReportVenueMode {
    return obj.mode === ReportVenueMode.Page;
}

export type PageReportVenueTemplate = Record<"user" | "anon", string>;

export interface PageReportVenue extends BaseReportVenue {
    type: "page";
    page: string;
    template: string | PageReportVenueTemplate;
    section?: number | string;
    location?: "prepend" | "append";
    defaultReasons?: string[];
}

export function isPageReportVenue(obj: any): obj is PageReportVenue {
    return obj.type === "page";
}

export interface MediaWikiEmailReportVenue extends BaseReportVenue {
    type: "email";
    user: string;
    prefill?: string;
}

export function isEmailReportVenue(obj: any): obj is MediaWikiEmailReportVenue {
    return obj.type === "email";
}

export type ModalReportVenue = PageReportVenueMode | UserReportVenueMode;
export type TypedReportVenue = PageReportVenue | MediaWikiEmailReportVenue;
export type ReportVenue = ModalReportVenue & TypedReportVenue;

export type SerializableReportVenue = Omit<
    ReportVenue,
    "display" | "number" | "mode"
> & {
    /**
     * A list of allowed display areas. Can contain the following values:
     * `pageOptions`, `extendedOptions`.
     */
    display: string[];
    /**
     * The allowed namespaces. If this is a built-in MediaWiki namespace,
     * you may supply the non-localized (English) namespace name. If not,
     * the namespace ID or exact namespace name must be used.
     */
    allowedNamespaces: (string | number)[];
    /**
     * Whether reporting to this venue will report a page or a user.
     */
    mode: "page" | "user";
};

export function deserializeReportVenue(
    venue: SerializableReportVenue
): ReportVenue {
    let displayBitmap = ReportVenueDisplayLocations.None;
    // Null by default (to allow all namespaces except virtual namespaces)
    let namespaces: number[] = null;

    for (const _displayLocation of venue.display) {
        const displayLocation = _displayLocation.toLowerCase();
        for (const location in ReportVenueDisplayLocations) {
            if (location === "none" || typeof location === "number") continue;

            if (displayLocation === location.toLowerCase()) {
                displayBitmap |= (ReportVenueDisplayLocations[
                    location
                ] as unknown) as number;
            }
        }
    }

    for (const namespace of venue.allowedNamespaces ?? []) {
        // Instantiate if null.
        if (namespaces == null) namespaces = [];

        if (typeof namespace === "number") namespaces.push(namespace);
        else {
            const namespaceId = RedWarnStore.getNamespaceId(namespace);
            if (namespaceId) namespaces.push(namespaceId);
            else Log.warn(`Namespace not found: ${namespace}`);
        }
    }

    if (venue.mode == null) throw new Error("Venue mode must be a valid mode.");

    // Forced conversion due to union type issues.
    return (Object.assign(venue, {
        display: displayBitmap,
        allowedNamespaces: namespaces,
        mode:
            ReportVenueMode[
                capitalize(venue.mode) as keyof typeof ReportVenueMode
            ]
    }) as unknown) as ReportVenue;
}

export function getReportVenueIcons(): PageIcon[] {
    return RedWarnWikiConfiguration.c.reporting.map((venue) => {
        return {
            id: "report_" + venue.shortName.replace(/[^A-Z0-9]/gi, "-"),
            name: i18next.t("ui:pageIcons.report", {
                name: venue.name.includes(" ") ? venue.shortName : venue.name
            }),
            icon: venue.icon,
            color: venue.color,
            // Allow all allowed namespaces (all namespaces by default) except special pages.
            visible: () =>
                !RedWarnStore.isSpecialPage() &&
                (venue.allowedNamespaces?.includes(
                    RedWarnStore.currentNamespaceID
                ) ??
                    true),
            action(): void {
                Log.info("venue", venue);
                new RedWarnUI.ReportingDialog({ venue }).show();
            }
        };
    });
}
