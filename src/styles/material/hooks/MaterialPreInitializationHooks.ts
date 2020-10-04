import RedWarnStore from "../../../data/RedWarnStore";
import {MaterialStyleStorage} from "../Material";

export default function() : void {

    RedWarnStore.styleStorage = new MaterialStyleStorage();

}