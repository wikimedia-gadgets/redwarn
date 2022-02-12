import { MaterialUserSelectProps } from "rww/styles/material/ui/components/MaterialUserSelect";
import { h } from "tsx-dom";
import { MaterialReportingDialogChildProps } from "rww/styles/material/ui/components/MaterialReportingDialogChild";
import RWUIElement from "rww/ui/elements/RWUIElement";
import MaterialSelect, {
    MaterialSelectElement,
    MaterialSelectItem,
} from "rww/styles/material/ui/components/MaterialSelect";
import {
    isEmailReportVenue,
    isPageReportVenue,
    ReportVenue,
} from "rww/mediawiki/report/ReportVenue";
import i18next from "i18next";
import MaterialTextInput, {
    MaterialTextInputComponents,
    MaterialTextInputUpgrade,
} from "rww/styles/material/ui/components/MaterialTextInput";

class MaterialReportingDialogInfo extends RWUIElement {
    get venue(): ReportVenue {
        return this.props.reportingDialog.venue;
    }

    get reason(): string {
        return this.props.reportingDialog.reason;
    }
    set reason(value: string) {
        this.props.reportingDialog.reason = value;
    }
    get comments(): string {
        return this.props.reportingDialog.comments;
    }
    set comments(value: string) {
        this.props.reportingDialog.comments = value;
    }

    elements: {
        root?: JSX.Element;
        dropdown?: MaterialSelectElement<string>;
        comments?: MaterialTextInputComponents;
    } = {};

    constructor(
        readonly props: MaterialUserSelectProps &
            MaterialReportingDialogChildProps
    ) {
        super();
    }

    renderDropdown(): JSX.Element {
        if (isPageReportVenue(this.venue)) {
            return (this.elements.dropdown = (
                <MaterialSelect<string>
                    label={i18next.t("ui:reporting.info.reason.label")}
                    items={
                        [
                            {
                                type: "action",
                                label: i18next.t(
                                    "ui:reporting.info.reason.other"
                                ),
                                value: null,
                            },
                            {
                                type: "header",
                                label: i18next.t(
                                    "ui:reporting.info.reason.default"
                                ),
                            },
                            ...this.venue.defaultReasons.map((reason) => ({
                                type: "action",
                                label: reason,
                                value: reason,
                            })),
                        ] as MaterialSelectItem<string>[]
                    }
                    onChange={(_, value) => {
                        this.elements.comments.textField.required =
                            value === null;
                        this.reason = value;
                        this.props.reportingDialog.uiValidate();
                    }}
                    required
                />
            ) as MaterialSelectElement<string>);
        } else {
            return null;
        }
    }

    renderCommentsBox(): JSX.Element {
        this.elements.comments = MaterialTextInputUpgrade(
            <MaterialTextInput
                label={i18next.t("ui:reporting.info.comments.label")}
                helperText={i18next.t("ui:reporting.info.comments.placeholder")}
                defaultText={
                    (isEmailReportVenue(this.venue) && this.venue.prefill) || ""
                }
                outlined
                area
                required
            />
        );

        this.elements.comments.textField.listen("input", () => {
            this.comments = this.elements.comments.textField.value;
            this.props.reportingDialog.uiValidate();
        });

        return this.elements.comments.element;
    }

    render(): JSX.Element {
        this.elements.root = (
            <div class="rw-mdc-reportingDialog-info">
                {isPageReportVenue(this.venue) && this.renderDropdown()}
                {this.renderCommentsBox()}
            </div>
        );

        return this.elements.root;
    }
}

export { MaterialReportingDialogInfo as MaterialReportingDialogInfoController };
export default function generator(
    props: MaterialReportingDialogChildProps
): JSX.Element & { MRDInfo: MaterialReportingDialogInfo } {
    const mrdReasonInfo = new MaterialReportingDialogInfo(props);
    return Object.assign(mrdReasonInfo.render(), {
        MRDInfo: mrdReasonInfo,
    });
}
