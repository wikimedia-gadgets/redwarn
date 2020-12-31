import RedWarnStore from "rww/data/RedWarnStore";

import { MaterialStyleStorage } from "rww/styles/material/storage/MaterialStyleStorage";

export default function (): void {
    RedWarnStore.styleStorage = new MaterialStyleStorage();
}
