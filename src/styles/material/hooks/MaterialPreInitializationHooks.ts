import RedWarnStore from "../../../data/RedWarnStore";
import { MaterialStyleStorage } from "../Material";

import mdc from "material-components-web";

export default function (): void {
    RedWarnStore.styleStorage = new MaterialStyleStorage();
    mdc.autoInit();
}
