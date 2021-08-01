import RedWarnStore from "rww/data/RedWarnStore";

import { MaterialStyleStorage } from "rww/styles/material/data/MaterialStyleStorage";
import { h } from "tsx-dom";
import Log from "rww/data/RedWarnLog";
import MaterialTooltip from "rww/styles/material/ui/components/MaterialTooltip";

export default function (): void {
    RedWarnStore.styleStorage = new MaterialStyleStorage();

    Log.debug("Starting MutationObserver...");
    new MutationObserver(() => {
        document
            .querySelectorAll(
                "[data-rw-mdc-tooltip]:not(.rw-mdc-tooltip__upgraded)"
            )
            .forEach((element) => {
                element.classList.add("rw-mdc-tooltip__upgraded");

                element.insertAdjacentElement(
                    "afterend",
                    <MaterialTooltip target={element}>
                        {element.getAttribute("data-rw-mdc-tooltip")}
                    </MaterialTooltip>
                );
            });
    }).observe(document.body, {
        childList: true,
        subtree: true,
    });
    Log.debug("MutationObserver stared.");

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
