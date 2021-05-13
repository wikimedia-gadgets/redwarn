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
import { MDCDialog } from "@material/dialog";
import i18next from "i18next";

interface MaterialWarnSearchDialogProperties extends RWUIDialogProperties {
    selectedWarning?: Warning; // autoselect the current selection
    startingText?: string; // what to prefill the warning text with
}

function MaterialWarnSearchDialogSearchBar(props: {
    callback: (event: KeyboardEvent & { value: string }) => void | boolean;
    defaultText?: string;
    focusOut?: () => void; // focusOut event
}): JSX.Element {
    const input = (
        <MaterialTextInput
            class={"rw-mdc-warnSearchDialog--searchInput"}
            label={
                i18next.t(
                    "ui:warn:templateSearchDialog:searchBoxLabel"
                ) /* ST: "Search for a warning..." */
            }
            defaultText={props.defaultText ? props.defaultText : ""}
        />
    );
    const mdcTextInput = MaterialTextInputUpgrade(input);

    const updateEvent = (event: any) => {
        // Type skip but that's okay in this care
        props.callback(
            Object.assign(event, { value: mdcTextInput.textField.value })
        );
    };

    mdcTextInput.textField.listen("keyup", updateEvent);
    // Two reasons for this one: 1. so it shows the press Enter when focus is re-established, and 2. so it updates when opened
    mdcTextInput.textField.listen("focusin", updateEvent);

    // If there is default text, on focus, focus to the end then remove this listener so it only happens once
    if (props.defaultText != null) {
        // Define the func
        const focusToEnd = (e: Event) => {
            const txtBox = e.target as HTMLInputElement;
            txtBox.selectionStart = txtBox.selectionEnd = txtBox.value.length;
            mdcTextInput.textField.unlisten("focusin", focusToEnd); // remove this event so it only happens once
        };

        // Add handler
        mdcTextInput.textField.listen("focusin", focusToEnd);
    }

    // Add focusOut handler if requested
    if (props.focusOut)
        mdcTextInput.textField.listen("focusout", props.focusOut);

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
                        // Chlod - what in gods name have you done here :'(
                        (category as unknown) as WarningCategory
                    ]
                }
            </div>
        );
        warningElements.push(categoryHeader);

        const categoryWarningCards: JSX.Element[] = [];

        for (const [id, warning] of Object.entries(warnings)) {
            // Warning card list generation
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
                                        // Where icons are handled for listings
                                        switch (warning.type) {
                                            case WarningType.Tiered:
                                                return "signal_cellular_alt";
                                            case WarningType.SingleIssue:
                                                return "info";
                                            case WarningType.PolicyViolation:
                                                return "new_releases";
                                        }
                                    })()}
                                    ripple={false}
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
                                        {/* Opening and closing curlies */}
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

                                    {/* Shown only when I am the top result (search handles hiding/showing this) */}
                                    <div
                                        class={
                                            "rw-mdc-warnDialog-searchDialogPressToSelect"
                                        }
                                    >
                                        {
                                            // ST: Press ENTER to use this template
                                            i18next
                                                .t(
                                                    "ui:warn:templateSearchDialog:pressXtoSelect"
                                                )
                                                .toString()
                                        }
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            );

            warningCard.addEventListener("click", (event) => {
                if (
                    // If a double click (2 clicks within 300ms), or shift pressed (usually for synthetic event with a double intent)
                    (warningCard.hasAttribute("data-lastclick") &&
                        Date.now() -
                            +warningCard.getAttribute("data-lastclick") <
                            300) ||
                    event.shiftKey
                ) {
                    props.dialog.performSelect(
                        Object.assign(event, { warningId: id })
                    );
                    props.dialog.dialog.close("submit");
                    return;
                }

                warningCard.setAttribute("data-lastclick", `${Date.now()}`);
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
                // on textbox change, this is called on a per card basis!
                // Actual search algorithm here - this doesn't do everything, just checks whether or not the card should hide itself
                if (event.value.length === 0) {
                    warningCard.classList.toggle("rw-warnSearch-hidden", false);
                    return;
                }

                const searchRegex = new RegExp(regexEscape(event.value), "gi");

                warningCard.classList.toggle(
                    "rw-warnSearch-hidden", // toggle this class given
                    // the regex matches
                    !searchRegex.test(warning.name) && // and
                        (warning.keywords == null // there are no warning keywords
                            ? true
                            : !warning.keywords.reduce(
                                  // or there are no matching keywords
                                  (result, keyword) =>
                                      result || searchRegex.test(keyword),
                                  false
                              )) && // AND
                        !searchRegex.test(warning.template) // does not match warning template
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
    // All done
    return (
        <div class={"rw-mdc-warnSearchDialog--warnings"}>{warningElements}</div>
    );
}

export default class MaterialWarnSearchDialog extends RWUIDialog {
    public constructor(props: MaterialWarnSearchDialogProperties) {
        super(props);
        this.props.width = props.width ?? "80vw";
    }

    dialog: MDCDialog;
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

        const oldActions = this.actions;

        // Tip for the dialog
        oldActions.parentElement.replaceChild(
            (this.actions = (
                <MaterialDialogActions>
                    <div class={"rw-mdc-dialog-helperText rw-mdc-subtitle"}>
                        {
                            /* Tip string, sample text: Tip: Double click... */
                            i18next
                                .t("ui:warn:templateSearchDialog:tip")
                                .toString()
                        }
                    </div>
                    {this.renderActions()}
                </MaterialDialogActions>
            )),
            oldActions
        );
    }
    // Event-related functions above.

    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    show(): Promise<Warning> {
        const styleStorage = getMaterialStorage();
        registerMaterialDialog(this);
        this.dialog = upgradeMaterialDialog(this);

        return new Promise((resolve) => {
            this.dialog.listen("MDCDialog:closed", async () => {
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
                    {this.props.title ??
                        i18next
                            .t("ui:warn:templateSearchDialog:dialogTitle")
                            .toString()}
                </MaterialDialogTitle>
                <MaterialDialogContent>
                    <MaterialWarnSearchDialogSearchBar
                        callback={(event) => {
                            this.performChange(event);

                            // To show PRESS ENTER and "results not found" text
                            // There is defo a better way to do this but this is what works
                            // Now run a query on this dialog and find all items that aren't hidden
                            const searchResults = this.element.querySelectorAll(
                                `.rw-mdc-warnSearchDialog--warnings > .rw-mdc-warnSearchDialog-warning.mdc-card:not(.rw-warnSearch-hidden)`
                            );

                            if (searchResults.length == 0) return; // No results, no need to continue

                            // If ENTER pressed, it's time to select it
                            if (event.key == "Enter") {
                                searchResults[0].dispatchEvent(
                                    new MouseEvent("click", {
                                        shiftKey: true, // so it is handled like a double click, i.e. it is immediately selected
                                    })
                                );
                                return; // we're done
                            }

                            // For each result card, clear style attribute for text
                            searchResults.forEach((el: Element, i: number) => {
                                // Make PRESS ENTER text visible for first result only, all others hidden
                                const pressToSelectTxt = el.querySelector(
                                    ".rw-mdc-warnDialog-searchDialogPressToSelect"
                                );
                                if (i == 0) {
                                    // Top result is what will be selected, so we show this text
                                    pressToSelectTxt.setAttribute(
                                        "style",
                                        "display:inherit;"
                                    );
                                } else {
                                    pressToSelectTxt.removeAttribute("style"); // Remove all styling so it defaults to hidden
                                }
                            });
                        }}
                        focusOut={() => {
                            // On focusout, clear all press enter to select labels
                            const searchResults = this.element.querySelectorAll(
                                `.rw-mdc-warnSearchDialog--warnings > .rw-mdc-warnSearchDialog-warning.mdc-card:not(.rw-warnSearch-hidden)`
                            );

                            // For each result card, clear style attribute for text
                            if (searchResults.length != 0)
                                searchResults.forEach(
                                    (el: Element) =>
                                        el
                                            .querySelector(
                                                ".rw-mdc-warnDialog-searchDialogPressToSelect"
                                            )
                                            .removeAttribute("style") // Remove all styling so it defaults to hidden
                                );
                        }}
                        defaultText={
                            /* BUG TO FIX! */ (this
                                .props as MaterialWarnSearchDialogProperties)
                                .startingText
                        }
                    />
                    <MaterialWarnSearchDialogWarnings dialog={this} />
                </MaterialDialogContent>
                {
                    (this.actions = (
                        <MaterialDialogActions>
                            <div
                                class={
                                    "rw-mdc-dialog-helperText rw-mdc-subtitle"
                                }
                            >
                                {
                                    /* Tip string, sample text: Tip: Double click... */
                                    i18next
                                        .t("ui:warn:templateSearchDialog:tip")
                                        .toString()
                                }
                            </div>
                            {this.renderActions()}
                        </MaterialDialogActions>
                    ))
                }
            </MaterialDialog>
        ) as HTMLDialogElement);
    }
}
