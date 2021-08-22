import { BaseProps, h } from "tsx-dom";
import { generateId } from "rww/util";
import { MDCTooltip } from "@material/tooltip";

export interface MaterialTooltipProps extends BaseProps {
    target?: Element | string;
    id?: string;
}

export default function ({
    id,
    target,
    children
}: MaterialTooltipProps): JSX.Element {
    if (target && typeof target === "string") {
        target = document.querySelector(target);
    }

    const _id = !id ? `rwtooltip__${generateId(8)}` : id;

    const tooltipElement = (
        <div id={_id} class="mdc-tooltip" role="tooltip" aria-hidden="true">
            <div class="mdc-tooltip__surface mdc-tooltip__surface-animation">
                {children}
            </div>
        </div>
    );

    if (target && target instanceof HTMLElement) {
        target.setAttribute("data-tooltip-id", _id);
        target.setAttribute("aria-describedby", _id);
    }

    const tooltip = new MDCTooltip(tooltipElement);
    // Instant show and hide delays.
    tooltip.setShowDelay(0);
    tooltip.setHideDelay(0);
    return tooltipElement;
}
