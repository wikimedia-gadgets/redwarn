import RWUIElement from "rww/ui/elements/RWUIElement";
import { RevertContext, RevertStage, Revision } from "rww/mediawiki";
import { BaseProps } from "tsx-dom";

export type RWUIDiffIconsProperties = Pick<
    RevertContext,
    "oldRevision" | "newRevision" | "latestRevision"
>;

/**
 * The RWUIDiffIcons are icons that are displayed on a diff page. Since they are injected
 * into the DOM upon loading, these icons are wrapped by a container, regardless of whether
 * or not the element already provides one. This container is accessible with the ID
 * `#rwDiffIcons`.
 */
export class RWUIDiffIcons
    extends RWUIElement
    implements RWUIDiffIconsProperties {
    public static readonly elementName = "rwDiffIcons";

    oldRevision: Revision;
    newRevision: Revision;
    latestRevision: Revision;

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
    onStartRevert(): void {
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
    onRevertFailure(error: Error): void {
        return undefined;
    }
}
