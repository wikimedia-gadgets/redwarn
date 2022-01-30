import { MediaWikiAPI, Page, User } from "rww/mediawiki";
import {
    isEmailReportVenue,
    isPageReportVenue,
    isUserModeReportVenue,
    ReportVenue
} from "rww/mediawiki/report/ReportVenue";

export interface Report {
    target: Page | User;
    reason?: string;
    comments?: string;
    venue: ReportVenue;
}

export async function submitReport(report: Report): Promise<void> {
    const targetString =
        report.target instanceof User
            ? report.target.username
            : report.target.title.getPrefixedText();

    if (isPageReportVenue(report.venue)) {
        const targetPage = report.venue.page;

        const template =
            typeof report.venue.template === "string"
                ? // If there is only one template.
                  report.venue.template
                : isUserModeReportVenue(report.venue) &&
                  report.target instanceof User
                ? // If there is a template for anon/not anon users.
                  report.venue.template[
                      mw.util.isIPAddress(report.target.username)
                          ? "anon"
                          : "user"
                  ]
                : // Default to the first template.
                  Object.values(report.venue.template)[0];
        const targetString =
            report.target instanceof User
                ? report.target.username
                : report.target.title.getPrefixedText();
        const text = template
            .replace(/{{{target}}}/g, targetString)
            .replace(
                /{{{reason}}}\.?/g,
                report.reason ? `'''${report.reason}'''` : ""
            )
            .replace(/{{{comments}}}\.?/g, report.comments ?? "");

        if (report.venue.section) {
            const section =
                (await targetPage.findSection(report.venue.section)) ??
                (await targetPage.lastSection());

            if (report.venue.location === "prepend")
                await section.prependContent(text, { belowHeader: true });
            if (report.venue.location === "append")
                await section.appendContent(text);
        } else {
            if (report.venue.location === "prepend")
                await targetPage.prependContent(text);
            if (report.venue.location === "append")
                await targetPage.appendContent(text);
        }
    } else if (isEmailReportVenue(report.venue)) {
        await MediaWikiAPI.postWithEditToken({
            action: "emailuser",
            target: report.venue.user,
            subject: report.venue.subject
                ? report.venue.subject.replace(/{{{target}}}/g, targetString)
                : undefined,
            text: report.comments,
            ccme: true
        });
    }
}
