import RedWarnStore from "rww/data/RedWarnStore";

import { MaterialStyleStorage } from "rww/styles/material/data/MaterialStyleStorage";
import { MDCTooltip } from "@material/tooltip";
import { h } from "tsx-dom";
import { generateId } from "rww/util";
import MaterialWarnSearchDialog from "rww/styles/material/ui/MaterialWarnSearchDialog";

export default function (): void {
    RedWarnStore.styleStorage = new MaterialStyleStorage();

    (global as Record<string, any>)["rw"][
        "MaterialWarnSearchDialog"
    ] = MaterialWarnSearchDialog;

    // MDC Tooltip upgrade
    document.addEventListener("animationstart", (event) => {
        // Not even an element.
        if (!(event.target instanceof Element)) return;
        // Does not have the tooltip attribute.
        if (!event.target.hasAttribute("data-rw-mdc-tooltip")) return;
        // Tooltip already created.
        if (event.target.classList.contains("rw-mdc-tooltip__upgraded")) return;

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

        event.target.classList.add("rw-mdc-tooltip__upgraded");

        event.target.parentElement.insertBefore(tooltipElement, event.target);

        new MDCTooltip(tooltipElement);
    });

    // Periodic tooltip cleanup. Slightly expensive, so make the delay a bit big.
    setInterval(() => {
        document.querySelectorAll(".mdc-tooltip").forEach((el) => {
            if (
                document.querySelector(`[data-tooltip-id="${el.id}"]`) == null
            ) {
                el.parentElement.removeChild(el);
            }
        });
    }, 5000);
}
