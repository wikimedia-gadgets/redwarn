import { MaterialWarnDialogChildProps } from "rww/styles/material/ui/MaterialWarnDialog";
import { User, UserAccount } from "rww/mediawiki";
import {
    MaterialUserSelect,
    MaterialUserSelectProps
} from "rww/styles/material/ui/components/MaterialUserSelect";
import MaterialAlertDialog from "rww/styles/material/ui/MaterialAlertDialog";
import i18next from "i18next";
import { h } from "tsx-dom";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";

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
        if (user instanceof UserAccount) {
            const restrictedGroupMatch = user.groups.groupMatch(
                RedWarnWikiConfiguration.c.warnings.restrictedGroups ?? []
            );

            if (restrictedGroupMatch == null) return;

            if (
                (await new MaterialAlertDialog({
                    title: i18next.t<string>("ui:warn.risky.title"),
                    content: (
                        <div class={"rw-mdc-riskyWarning"}>
                            <b>
                                {i18next.t<string>("ui:warn.risky.content", {
                                    group: restrictedGroupMatch.displayName
                                })}
                            </b>
                        </div>
                    ),
                    actions: [
                        {
                            // TODO i18n
                            data: "cancel"
                        },
                        {
                            // TODO i18n
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
        if (user.warningAnalysis != null) {
            // Update default warning level of the reason component.
            this.props.warnDialog.mwdReason.MWDReason.defaultLevel =
                user.warningAnalysis.level > 3
                    ? 4
                    : user.warningAnalysis.level + 1;
        }

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
