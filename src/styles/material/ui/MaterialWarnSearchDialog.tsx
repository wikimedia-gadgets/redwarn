import { ComponentChild, h } from "tsx-dom";

import { RWUIDialog, RWUIDialogProperties } from "rww/ui/elements/RWUIDialog";
import { upgradeMaterialDialog } from "rww/styles/material/Material";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";

import "../css/warnDialog.css";
import { Warning, WarningManager } from "rww/mediawiki";
import MaterialTextInput, {
    MaterialTextInputUpgrade,
} from "rww/styles/material/ui/components/MaterialTextInput";
import { regexEscape } from "rww/util";
import i18next from "i18next";
import MaterialWarnSearchDialogCard from "rww/styles/material/ui/components/MaterialWarnSearchDialogCard";

interface MaterialWarnSearchDialogProperties extends RWUIDialogProperties {
    /**
     * Automatically-selected warning for pre-selected warning search dialogs.
     */
    selectedWarning?: Warning;
    /**
     * The text to prefill the search dialog with.
     */
    startingText?: string;
}

function MaterialWarnSearchDialogSearchBar(props: {
    events: {
        onChange: (event: Event & { value: string }) => void | boolean;
        onSubmit?: (value: string) => void | boolean;
    };
    defaultText?: string;
}): JSX.Element {
    const input = (
        <MaterialTextInput
            class={"rw-mdc-warnSearchDialog--searchInput"}
            label={i18next.t("ui:warn.templateSearchDialog.searchBoxLabel")}
            defaultText={props.defaultText ?? ""}
        />
    );
    const mdcTextInput = MaterialTextInputUpgrade(input);

    // Trigger the `onChange` event when a key is pressed.
    mdcTextInput.textField.listen("keyup", (event: KeyboardEvent) => {
        props.events.onChange(
            Object.assign(event, { value: mdcTextInput.textField.value })
        );

        if (event.key === "Enter")
            props.events.onSubmit(
                document
                    .querySelector(".rw-mdc-warnSearchDialog-warning--top")
                    .getAttribute("data-rw-warning")
            );
    });

    // Move the cursor to the end of the box if the box contains starting text.
    if (props.defaultText != null) {
        const focusToEnd = (e: Event) => {
            const txtBox = e.target as HTMLInputElement;
            txtBox.selectionStart = txtBox.selectionEnd = txtBox.value.length;
            // Unlisten after firing once
            mdcTextInput.textField.unlisten("focusin", focusToEnd);
        };

        mdcTextInput.textField.listen("focusin", focusToEnd);
    }

    const searchBar = (
        <div class={"rw-mdc-warnSearchDialog--searchBar"}>{input}</div>
    );

    // Toggleable class for instant selection tip.
    mdcTextInput.textField.listen("focusout", () => {
        searchBar.classList.toggle(
            "rw-mdc-warnSearchDialog--searchBar--focused",
            false
        );
    });
    mdcTextInput.textField.listen("focusin", () => {
        searchBar.classList.toggle(
            "rw-mdc-warnSearchDialog--searchBar--focused",
            true
        );
    });

    return searchBar;
}

function MaterialWarnSearchDialogWarnings(props: {
    dialog: MaterialWarnSearchDialog;
}): JSX.Element {
    const warningElements: JSX.Element[] = [];

    for (const [category, warnings] of Object.entries(
        WarningManager.warningsByCategories
    )) {
        const categoryHeader = (
            <div
                class="rw-warningCategory"
                data-rw-warningCategory={
                    WarningManager.warningCategoriesMap[category].id
                }
            >
                {WarningManager.warningCategoriesMap[category].label}
            </div>
        );
        warningElements.push(categoryHeader);

        const categoryWarningCards: JSX.Element[] = [];

        for (const [id, warning] of Object.entries(warnings)) {
            // Generate cards for every warning
            const warningCard = (
                <MaterialWarnSearchDialogCard id={id} warning={warning} />
            );

            warningCard.addEventListener("click", (event) => {
                if (
                    // If a double click (2 clicks within 300ms), or shift pressed (usually for synthetic events with a double intent)
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

            // Checks whether or not the card should be hidden or not.
            props.dialog.addChangeListener((event) => {
                // This is called for every card on the list.

                if (event.value == null || event.value.length === 0) {
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

    // To be called at the end of every single card update.
    props.dialog.addChangeListener(() => {
        // Remove the currently-tracked element.
        document
            .querySelectorAll(".rw-mdc-warnSearchDialog-warning--top")
            .forEach((element) => {
                // Remove the tracking class.
                element.classList.remove(
                    "rw-mdc-warnSearchDialog-warning--top"
                );

                // Remove the label.
                const instantSelectLabel = document.querySelector(
                    ".rw-mdc-warnDialog-searchDialog-instantSelect"
                );
                instantSelectLabel.parentElement.removeChild(
                    instantSelectLabel
                );
            });

        // Sequentially search through the cards to find the first non-hidden one.
        for (const card of warningElements) {
            if (
                !card.classList.contains("rw-warnSearch-hidden") &&
                card.classList.contains("rw-mdc-warnSearchDialog-warning")
            ) {
                // Add the special tracking class.
                card.classList.add("rw-mdc-warnSearchDialog-warning--top");

                // Add the label.
                card.querySelector("table").insertAdjacentElement(
                    "afterend",
                    <div class={"rw-mdc-warnDialog-searchDialog-instantSelect"}>
                        {i18next
                            .t("ui:warn.templateSearchDialog.instantSelect")
                            .toString()}
                    </div>
                );
                break;
            }
        }
    });

    return (
        <div class={"rw-mdc-warnSearchDialog--warnings"}>{warningElements}</div>
    );
}

export default class MaterialWarnSearchDialog extends RWUIDialog<Warning> {
    public constructor(props: MaterialWarnSearchDialogProperties) {
        super(props);
        this.props.width = props.width ?? "80vw";
    }

    selectedWarning: Warning;
    private actions: JSX.Element; // For updating.

    // Event-related functions below.
    events = {
        change: [] as ((event: Event & { value: string }) => void | boolean)[],
        select: [] as ((
            event: MouseEvent & { warningId: string }
        ) => void | boolean)[],
    };
    addChangeListener(
        listener: (event: Event & { value: string }) => void
    ): void {
        this.events.change.push(listener);
    }
    addSelectListener(
        listener: (event: MouseEvent & { warningId: string }) => void
    ): void {
        this.events.select.push(listener);
    }

    performChange(event: Event & { value: string }) {
        for (const handler of this.events["change"]) {
            if (!(handler(event) ?? true)) break;
        }
    }
    performSelect(event: MouseEvent & { warningId: string }) {
        for (const handler of this.events["select"]) {
            if (!(handler(event) ?? true)) break;
        }
        this.selectedWarning = WarningManager.warnings[event.warningId];

        const oldActions = this.actions;

        // Tip for the dialog
        oldActions.parentElement.replaceChild(
            (this.actions = (
                <MaterialDialogActions>
                    <div class={"rw-mdc-dialog-helperText rw-mdc-subtitle"}>
                        {i18next
                            .t("ui:warn.templateSearchDialog.tip")
                            .toString()}
                    </div>
                    {this.renderActions()}
                </MaterialDialogActions>
            )),
            oldActions
        );
    }
    // Event-related functions above.

    props: MaterialWarnSearchDialogProperties;

    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    show(): Promise<Warning> {
        return upgradeMaterialDialog(this, {
            onClose: () => this.selectedWarning,
        }).then((v) => v.wait());
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
        this.element = (
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
                            .t("ui:warn.templateSearchDialog.dialogTitle")
                            .toString()}
                </MaterialDialogTitle>
                <MaterialDialogContent>
                    <MaterialWarnSearchDialogSearchBar
                        events={{
                            onChange: (event) => {
                                this.performChange(event);
                            },
                            onSubmit: (warningId) => {
                                this.selectedWarning =
                                    WarningManager.warnings[warningId];
                                this.dialog.close("submit");
                            },
                        }}
                        defaultText={this.props.startingText}
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
                                {i18next
                                    .t("ui:warn.templateSearchDialog.tip")
                                    .toString()}
                            </div>
                            {this.renderActions()}
                        </MaterialDialogActions>
                    ))
                }
            </MaterialDialog>
        ) as HTMLDialogElement;

        // Immediately trigger necessary changes.
        this.performChange(
            Object.assign(new Event("dummy"), {
                value: this.props.startingText,
            })
        );

        return this.element;
    }
}
