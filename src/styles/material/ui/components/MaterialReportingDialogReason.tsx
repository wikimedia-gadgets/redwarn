import { MaterialUserSelectProps } from "rww/styles/material/ui/components/MaterialUserSelect";
import { h } from "tsx-dom";
import {
    MaterialReportingDialogChildProps,
    MaterialReportingDialogInfo
} from "rww/styles/material/ui/components/MaterialReportingDialogChild";
import RWUIElement from "rww/ui/elements/RWUIElement";

class MaterialReportingDialogReason extends RWUIElement {
    constructor(
        readonly props: MaterialUserSelectProps &
            MaterialReportingDialogChildProps
    ) {
        super();
    }

    render(): JSX.Element {
        // TODO: Add dropdown for reasons.
        return undefined;
    }
}

export { MaterialReportingDialogReason as MaterialReportingDialogReasonController };
export default function generator(
    props: MaterialReportingDialogChildProps
): MaterialReportingDialogInfo {
    const mrdReasonInfo = new MaterialReportingDialogReason(props);
    return Object.assign(mrdReasonInfo.render(), {
        MRDInfo: mrdReasonInfo
    });
}
