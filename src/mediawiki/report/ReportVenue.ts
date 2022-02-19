import { PageIcon } from "rww/ui/definitions/PageIcons";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import i18next from "i18next";
import RedWarnStore from "rww/data/RedWarnStore";
import Log from "rww/data/RedWarnLog";
import RedWarnUI from "rww/ui/RedWarnUI";
import { capitalize } from "rww/util";
import { Page } from "rww/mediawiki";
import { submitReport } from "rww/mediawiki/report/Report";

/**
 * Display locations for a ReportVenue. This uses a bit map, meaning each
 * enum member must occupy a different bit of a number. This puts the
 * theoretical limit of the allowed number of display locations at 64, but
 * not all of it will be used.
 *
 * This enum consists of bit flags.
 */
export enum ReportVenueDisplayLocations {
    None,
    PageIcons = 1 << 0,
    ExtendedOptions = 1 << 1,
    RevertDoneOption = 1 << 2,
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
    notice?: string;
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
    template: never;
}

export function isPageModeReportVenue(obj: any): obj is PageReportVenueMode {
    return obj.mode === ReportVenueMode.Page;
}

export type PageReportVenueTemplate = Record<"user" | "anon", string>;

export interface PageReportVenue extends BaseReportVenue {
    type: "page";
    page: Page;
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
    subject?: string;
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
                displayBitmap |= ReportVenueDisplayLocations[
                    location
                ] as unknown as number;
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

    // Forced conversions due to union type issues.
    if ((venue as any).page)
        (venue as any).page = Page.fromTitle((venue as any).page);
    return Object.assign(venue, {
        display: displayBitmap,
        allowedNamespaces: namespaces,
        mode: ReportVenueMode[
            capitalize(venue.mode) as keyof typeof ReportVenueMode
        ],
    }) as unknown as ReportVenue;
}

export function getReportVenueIcons(): PageIcon[] {
    return RedWarnWikiConfiguration.c.reporting
        .filter(
            (venue) =>
                (venue.display &
                    ReportVenueDisplayLocations.ExtendedOptions) !==
                    0 ||
                (venue.display & ReportVenueDisplayLocations.PageIcons) !== 0
        )
        .map((venue) => {
            return {
                id: "report_" + venue.shortName.replace(/[^A-Z0-9]/gi, "-"),
                name: i18next.t("ui:pageIcons.report", {
                    name: venue.name.includes(" ")
                        ? venue.shortName
                        : venue.name,
                }),
                icon: venue.icon,
                color: venue.color,
                default:
                    (venue.display & ReportVenueDisplayLocations.PageIcons) !==
                    0,
                // Allow all allowed namespaces (all namespaces by default) except special pages.
                visible: () =>
                    !RedWarnStore.isSpecialPage() &&
                    (venue.allowedNamespaces?.includes(
                        RedWarnStore.currentNamespaceID
                    ) ??
                        true),
                async action(): Promise<void> {
                    const report = await new RedWarnUI.ReportingDialog({
                        venue,
                    }).show();
                    if (report != null) await submitReport(report);
                },
            };
        });
}
