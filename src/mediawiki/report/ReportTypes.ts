import { User } from "rww/mediawiki";

interface ReportBase {
    user: User;
}

interface AIVReport extends ReportBase {
    venue: ReportVenues.AIV;
    reason: string;
}

interface UAAReport {
    venue: ReportVenues.UAA;
    reason: string;
}

interface OSReport {
    venue: ReportVenues.Oversight;
    reason: string;
}

interface TASReport {
    venue: ReportVenues.TrustAndSafety;
    reason: string;
}

interface GLReport {
    venue: ReportVenues.GlobalLocks;
    reason: string;
}
