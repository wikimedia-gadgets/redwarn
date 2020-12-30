import Rollback from "../../wikipedia/Rollback";
import Revision from "../../wikipedia/Revision";
import {Direction} from "../../definitions/Direction";

class DiffViewContext {

    public readonly direction: Direction;

    /**
     * @param direction The direction of the diffs
     * @param sourceRevision The older revision. Found at the left side of the diff view (if the direction is `Forward`).
     * @param targetRevision The newer revision. Found at the right side of the diff view (if the direction is `Forward`).
     * @param noRedirects Whether or not to follow redirects.
     */
    constructor(
        public readonly sourceRevision : Revision,
        public readonly targetRevision : Revision
    ) {
        if (sourceRevision.revisionID > targetRevision.revisionID) {
            // Set the direction to backward
            this.direction = Direction.Backward;

            // Reverse the two (making target the latest revision)
            const newerRevision = sourceRevision;
            this.sourceRevision = targetRevision;
            this.targetRevision = newerRevision;
        } else {
            this.direction = Direction.Forward;
        }
    }

}

export default class DiffViewerInjector {

    static async init(): Promise<void> {
        if (Rollback.isDiffPage()) {
            await DiffViewerInjector.loadOptions(await this.getContext());
        }
    }

    static async getContext(noRedirects = false) : Promise<DiffViewContext> {
        const targetRevision : Revision = Revision.fromID(
            Rollback.getNewerRevisionId(),
            {
                page: mw.config.get("wgRelevantPageName"),

            }
        );
        const sourceRevision : Revision = Revision.fromID(
            Rollback.getOlderRevisionId(),
            {
                page: mw.config.get("wgRelevantPageName"),

            }
        );

        await targetRevision.populate();

        return new DiffViewContext(
            sourceRevision,
            targetRevision
        );
    }

    static async loadOptions({targetRevision} : DiffViewContext) {

    }

}