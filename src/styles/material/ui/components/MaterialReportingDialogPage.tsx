import {
    MaterialReportingDialogChildProps,
    MaterialReportingDialogTarget,
    MaterialReportingDialogTargetProps,
} from "rww/styles/material/ui/components/MaterialReportingDialogChild";
import { Page } from "rww/mediawiki";
import MaterialTextInput, {
    MaterialTextInputComponents,
    MaterialTextInputUpgrade,
} from "rww/styles/material/ui/components/MaterialTextInput";
import { h } from "tsx-dom";
import i18next from "i18next";
import {
    isPageReportVenue,
    ReportVenue,
    ReportVenueMode,
} from "rww/mediawiki/report/ReportVenue";

class MaterialReportingDialogPage {
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
        this.target = props.originalTarget;
    }

    render(): JSX.Element {
        this.elements.input = MaterialTextInputUpgrade(
            <MaterialTextInput
                label={i18next.t("ui:reporting.target.label", {
                    context: ReportVenueMode[this.venue.mode].toLowerCase(),
                })}
                helperText={i18next.t("ui:reporting.target.helperText", {
                    context: ReportVenueMode[this.venue.mode].toLowerCase(),
                })}
                leadingIcon={{
                    icon: "description",
                }}
            />
        );

        this.elements.input.textField.useNativeValidation = false;
        this.elements.input.textField.listen("input", () => {
            if (this.elements.input.textField.value.length > 0) {
                try {
                    const currentTarget = Page.fromTitle(
                        this.elements.input.textField.value
                    );
                    this.props.reportingDialog.target = currentTarget;
                    this.props.reportingDialog.uiValidate();

                    if (isPageReportVenue(this.props.reportingDialog.venue))
                        this.props.reportingDialog.venue.page.getLatestRevision();
                    currentTarget.exists().then((exists) => {
                        if (
                            new mw.Title(
                                this.elements.input.textField.value
                            ).toString() !== currentTarget.title.toString()
                        ) {
                            // Too late. Skip this update.
                            return;
                        }
                        this.elements.input.textField.valid = exists;
                        (
                            this.elements.input.helperText.root as HTMLElement
                        ).innerText = i18next.t(
                            exists
                                ? "ui:reporting.target.helperText"
                                : "ui:reporting.target.nonexistent_page"
                        );
                    });
                } catch (e) {
                    this.elements.input.textField.valid = false;
                }
            } else {
                (this.elements.input.helperText.root as HTMLElement).innerText =
                    i18next.t("ui:reporting.target.helperText");
                this.elements.input.textField.valid = false;
            }
        });

        this.elements.root = <div>{this.elements.input.element}</div>;
        return this.elements.root;
    }
}

export { MaterialReportingDialogPage as MaterialReportingDialogPageController };
export default function generator(
    props: MaterialReportingDialogTargetProps<Page>
): MaterialReportingDialogTarget {
    const mrdPageTarget = new MaterialReportingDialogPage(props);
    return Object.assign(mrdPageTarget.render(), {
        MRDTarget: mrdPageTarget,
        valid: () => mrdPageTarget.elements.input.textField.valid,
    });
}
