import {
    Page,
    RevertContext,
    User,
    Warning,
    WarningOptions,
} from "rww/mediawiki";
import { RWUIDialog, RWUIDialogProperties } from "rww/ui/elements/RWUIDialog";

export interface RWUIWarnDialogProps extends RWUIDialogProperties {
    rollbackContext?: RevertContext;
    targetUser?: User;
    defaultWarnReason?: Warning;
    defaultWarnLevel?: number;
    relatedPage?: Page;
}

export class RWUIWarnDialog extends RWUIDialog {
    show(): Promise<WarningOptions> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwWarnDialog";

    constructor(readonly props: RWUIWarnDialogProps) {
        super(props);
    }

    protected _result: WarningOptions;
}
