import RWUIElement from "app/ui/elements/RWUIElement";
import {
    DiffIconRevertContext,
    RestoreStage,
    RevertStage,
    Revision,
} from "app/mediawiki";
import { BaseProps } from "tsx-dom";
import RWErrorBase from "app/errors/RWError";

export type RWUIDiffIconsProperties = Pick<
    DiffIconRevertContext,
    "oldRevision" | "newRevision" | "latestRevision"
> & {
    side: "old" | "new";
};

/**
 * The RWUIDiffIcons are icons that are displayed on a diff page. Since they are injected
 * into the DOM upon loading, these icons are wrapped by a container, regardless of whether
 * or not the element already provides one. This container is accessible with the ID
 * `#rwDiffIcons`.
 */
export class RWUIDiffIcons
    extends RWUIElement
    implements RWUIDiffIconsProperties
{
    public static readonly elementName = "rwDiffIcons";

    oldRevision: Revision;
    newRevision: Revision;
    latestRevision: Revision;

    get isLatestIcons(): boolean {
        return (
            this.latestRevision.revisionID ===
            (this.side === "new"
                ? this.newRevision.revisionID
                : this.oldRevision.revisionID)
        );
    }

    side: "old" | "new";

    /**
     * This element, as returned by {@link RWUIDiffIcons.render}.
     */
    self: HTMLElement;

    constructor(props: RWUIDiffIconsProperties & BaseProps) {
        super();
        Object.assign(props, this);
    }

    /**
     * Renders the diff icons. These are then wrapped by a RedWarn container
     * element to isolate other elements.
     *
     * This is called only once: on insertion. Any subsequent expected changes
     * to this element will be called through other functions.
     */
    render(): JSX.Element {
        return undefined;
    }

    /**
     * Called on the start of a revert.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onStartRevert(context: DiffIconRevertContext): void {
        return undefined;
    }

    /**
     * Called when the stage of a revert has advanced.
     * @param stage The current stage of the revert.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRevertStageChange(stage: RevertStage): void {
        return undefined;
    }

    /**
     * Called at the end of a revert. This is not called when a revert fails,
     * use {@link onRevertFailure} instead.
     *
     * @param cancelled Whether or not this revert ended due to being cancelled.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onEndRevert(cancelled = false): void {
        return undefined;
    }

    /**
     * Called when a revert fails with an error.
     * @param error The error that occurred.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRevertFailure(error: RWErrorBase): void {
        return undefined;
    }

    /**
     * Called on the beginning of a revert/restore. Informs the element of the
     * target revision to revert to.
     * @param targetRevision The revision being reverted to.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onStartRestore(targetRevision: Revision): void {
        return undefined;
    }

    /**
     * Called when the stage of a revert/restore has advanced.
     * @param stage The {@link RestoreStage} of the revert/restore.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRestoreStageChange(stage: RestoreStage): void {
        return undefined;
    }

    /**
     * Called when a revert/restore has ended with no issues.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onEndRestore(editResponse: { edit: Record<string, any> }): void {
        return undefined;
    }

    /**
     * Called when an error occurrs during a revert/restore.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRestoreFailure(error: RWErrorBase): void {
        return undefined;
    }
}
