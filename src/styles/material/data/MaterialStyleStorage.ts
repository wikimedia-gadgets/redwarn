import RedWarnStore from "app/data/RedWarnStore";
import { RWUIDialog, RWUIDialogID } from "app/ui/elements/RWUIDialog";
import { StyleStorage } from "app/styles/Style";
import MaterialToast from "app/styles/material/ui/MaterialToast";

export class MaterialDialogTrackMap extends Map<RWUIDialogID, RWUIDialog<any>> {
    domRemove(key: RWUIDialogID): void {
        const remove = (i = 0) => {
            const dialogElement = this.get(key).element;

            if (
                !dialogElement.classList.contains("mdc-dialog--open") ||
                i >= 100
            )
                dialogElement.parentElement.removeChild(dialogElement);
            else
                setTimeout(() => {
                    remove(i++);
                }, 10);
        };
        setTimeout(remove, 2000);
    }

    delete(key: RWUIDialogID): boolean {
        // Delete dialog element after 2 seconds.
        setTimeout(() => {
            document
                .getElementById(key)
                ?.parentElement?.removeChild(document.getElementById(key));
        }, 2000);
        return super.delete(key);
    }
}

export class MaterialStyleStorage extends StyleStorage {
    // Caches
    dialogTracker: Map<RWUIDialogID, RWUIDialog<any>> =
        new MaterialDialogTrackMap();
    toastQueue: MaterialToast[] = [];
}

export function getMaterialStorage(): MaterialStyleStorage {
    return (
        (RedWarnStore.styleStorage as MaterialStyleStorage) ??
        (RedWarnStore.styleStorage = new MaterialStyleStorage())
    );
}
