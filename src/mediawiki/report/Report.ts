import { MediaWikiAPI, Page, Revision, User } from "rww/mediawiki";
import {
    isEmailReportVenue,
    isPageReportVenue,
    isUserModeReportVenue,
    ReportVenue,
} from "rww/mediawiki/report/ReportVenue";
import i18next from "i18next";
import RedWarnUI from "rww/ui/RedWarnUI";

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
    let undoAction = null;

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

        const comment = i18next.t("mediawiki:summaries.reporting", {
            target: targetString,
        });

        let oldRevision: Revision;
        if (report.venue.section) {
            const section =
                (await targetPage.findSection(report.venue.section)) ??
                (await targetPage.lastSection());

            if (report.venue.location === "prepend")
                oldRevision = Revision.fromEditReponse(
                    await section.prependContent(`${text}\n`, {
                        comment,
                        belowHeader: true,
                    })
                );
            else
                oldRevision = Revision.fromEditReponse(
                    await section.appendContent(`\n${text}`, { comment })
                );
        } else {
            if (report.venue.location === "prepend")
                oldRevision = Revision.fromEditReponse(
                    await targetPage.prependContent(`${text}\n`, { comment })
                );
            else
                oldRevision = Revision.fromEditReponse(
                    await targetPage.appendContent(`\n${text}`, { comment })
                );
        }

        undoAction = {
            text: i18next.t("ui:undo"),
            callback: async () => {
                await oldRevision.restore(
                    i18next.t("mediawiki:summaries.report_undo", {
                        target: targetString,
                    })
                );
                RedWarnUI.Toast.quickShow({
                    content: i18next.t("ui:toasts.undone"),
                });
            },
        };
    } else if (isEmailReportVenue(report.venue)) {
        await MediaWikiAPI.postWithEditToken({
            action: "emailuser",
            target: report.venue.user,
            subject: report.venue.subject
                ? report.venue.subject.replace(/{{{target}}}/g, targetString)
                : undefined,
            text: report.comments,
            ccme: true,
        });
    }

    RedWarnUI.Toast.quickShow({
        content: i18next.t("ui:reporting.done", {
            context: report.venue.type,
        }),
        action: undoAction,
    });
}
