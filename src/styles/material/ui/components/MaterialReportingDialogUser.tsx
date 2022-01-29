import { User } from "rww/mediawiki";
import {
    MaterialUserSelect,
    MaterialUserSelectProps
} from "rww/styles/material/ui/components/MaterialUserSelect";
import { h } from "tsx-dom";
import { MaterialReportingDialogChildProps } from "rww/styles/material/ui/MaterialReportingDialog";
import {
    MaterialReportingDialogTarget,
    MaterialReportingDialogTargetProps
} from "rww/styles/material/ui/components/MaterialReportingDialogChild";

class MaterialReportingDialogUser extends MaterialUserSelect {
    constructor(
        readonly props: MaterialUserSelectProps &
            MaterialReportingDialogChildProps
    ) {
        super(props);

        if (this.props.originalUser == null) {
            const relevantUser = mw.config.get("wgRelevantUserName");
            if (relevantUser != null)
                this.props.originalUser = User.fromUsername(relevantUser);
        }
    }

    onPreUserChange(user: User): void {
        // this.props.warnDialog.user = user;
        // this.props.warnDialog.updatePreview();
    }

    async onUserChange(user: User): Promise<void> {
        // Whether or not we populated already.
        // if (user instanceof UserAccount && user.groups.includesGroup("sysop")) {
        //     if (
        //         (await new MaterialAlertDialog({
        //             // TODO i18n
        //             title: i18next.t<string>("ui:warn.risky.title"),
        //             content: (
        //                 <div class={"rw-mdc-riskyWarning"}>
        //                     <b>
        //                         {i18next.t<string>("ui:warn.risky.content")}
        //                     </b>
        //                 </div>
        //             ),
        //             actions: [
        //                 {
        //                     data: "cancel"
        //                 },
        //                 {
        //                     data: "proceed"
        //                 }
        //             ]
        //         }).show()) !== "proceed"
        //     ) {
        //         await this.clearUser(this.lastUser);
        //         return;
        //     }
        // }
    }

    onPostUserChange(user: User): void {
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
        MRDTarget: mrdUserTarget
    });
}
