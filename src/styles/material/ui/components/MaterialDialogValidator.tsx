import RWUIElement from "rww/ui/elements/RWUIElement";
import i18next from "i18next";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";
import { h } from "tsx-dom";
import { RWUIDialog, RWUIDialogProperties } from "rww/ui/elements/RWUIDialog";
import { upgradeMaterialDialog } from "rww/styles/material/Material";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle
} from "rww/styles/material/ui/MaterialDialog";
import { generateId } from "rww/util";
import MaterialButton from "rww/styles/material/ui/components/MaterialButton";
import "../../css/validation.css";

export interface ValidationCheck {
    id: string;
    test: () => boolean;
}

interface MaterialDialogValidatorProps {
    /**
     * The language key is the root i18n key for validation errors. The exact
     * validation error message will be shown by using the validation ID as the
     * i18next context.
     */
    languageKey: string;
    /**
     * {@link MaterialDialogValidatorProps.languageKey} but with instructions
     * for details.
     */
    detailedLanguageKey: string;
    validators: ValidationCheck[];
    /**
     * `true` if the button should be shown when the validation checks are passing.
     * The icon to be used is "check_circle".
     */
    showWhenPassing?: boolean;
}

export class MaterialDialogValidatorDialog extends RWUIDialog<void> {
    constructor(
        readonly props: {
            detailedLanguageKey: string;
            tests: true | ValidationCheck[];
        } & RWUIDialogProperties
    ) {
        super();
    }

    show(): Promise<void> {
        return upgradeMaterialDialog<void>(this).then((v) => v.wait());
    }

    renderContent(): JSX.Element {
        if (this.props.tests === true)
            return <div>{i18next.t<string>("ui:validation.pass")}</div>;

        // Get the failing tests with their test IDs.
        const failingIds = this.props.tests.map((v) => v.id);

        return (
            <div>
                {i18next
                    .t("ui:validation.validationDialogIntro", {
                        count: failingIds.length
                    })
                    .toString()}
                <ul>
                    {failingIds.reduce((items: JSX.Element[], id: string) => {
                        items.push(
                            <li>
                                {i18next.t<string>(
                                    this.props.detailedLanguageKey,
                                    { context: id }
                                )}
                            </li>
                        );
                        return items;
                    }, [])}
                </ul>
            </div>
        );
    }

    render(): HTMLDialogElement {
        return (this.element = (
            <MaterialDialog id={generateId()}>
                <MaterialDialogTitle>
                    {this.props.title ??
                        i18next.t<string>("ui:validation.title")}
                </MaterialDialogTitle>
                <MaterialDialogContent>
                    {this.renderContent()}
                </MaterialDialogContent>
                <MaterialDialogActions>
                    <MaterialButton dialogAction="ok">
                        {i18next.t<string>("ui:ok")}
                    </MaterialButton>
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement);
    }
}

class MaterialDialogValidator extends RWUIElement {
    element: JSX.Element;
    visibleValidationResults: true | ValidationCheck[];

    constructor(readonly props: MaterialDialogValidatorProps) {
        super();
    }

    validate(): true | ValidationCheck[] {
        // Test all validators.
        const results = this.props.validators.map((check) => ({
            check,
            result: check.test()
        }));
        // Return true if all passing, the failed validation checks if not.
        return results.reduce((p, n) => p && n.result, true)
            ? true
            : results.filter((r) => !r.result).map((r) => r.check);
    }

    /**
     * Update the interface with the new validation results. This will pop the existing
     * element out of the DOM and replace it with a freshly-rendered element. This
     * function does not calculate any differences between validation results, so it
     * may be a bit inefficient, but it's not a giant load.
     *
     * TODO: Check if there are differences before re-rendering.
     */
    update(): true | ValidationCheck[] {
        const oldElement = this.element;
        const newElement = this.render();

        oldElement.parentElement.replaceChild(newElement, oldElement);
        return this.visibleValidationResults;
    }

    render(): JSX.Element {
        this.visibleValidationResults = this.validate();

        return (this.element = (
            <span
                class={"rw-mdc-validation"}
                data-valid={this.visibleValidationResults === true}
            >
                {(this.visibleValidationResults !== true ||
                    this.props.showWhenPassing !== false) && (
                    <MaterialIconButton
                        icon={
                            this.visibleValidationResults !== true
                                ? "error"
                                : "check_circle"
                        }
                        tooltip={i18next
                            .t(
                                this.visibleValidationResults !== true
                                    ? "ui:validation.validationFailedIconTooltip"
                                    : "ui:validation.pass"
                            )
                            .toString()}
                        onClick={
                            this.visibleValidationResults !== true
                                ? () => {
                                      // Show failed validation tests with detailed information.
                                      const dialog = new MaterialDialogValidatorDialog(
                                          {
                                              detailedLanguageKey: this.props
                                                  .detailedLanguageKey,
                                              tests: this
                                                  .visibleValidationResults
                                          }
                                      );
                                      dialog.show();
                                  }
                                : () => {
                                      /* Do nothing. */
                                  }
                        }
                    />
                )}
                {this.visibleValidationResults !== true && (
                    <div class="rw-mdc-dialog-helperText">
                        {i18next.t<string>(this.props.languageKey, {
                            context: this.visibleValidationResults[0].id
                        })}
                    </div>
                )}
            </span>
        ));
    }
}

export { MaterialDialogValidator as MaterialDialogValidatorController };
export default function generator(
    props: ConstructorParameters<typeof MaterialDialogValidator>[0]
): JSX.Element & { validator: MaterialDialogValidator } {
    const validator = new MaterialDialogValidator(props);
    return Object.assign(validator.render(), {
        validator: validator
    });
}
