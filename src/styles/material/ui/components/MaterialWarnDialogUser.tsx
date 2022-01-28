import { MaterialWarnDialogChildProps } from "rww/styles/material/ui/MaterialWarnDialog";
import { User } from "rww/mediawiki";
import {
    MaterialUserSelect,
    MaterialUserSelectProps
} from "rww/styles/material/ui/components/MaterialUserSelect";

export class MaterialWarnDialogUser extends MaterialUserSelect {
    constructor(
        readonly props: MaterialUserSelectProps & MaterialWarnDialogChildProps
    ) {
        super(props);
    }

    onUserChange(user: User): PromiseOrNot<void> {
        this.props.warnDialog.user = user;
        this.props.warnDialog.updatePreview();
    }

    onPostUserChange(user: User): PromiseOrNot<void> {
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
