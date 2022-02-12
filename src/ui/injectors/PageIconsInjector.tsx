import { h } from "tsx-dom";
import RedWarnUI from "rww/ui/RedWarnUI";

import "../css/pageIcons.css";
import { Injector } from "./Injector";

export default class PageIconsInjector implements Injector {
    /**
     * Initialize the injector. If the page is a diff page, this injector
     * will trigger.
     */
    async init(): Promise<void> {
        const diffIcons = new RedWarnUI.PageIcons();
        const icons = <div id={"rwPageIcons"}>{diffIcons.render()}</div>;

        // TODO: Test on non-Vector.
        const target =
            document.querySelector(".mw-indicators") ??
            // Fallback to article title.
            document.getElementById("firstHeading");
        target.insertAdjacentElement("beforebegin", icons);
    }
}
