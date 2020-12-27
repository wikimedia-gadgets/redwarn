import RedWarnStore from "../../../data/RedWarnStore";

import { MaterialStyleStorage } from "../storage/MaterialStyleStorage";

export default function (): void {
    RedWarnStore.styleStorage = new MaterialStyleStorage();
}
