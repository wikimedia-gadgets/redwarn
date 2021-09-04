/**
 * The current stage of a revert.
 */
export enum RevertStage {
    /** Collecting details about the revision to revert. */
    Preparing,
    /**
     * Collecting details about the revision to revert to.
     */
    Details,
    /**
     * The revert is being made. Once within the revert stage, cancelling
     * the revert is impossible.
     */
    Revert,
    /**
     * The revert has finished either with or without errors.
     */
    Finished,
}

/**
 * The current stage of a revision restore.
 */
export enum RestoreStage {
    Preparing,
    Details,
    Restore,
    Finished,
}
