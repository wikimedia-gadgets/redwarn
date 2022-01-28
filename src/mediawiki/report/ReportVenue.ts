// Bit flags
import { PageIcon } from "rww/ui/definitions/PageIcons";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import i18next from "i18next";
import RedWarnStore from "rww/data/RedWarnStore";
import Log from "rww/data/RedWarnLog";
import RedWarnUI from "rww/ui/RedWarnUI";

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

interface BaseReportVenue {
    type: string;
    name: string;
    shortName?: string;
    icon: string;
    color?: string;
    userspaceOnly?: boolean;
    display: ReportVenueDisplayLocations;
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

export interface MediaWikiEmailReportVenue extends BaseReportVenue {
    type: "email";
    user: string;
}

export type ReportVenue = PageReportVenue | MediaWikiEmailReportVenue;

export type SerializableReportVenue = Omit<ReportVenue, "display"> & {
    display: string[];
};

export function deserializeReportVenue(
    venue: SerializableReportVenue
): ReportVenue {
    let displayBitmap = ReportVenueDisplayLocations.None;

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

    // Forced conversion due to union type issues.
    return (Object.assign(venue, {
        display: displayBitmap
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
            // Require explicit false for `venue.userspaceOnly`
            visible:
                venue.userspaceOnly === false
                    ? () => !RedWarnStore.isSpecialPage()
                    : RedWarnStore.isUserspacePage,
            action(): void {
                Log.info("venue", venue);
                new RedWarnUI.ReportingDialog({ venue }).show();
            }
        };
    });
}
