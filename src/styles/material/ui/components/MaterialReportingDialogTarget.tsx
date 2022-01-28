import { MaterialReportingDialogChild } from "rww/styles/material/ui/components/MaterialReportingDialogChild";
import { Page } from "rww/mediawiki";
import { MaterialReportingDialogChildProps } from "rww/styles/material/ui/MaterialReportingDialog";
import MaterialTextInput, {
    MaterialTextInputComponents,
    MaterialTextInputUpgrade
} from "rww/styles/material/ui/components/MaterialTextInput";
import { h } from "tsx-dom";
import i18next from "i18next";
import { ReportVenue, ReportVenueMode } from "rww/mediawiki/report/ReportVenue";
import RedWarnStore from "rww/data/RedWarnStore";

class MaterialReportingDialogTarget extends MaterialReportingDialogChild {
    get venue(): ReportVenue {
        return this.props.reportingDialog.props.venue;
    }

    set target(target: Page) {
        this.props.reportingDialog.target = target;
    }

    elements: {
        root?: JSX.Element;
        input?: MaterialTextInputComponents;
    } = {};

    constructor(
        readonly props: MaterialReportingDialogChildProps & {
            originalTarget?: Page;
        }
    ) {
        super();
        this.target = props.originalTarget;
    }

    refresh(): void {
        //
    }

    render(): JSX.Element {
        this.elements.input = MaterialTextInputUpgrade(
            <MaterialTextInput
                label={i18next.t("ui:reporting.target.label", {
                    context: ReportVenueMode[this.venue.mode].toLowerCase()
                })}
                helperText={i18next.t("ui:reporting.target.helperText", {
                    context: ReportVenueMode[this.venue.mode].toLowerCase()
                })}
                leadingIcon={{
                    icon:
                        this.venue.mode !== ReportVenueMode.User
                            ? "description"
                            : "person"
                }}
            />
        );

        if (this.venue.mode === ReportVenueMode.Page) {
            this.elements.input.textField.listen("input", () => {
                try {
                    const isUserNamespace =
                        new mw.Title(this.elements.input.textField.value)
                            .namespace === RedWarnStore.getNamespaceId("user");

                    (this.elements.input.leadingIcon
                        .root as HTMLElement).innerText = isUserNamespace
                        ? "person"
                        : "description";
                } catch (e) {
                    /* ignored */
                }
            });
        }

        this.elements.root = <div>{this.elements.input.element}</div>;

        return this.elements.root;
    }
}

export { MaterialReportingDialogTarget as MaterialReportingDialogTargetController };
export default function generator(
    props: MaterialReportingDialogChildProps & { originalTarget?: Page }
): JSX.Element & { MRDTarget: MaterialReportingDialogTarget } {
    const mrdTarget = new MaterialReportingDialogTarget(props);
    return Object.assign(mrdTarget.render(), {
        MRDTarget: mrdTarget
    });
}
