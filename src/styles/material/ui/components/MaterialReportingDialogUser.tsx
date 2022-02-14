import { User, UserAccount } from "rww/mediawiki";
import {
    MaterialUserSelect,
    MaterialUserSelectProps
} from "rww/styles/material/ui/components/MaterialUserSelect";
import { h } from "tsx-dom";
import {
    MaterialReportingDialogTarget,
    MaterialReportingDialogTargetProps
} from "rww/styles/material/ui/components/MaterialReportingDialogChild";
import MaterialAlertDialog from "rww/styles/material/ui/MaterialAlertDialog";
import i18next from "i18next";
import { isUserModeReportVenue } from "rww/mediawiki/report/ReportVenue";

class MaterialReportingDialogUser extends MaterialUserSelect {
    constructor(
        readonly props: MaterialUserSelectProps &
            MaterialReportingDialogTargetProps<User>
    ) {
        super(props);

        this.props.originalUser = this.props.originalTarget;
        if (this.props.originalUser == null) {
            const relevantUser = mw.config.get("wgRelevantUserName");
            if (relevantUser != null)
                this.props.originalUser = User.fromUsername(relevantUser);
        }
    }

    onPreUserChange(user: User): void {
        this.props.reportingDialog.target = user;
        this.props.reportingDialog.uiValidate();
    }

    async onUserChange(user: User): Promise<void> {
        // Whether or not we populated already.
        let group;
        if (
            user instanceof UserAccount &&
            isUserModeReportVenue(this.props.reportingDialog.venue) &&
            (group = user.groups.groupMatch(
                this.props.reportingDialog.venue.restrictedGroups
            ))
        ) {
            if (
                (await new MaterialAlertDialog({
                    title: i18next.t<string>("ui:reporting.restricted.title"),
                    content: (
                        <div class={"rw-mdc-riskyWarning"}>
                            <b>
                                {i18next.t<string>(
                                    "ui:reporting.restricted.text",
                                    {
                                        group: group.displayName
                                    }
                                )}
                            </b>
                        </div>
                    ),
                    actions: [
                        {
                            data: "cancel"
                        },
                        {
                            data: "proceed"
                        }
                    ]
                }).show()) !== "proceed"
            ) {
                await this.clearUser(this.lastUser);
                return;
            }
        }
    }

    onPostUserChange(): void {
        // Validate
        // this.props.reportingDialog.uiValidate();
    }
}

export { MaterialReportingDialogUser as MaterialReportingDialogUserController };
export default function generator(
    props: MaterialReportingDialogTargetProps<User>
): MaterialReportingDialogTarget {
    const mrdUserTarget = new MaterialReportingDialogUser(props);
    return Object.assign(mrdUserTarget.render(), {
        MRDTarget: mrdUserTarget,
        valid: () => mrdUserTarget.user != null
    });
}