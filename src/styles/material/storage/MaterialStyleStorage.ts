import { RWUIDialog, RWUIDialogID } from "../../../ui/RWUIDialog";
import RedWarnStore, { StyleStorage } from "../../../data/RedWarnStore";

export class MaterialStyleStorage extends StyleStorage {
    // Caches
    dialogTracker: Map<RWUIDialogID, RWUIDialog> = new Map<
        RWUIDialogID,
        RWUIDialog
    >();
}

export function getMaterialStorage(): MaterialStyleStorage {
    return (
        (RedWarnStore.styleStorage as MaterialStyleStorage) ??
        (RedWarnStore.styleStorage = new MaterialStyleStorage())
    );
}
