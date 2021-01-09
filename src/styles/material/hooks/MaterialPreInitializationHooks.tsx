import RedWarnStore from "rww/data/RedWarnStore";

import { MaterialStyleStorage } from "rww/styles/material/storage/MaterialStyleStorage";
import { MDCTooltip } from "@material/tooltip";
import { h } from "tsx-dom";
import { generateId } from "rww/util";

export default function (): void {
    RedWarnStore.styleStorage = new MaterialStyleStorage();

    document.addEventListener("animationstart", (event) => {
        if (!(event.target instanceof Element)) return;
        if (!event.target.hasAttribute("data-rw-mdc-tooltip")) return;
        const id = `icobtn__${generateId(8)}`;

        const tooltipElement = (
            <div id={id} class="mdc-tooltip" role="tooltip" aria-hidden="true">
                <div class="mdc-tooltip__surface">
                    {event.target.getAttribute("data-rw-mdc-tooltip")}
                </div>
            </div>
        );

        event.target.setAttribute("data-tooltip-id", id);
        event.target.setAttribute("aria-describedby", id);

        event.target.parentElement.insertBefore(tooltipElement, event.target);

        new MDCTooltip(tooltipElement);
    });
}
