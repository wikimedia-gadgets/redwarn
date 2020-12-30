import RedWarnStore from "rww/data/RedWarnStore";
import { RWUIDialog, RWUIDialogID } from "rww/ui/elements/RWUIDialog";
import { StyleStorage } from "../../Style";
import MaterialToast from "../ui/MaterialToast";

export class MaterialStyleStorage extends StyleStorage {
    // Caches
    dialogTracker: Map<RWUIDialogID, RWUIDialog> = new Map<
        RWUIDialogID,
        RWUIDialog
    >();
    toastQueue: MaterialToast[] = [];
}

export function getMaterialStorage(): MaterialStyleStorage {
    return (
        (RedWarnStore.styleStorage as MaterialStyleStorage) ??
        (RedWarnStore.styleStorage = new MaterialStyleStorage())
    );
}
