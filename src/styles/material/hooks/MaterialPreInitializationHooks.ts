import RedWarnStore from "../../../data/RedWarnStore";

import mdc from "material-components-web";
import {MaterialStyleStorage} from "../storage/MaterialStyleStorage";

export default function() : void {

    RedWarnStore.styleStorage = new MaterialStyleStorage();
    mdc.autoInit();

}