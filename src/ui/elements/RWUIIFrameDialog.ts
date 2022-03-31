import { Dependency } from "app/data/Dependencies";
import {
    RWUIDialog,
    RWUIDialogAction,
    RWUIDialogProperties,
} from "app/ui/elements/RWUIDialog";

export interface RWUIIFrameDialogProps extends RWUIDialogProperties {
    /**
     * The height of the dialog in whatever CSS unit specified.
     */
    height?: string;
    src: string;
    fragment?: string;
    dependencies?: Dependency[];
    customStyle?: string | string[];
    customScripts?: string | string[];
    actions?: RWUIDialogAction[];

    /**
     * Whether or not to disable RedWarn in the IFrame. This is intended
     * for events where a MediaWiki page of the same wiki is loaded, causing
     * the RedWarn userscript to load as well.
     *
     * This should always append the `rw-disable` class onto the body.
     */
    disableRedWarn?: boolean;
}

export class RWUIIFrameDialog extends RWUIDialog<void> {
    show(): Promise<any> {
        throw new Error("Attempted to call abstract method");
    }
    render(): HTMLDialogElement {
        throw new Error("Attempted to call abstract method");
    }

    public static readonly elementName = "rwIFrameDialog";

    constructor(readonly props: RWUIIFrameDialogProps) {
        super(props);
    }
}
