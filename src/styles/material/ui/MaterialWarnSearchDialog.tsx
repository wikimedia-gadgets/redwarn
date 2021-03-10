import { ComponentChild, h } from "tsx-dom";

import { RWUIDialog, RWUIDialogProperties } from "rww/ui/elements/RWUIDialog";
import {
    registerMaterialDialog,
    upgradeMaterialDialog,
} from "rww/styles/material/Material";

import { getMaterialStorage } from "rww/styles/material/data/MaterialStyleStorage";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";

import "../css/warnDialog.css";
import {
    Warning,
    WarningCategory,
    WarningCategoryNames,
    WarningLevel,
    Warnings,
    WarningsByCategory,
    WarningType,
} from "rww/mediawiki";
import MaterialTextInput, {
    MaterialTextInputUpgrade,
} from "rww/styles/material/ui/components/MaterialTextInput";
import RedWarnStore from "rww/data/RedWarnStore";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";
import { regexEscape } from "rww/util";

interface MaterialWarnSearchDialogProperties extends RWUIDialogProperties {
    selectedWarning?: Warning;
}

function MaterialWarnSearchDialogSearchBar(props: {
    callback: (event: KeyboardEvent & { value: string }) => void | boolean;
}): JSX.Element {
    const input = (
        <MaterialTextInput
            class={"rw-mdc-warnSearchDialog--searchInput"}
            label={"Search for a warning..."}
        />
    );
    const mdcTextInput = MaterialTextInputUpgrade(input);
    mdcTextInput.textField.listen("keyup", (event) => {
        props.callback(
            Object.assign(event, { value: mdcTextInput.textField.value })
        );
    });

    return <div class={"rw-mdc-warnSearchDialog--searchBar"}>{input}</div>;
}

function MaterialWarnSearchDialogWarnings(props: {
    dialog: MaterialWarnSearchDialog;
}): JSX.Element {
    const warningElements: JSX.Element[] = [];

    for (const [category, warnings] of Object.entries(WarningsByCategory)) {
        const categoryHeader = (
            <div class="rw-warningCategory" data-rw-warningCategory={category}>
                {
                    WarningCategoryNames[
                        // Ungodly type assertion skip.
                        (category as unknown) as WarningCategory
                    ]
                }
            </div>
        );
        warningElements.push(categoryHeader);

        const categoryWarningCards: JSX.Element[] = [];

        for (const [id, warning] of Object.entries(warnings)) {
            const title = ((): string => {
                switch (warning.type) {
                    case WarningType.Tiered:
                        return `Tiered Warning`;
                    case WarningType.SingleIssue:
                        return "Single-issue Warning";
                    case WarningType.PolicyViolation:
                        return "Policy Violation Warning";
                }
            })();

            const warningCard = (
                <div
                    class="rw-mdc-warnSearchDialog-warning mdc-card mdc-card--outlined"
                    data-rw-warning={id}
                >
                    <table>
                        <tr>
                            <td style={"width: 100%"}>
                                <div class={"rw-mdc-cardTitle"}>
                                    {warning.name}
                                </div>
                            </td>
                            <td rowSpan={4}>
                                <MaterialIconButton
                                    class={[
                                        "mdc-card__action",
                                        "mdc-card__action--icon",
                                    ]}
                                    icon={((): string => {
                                        switch (warning.type) {
                                            case WarningType.Tiered:
                                                return "signal_cellular_alt";
                                            case WarningType.SingleIssue:
                                                return "info";
                                            case WarningType.PolicyViolation:
                                                return "new_releases";
                                        }
                                    })()}
                                    tooltip={title}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={"width: 100%"}>
                                <div class={"rw-mdc-cardSubtitle"}>
                                    <a
                                        href={RedWarnStore.articlePath(
                                            `Template:${warning.template}${
                                                warning.type ===
                                                WarningType.Tiered
                                                    ? warning.levels[0] === 5
                                                        ? "4im"
                                                        : warning.levels[0]
                                                    : ""
                                            }`
                                        )}
                                        target="_blank"
                                    >
                                        &#123;&#123;{warning.template}
                                        &#125;&#125;
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class={"rw-mdc-cardSubtitle"}>
                                    {warning.type === WarningType.Tiered &&
                                        `Available levels: ${warning.levels
                                            .map((v) => {
                                                return `${WarningLevel[v]} (${
                                                    v === WarningLevel.Immediate
                                                        ? "4im"
                                                        : v
                                                })`;
                                            })
                                            .join(", ")}`}
                                    {warning.type === WarningType.SingleIssue &&
                                        `Single-issue warning`}
                                    {warning.type ===
                                        WarningType.PolicyViolation &&
                                        `Policy violation warning`}
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            );

            warningCard.addEventListener("click", (event) => {
                props.dialog.performSelect(
                    Object.assign(event, { warningId: id })
                );
            });
            props.dialog.addSelectListener((v) => {
                warningCard.classList.toggle(
                    "rw-warning-selected",
                    v.warningId === id
                );
            });
            props.dialog.addChangeListener((event) => {
                if (event.value.length === 0) {
                    warningCard.classList.toggle("rw-warnSearch-hidden", false);
                    return;
                }

                const searchRegex = new RegExp(regexEscape(event.value), "gi");

                warningCard.classList.toggle(
                    "rw-warnSearch-hidden",
                    !searchRegex.test(warning.name) &&
                        (warning.keywords == null
                            ? true
                            : !warning.keywords.reduce(
                                  (result, keyword) =>
                                      result || searchRegex.test(keyword),
                                  false
                              )) &&
                        !searchRegex.test(warning.template)
                );
            });
            categoryWarningCards.push(warningCard);
        }

        props.dialog.addChangeListener(() => {
            categoryHeader.classList.toggle(
                "rw-warnSearch-hidden",
                categoryWarningCards.filter((v) =>
                    v.classList.contains("rw-warnSearch-hidden")
                ).length == categoryWarningCards.length
            );
        });

        warningElements.push(...categoryWarningCards);
    }

    return (
        <div class={"rw-mdc-warnSearchDialog--warnings"}>{warningElements}</div>
    );
}

export default class MaterialWarnSearchDialog extends RWUIDialog {
    public constructor(props: MaterialWarnSearchDialogProperties) {
        super(props);
        this.props.width = props.width ?? "80vw";
    }

    selectedWarning: Warning;
    private actions: JSX.Element; // For updating.

    // Event-related functions below.
    events = {
        change: [] as ((
            event: KeyboardEvent & { value: string }
        ) => void | boolean)[],
        select: [] as ((
            event: MouseEvent & { warningId: string }
        ) => void | boolean)[],
    };
    addChangeListener(
        listener: (event: KeyboardEvent & { value: string }) => void
    ): void {
        this.events.change.push(listener);
    }
    addSelectListener(
        listener: (event: MouseEvent & { warningId: string }) => void
    ): void {
        this.events.select.push(listener);
    }

    performChange(event: KeyboardEvent & { value: string }) {
        for (const handler of this.events["change"]) {
            if (!(handler(event) ?? true)) break;
        }
    }
    performSelect(event: MouseEvent & { warningId: string }) {
        for (const handler of this.events["select"]) {
            if (!(handler(event) ?? true)) break;
        }
        this.selectedWarning = Warnings[event.warningId];
        this.actions.parentElement.replaceChild(
            <MaterialDialogActions>
                {this.renderActions()}
            </MaterialDialogActions>,
            this.actions
        );
    }
    // Event-related functions above.

    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    show(): Promise<any> {
        const styleStorage = getMaterialStorage();
        registerMaterialDialog(this);
        const dialog = upgradeMaterialDialog(this);

        return new Promise((resolve) => {
            dialog.listen("MDCDialog:closed", async () => {
                styleStorage.dialogTracker.delete(this.id);
                resolve(this.selectedWarning);
            });
        });
    }

    /**
     * Renders the MaterialWarnSearchDialog's actions (as buttons).
     * @return A collection of {@link HTMLButtonElement}s, all of which are MDL buttons.
     */
    private renderActions(): ComponentChild[] {
        return [
            <MaterialButton dialogAction={"cancel"}>Cancel</MaterialButton>,
            <MaterialButton
                dialogAction={"submit"}
                disabled={this.selectedWarning == null}
            >
                Select
            </MaterialButton>,
        ];
    }

    /**
     * Renders a MaterialWarnSearchDialog.
     *
     * NOTE: Only use this when appending to body! Otherwise, use {@link MaterialWarnSearchDialog.element}.
     * @returns A {@link HTMLDialogElement}.
     */
    render(): HTMLDialogElement {
        return (this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "class": "mdc-dialog__surface rw-mdc-warnSearchDialog",
                    "style": `width:${this.props.width ?? "70vw"};height:90vh;`,
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog",
                }}
                id={this.id}
            >
                <MaterialDialogTitle>
                    {this.props.title ?? "Warnings"}
                </MaterialDialogTitle>
                <MaterialDialogContent>
                    <MaterialWarnSearchDialogSearchBar
                        callback={(event) => {
                            this.performChange(event);
                        }}
                    />
                    <MaterialWarnSearchDialogWarnings dialog={this} />
                </MaterialDialogContent>
                {
                    (this.actions = (
                        <MaterialDialogActions>
                            {this.renderActions()}
                        </MaterialDialogActions>
                    ))
                }
            </MaterialDialog>
        ) as HTMLDialogElement);
    }
}
