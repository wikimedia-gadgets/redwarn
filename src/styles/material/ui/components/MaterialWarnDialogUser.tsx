import { MaterialWarnDialogChildProps } from "rww/styles/material/ui/MaterialWarnDialog";
import { User, UserAccount } from "rww/mediawiki";
import {
    MaterialUserSelect,
    MaterialUserSelectProps
} from "rww/styles/material/ui/components/MaterialUserSelect";
import MaterialAlertDialog from "rww/styles/material/ui/MaterialAlertDialog";
import i18next from "i18next";
import { h } from "tsx-dom";

export class MaterialWarnDialogUser extends MaterialUserSelect {
    constructor(
        readonly props: MaterialUserSelectProps & MaterialWarnDialogChildProps
    ) {
        super(props);
    }

    onPreUserChange(user: User): void {
        this.props.warnDialog.user = user;
        this.props.warnDialog.updatePreview();
    }

    async onUserChange(user: User): Promise<void> {
        // Whether or not we populated already.
        if (user instanceof UserAccount && user.groups.includesGroup("sysop")) {
            if (
                (await new MaterialAlertDialog({
                    // TODO i18n
                    title: i18next.t("ui:warn.risky.title").toString(),
                    content: (
                        <div class={"rw-mdc-riskyRevert"}>
                            <b>
                                {i18next.t("ui:warn.risky.content").toString()}
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

    onPostUserChange(user: User): void {
        // Update default warning level of the reason component.
        this.props.warnDialog.mwdReason.MWDReason.defaultLevel =
            user.warningAnalysis.level > 3 ? 4 : user.warningAnalysis.level + 1;

        // Validate
        this.props.warnDialog.uiValidate();
    }
}

export { MaterialWarnDialogUser as MaterialWarnDialogUserController };
export default function generator(
    props: MaterialWarnDialogChildProps & { originalUser?: User }
): JSX.Element & { MWDUser: MaterialWarnDialogUser } {
    const mwdUser = new MaterialWarnDialogUser(props);
    return Object.assign(mwdUser.render(), {
        MWDUser: mwdUser
    });
}
