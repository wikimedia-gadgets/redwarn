import { Direction } from "./Direction";
import { MDCLinearProgress } from "@material/linear-progress";
import { Revision } from "rww/mediawiki/MediaWiki";

export class RollbackContext {
    public readonly direction: Direction;
    progressBar: MDCLinearProgress;

    /**
     * @param targetRevision The newer revision. Found at the right side of the diff view (if the direction is `Forward`).
     * @param sourceRevision The older revision. Found at the left side of the diff view (if the direction is `Forward`).
     * @param redirectOnChange Whether or not to redirect when the latest revision changes.
     * @param fromInjector Whether or not the given context is from a DiffViewerInjector.
     */
    constructor(
        public readonly targetRevision: Revision,
        public readonly sourceRevision?: Revision,
        public readonly redirectOnChange = true,
        public readonly fromInjector = true
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
