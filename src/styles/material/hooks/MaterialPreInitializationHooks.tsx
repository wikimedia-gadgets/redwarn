import RedWarnStore from "app/data/RedWarnStore";

import { MaterialStyleStorage } from "app/styles/material/data/MaterialStyleStorage";
import { h } from "tsx-dom";
import Log from "app/data/RedWarnLog";
import MaterialTooltip from "app/styles/material/ui/components/MaterialTooltip";
import toCSS from "app/styles/material/util/toCSS";

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

        document
            .querySelectorAll(
                "[data-rw-mdc-dialog-draggable]:not(.data-rw-mdc-dialog-draggable__upgraded)"
            )
            .forEach((element: HTMLElement) => {
                element.classList.add("data-rw-mdc-dialog-draggable__upgraded");

                // Disable scrim
                const scrim: HTMLElement =
                    element.querySelector(".mdc-dialog__scrim");
                scrim.style.pointerEvents = "none";
                scrim.style.opacity = "0.5";

                // Allow clickthrough
                const surface: HTMLElement = element.querySelector(
                    ".mdc-dialog__surface"
                );
                element.style.pointerEvents = "none";
                surface.style.pointerEvents = "all";

                // Allow dragging
                const title: HTMLElement =
                    element.querySelector(".mdc-dialog__title");
                title.style.userSelect = "none";
                surface.style.position = "relative";
                surface.style.top = "var(--rw-mdc-dialog-draggable--top)";
                surface.style.left = "var(--rw-mdc-dialog-draggable--left)";
                element.setAttribute("data-x", "0");
                element.setAttribute("data-y", "0");
                const updateStyle = () => {
                    element.setAttribute(
                        "style",
                        toCSS({
                            "--rw-mdc-dialog-draggable--top":
                                -element.getAttribute("data-y") + "px",
                            "--rw-mdc-dialog-draggable--left":
                                -element.getAttribute("data-x") + "px",
                        })
                    );
                };
                updateStyle();
                title.style.cursor = "move";
                title.addEventListener("mousedown", (event) => {
                    title.toggleAttribute("data-dragging", true);

                    title.setAttribute("data-drag-x", `${event.clientX}`);
                    title.setAttribute("data-drag-y", `${event.clientY}`);
                });
                title.addEventListener("mouseup", () => {
                    title.toggleAttribute("data-dragging", false);
                });
                document.addEventListener("mousemove", (event) => {
                    if (!title.hasAttribute("data-dragging")) return;

                    const pastX = +title.getAttribute("data-drag-x");
                    const pastY = +title.getAttribute("data-drag-y");

                    const deltaX = pastX - event.clientX;
                    const deltaY = pastY - event.clientY;

                    element.setAttribute(
                        "data-x",
                        `${+element.getAttribute("data-x") + deltaX}`
                    );
                    element.setAttribute(
                        "data-y",
                        `${+element.getAttribute("data-y") + deltaY}`
                    );
                    updateStyle();

                    title.setAttribute("data-drag-x", `${event.clientX}`);
                    title.setAttribute("data-drag-y", `${event.clientY}`);
                });
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
