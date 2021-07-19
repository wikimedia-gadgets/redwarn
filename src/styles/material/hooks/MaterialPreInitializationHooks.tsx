import RedWarnStore from "rww/data/RedWarnStore";

import { MaterialStyleStorage } from "rww/styles/material/data/MaterialStyleStorage";
import { MDCTooltip } from "@material/tooltip";
import { h } from "tsx-dom";
import { generateId } from "rww/util";
import Log from "rww/data/RedWarnLog";

export default function (): void {
    RedWarnStore.styleStorage = new MaterialStyleStorage();

    Log.debug("Starting MutationObserver...");
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            document
                .querySelectorAll(
                    "[data-rw-mdc-tooltip]:not(.rw-mdc-tooltip__upgraded)"
                )
                .forEach((element) => {
                    const id = `icobtn__${generateId(8)}`;

                    const tooltipElement = (
                        <div
                            id={id}
                            class="mdc-tooltip"
                            role="tooltip"
                            aria-hidden="true"
                        >
                            <div class="mdc-tooltip__surface">
                                {element.getAttribute("data-rw-mdc-tooltip")}
                            </div>
                        </div>
                    );

                    element.setAttribute("data-tooltip-id", id);
                    element.setAttribute("aria-describedby", id);

                    element.classList.add("rw-mdc-tooltip__upgraded");

                    element.parentElement.insertBefore(tooltipElement, element);

                    new MDCTooltip(tooltipElement);
                    Log.trace("Upgraded tooltip.", tooltipElement);
                });
        }
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
