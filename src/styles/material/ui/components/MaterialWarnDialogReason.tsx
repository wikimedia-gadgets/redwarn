import { MaterialWarnDialogChildProps } from "rww/styles/material/ui/MaterialWarnDialog";

import {
    Page,
    User,
    Warning,
    WarningCategory,
    WarningCategoryNames,
    WarningLevel,
    WarningLevelComments,
    Warnings,
    WarningType,
} from "rww/mediawiki";

import { h } from "tsx-dom";

import MaterialSelect, {
    MaterialSelectElement,
    MaterialSelectItem,
} from "rww/styles/material/ui/components/MaterialSelect";

import { MaterialWarnDialogChild } from "rww/styles/material/ui/components/MaterialWarnDialogChild";

import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";

import MaterialRadioField, {
    MaterialRadioFieldElement,
} from "rww/styles/material/ui/components/MaterialRadioField";

import { MaterialRadioProps } from "rww/styles/material/ui/components/MaterialRadio";

import MaterialIcon from "./MaterialIcon";

import { WarningIcons } from "rww/styles/material/data/WarningIcons";

import MaterialTextInput, {
    MaterialTextInputComponents,
    MaterialTextInputUpgrade,
} from "rww/styles/material/ui/components/MaterialTextInput";

import i18next from "i18next";

import MaterialWarnSearchDialog from "rww/styles/material/ui/MaterialWarnSearchDialog";

function MaterialWarnDialogReasonDropdown({
    parent,
}: {
    parent: MaterialWarnDialogReason;
}): JSX.Element {
    const finalSelectItems: MaterialSelectItem<Warning>[] = [];
    const categories: { [key: number]: Warning[] } = {
        [WarningCategory.Common]: [],
        [WarningCategory.Article]: [],
        [WarningCategory.Spam]: [],
        [WarningCategory.Editors]: [],
        [WarningCategory.Remove]: [],
        [WarningCategory.Other]: [],
        [WarningCategory.Remind]: [],
        [WarningCategory.Policy]: [],
    };

    for (const [, warning] of Object.entries(Warnings)) {
        categories[warning.category].push(warning);
    }

    for (const [category, warningSet] of Object.entries(categories)) {
        if (finalSelectItems.length !== 0)
            finalSelectItems.push({
                type: "divider",
            });
        finalSelectItems.push({
            type: "header",
            label: WarningCategoryNames[+category as WarningCategory],
        });

        for (const warning of warningSet) {
            finalSelectItems.push({
                type: "action",
                label: warning.name,
                value: warning,
            });
        }
    }

    let hasBeenSomeTimeAfterLastKeyDown = true; // Used to prevent multiple dialogs from being opened by faster typers
    const element = (
        <span class="rw-mdc-warnDialog-reason--dropdown">
            <MaterialSelect<Warning>
                label={
                    /* ST: "Warning" */ i18next
                        .t("ui:warn:reason:warningSelectionDropdownTitle")
                        .toString()
                }
                items={finalSelectItems}
                required={true}
                onChange={(index, value) => {
                    parent.warning = value;
                }}
                onKeyDown={async (key) => {
                    // To prevent multiple dialog openings
                    if (!hasBeenSomeTimeAfterLastKeyDown) return; // exit if we're still waiting
                    hasBeenSomeTimeAfterLastKeyDown = false; // disable all other calls
                    setTimeout(() => {
                        hasBeenSomeTimeAfterLastKeyDown = true;
                    }, 500); // reset after 500ms

                    // Open dialog
                    const newWarning = await new MaterialWarnSearchDialog({
                        startingText: key, // Define that we do want to prefill the text box with this key
                    }).show();
                    // parent.warning = newWarning;
                    const select: MaterialSelectElement<Warning> = element.querySelector(
                        ".mdc-select"
                    );
                    select.setItem(newWarning);
                }}
            />
            <MaterialIconButton
                class={"rw-mdc-warnDialog-reason--search"}
                icon={"search"}
                label={
                    /* ST: "Search for a warning" */ i18next
                        .t("ui:warn:reason:searchDialogOpenerTooltip")
                        .toString()
                }
                onClick={async () => {
                    const newWarning = await new MaterialWarnSearchDialog({
                        selectedWarning: parent.warning,
                    }).show();
                    // parent.warning = newWarning;
                    const select: MaterialSelectElement<Warning> = element.querySelector(
                        ".mdc-select"
                    );
                    select.setItem(newWarning);
                }}
            />
        </span>
    );

    return element;
}

function MaterialWarnDialogReasonLevel({
    parent,
}: {
    parent: MaterialWarnDialogReason;
}): JSX.Element & { update?: (level: WarningLevel) => void } {
    let selectorElement: JSX.Element;
    let updater: (level: WarningLevel) => void;

    if (parent.warning != null) {
        switch (parent.warning.type) {
            case WarningType.Tiered: {
                // The vast majority of templates that aren't single use are handled here
                const radios: MaterialRadioProps<WarningLevel>[] = [];
                for (
                    let level = WarningLevel.Notice;
                    level <= WarningLevel.Immediate;
                    level++
                ) {
                    const comments = WarningLevelComments[level]; // used in both cases so we can take out of ifelse
                    if (parent.warning.levels.includes(level)) {
                        // When a template is present for this level
                        radios.push({
                            value: level,
                            checked: parent.warningLevel == level,
                            /*
                            Sample text: Level 1 notice: for blah...
                            */
                            tooltip: i18next.t(
                                "ui:warn:reason:levelSelectionLevel",
                                {
                                    level,
                                    // Lowercase so it makes grammatical sense
                                    levelReadable: (
                                        comments.summary ?? WarningLevel[level]
                                    ).toLocaleLowerCase(),
                                    levelDescription: comments.description,
                                }
                            ),
                            children: (
                                <MaterialIcon icon={WarningIcons[level].icon} />
                            ),
                        });
                    } else {
                        // Else, when no template is present for this level
                        radios.push({
                            value: level,
                            /*
                            Sample text: This template does not have a level x blah template.
                            */
                            tooltip: i18next.t(
                                "ui:warn:reason:levelSelectionLevelNotPresent",
                                {
                                    level,
                                    // Lowercase so it makes grammatical sense
                                    levelReadable: (
                                        comments.summary ?? WarningLevel[level]
                                    ).toLocaleLowerCase(),
                                }
                            ),
                            disabled: true,
                            children: (
                                <MaterialIcon
                                    icon={WarningIcons[level].icon}
                                    iconColor={"gray"}
                                />
                            ),
                        });
                    }
                }

                const radioField = (
                    <MaterialRadioField<WarningLevel>
                        radios={radios}
                        onChange={(level) => {
                            parent.warningLevel = level;
                        }}
                    />
                ) as MaterialRadioFieldElement<WarningLevel>;
                updater = (level) => {
                    for (const radio of radioField.MDCRadios) {
                        if (radio.radioValue === level) {
                            radio.MDCRadio.checked = true;
                        }
                    }
                };
                selectorElement = radioField;
                break;
            }
            case WarningType.SingleIssue:
                selectorElement = <b>Reminder</b>;
                break;
            case WarningType.PolicyViolation:
                selectorElement = <b>Policy Violation Warning</b>;
                break;
        }
    }
    // TODO i18n
    else selectorElement = <span>No warning selected.</span>;

    return Object.assign(
        <div class="rw-mdc-warnDialog-reason--levels">
            <table>
                <tr>
                    <td>Warning level</td>
                    <td>{selectorElement}</td>
                </tr>
            </table>
        </div>,
        {
            update: updater,
        }
    );
}

type MaterialWarnDialogReasonProps = MaterialWarnDialogChildProps & {
    defaultReason?: Warning;
    defaultLevel?: WarningLevel;
    relatedPage?: Page;
};

class MaterialWarnDialogReason extends MaterialWarnDialogChild {
    private elementSet: {
        root?: JSX.Element;
        dropdown?: JSX.Element;
        levels?: JSX.Element & { update?: (level: WarningLevel) => void };
        page?: {
            element: JSX.Element;
            components: MaterialTextInputComponents;
        };
        additionalText?: {
            element: JSX.Element;
            components: MaterialTextInputComponents;
        };
    } = {};

    get user(): User {
        return this.props.warnDialog.user;
    }

    private _warning: Warning;
    get warning(): Warning {
        return this._warning;
    }
    set warning(value: Warning) {
        this._warning = value;

        if (value != null && value.type === WarningType.Tiered) {
            // Reassign the warning level to the highest possible value, capped at the current level.
            if (
                this.warningLevel != null &&
                !value.levels.includes(this.warningLevel)
            ) {
                for (
                    let highestPossibleLevel = this.warningLevel;
                    highestPossibleLevel >= 0;
                    highestPossibleLevel--
                ) {
                    if (value.levels.includes(highestPossibleLevel)) {
                        this.warningLevel = highestPossibleLevel;
                        this.refresh();
                        return;
                    }
                }
                // No warning level found. The only available level must be higher up.
                // Defer to lowest level provided by warning.
                this.warningLevel = value.levels[0];
            } else if (!value.levels.includes(this.warningLevel)) {
                this.warningLevel = this.defaultLevel ?? value.levels[0];
            }
        } else {
            this.warningLevel = null;
        }
        this.props.warnDialog.updatePreview();
        this.refresh();
    }
    private _warningLevel: null | WarningLevel;
    get warningLevel(): null | WarningLevel {
        return this._warningLevel;
    }
    set warningLevel(value: null | WarningLevel) {
        this._warningLevel = value;
        if (this.elementSet.levels?.update)
            this.elementSet.levels.update(value);

        this.props.warnDialog.updatePreview();
    }
    get relatedPage(): string {
        return this.elementSet.page?.components?.textField?.value ?? null;
    }
    set relatedPage(value: string) {
        if (this.elementSet.page)
            this.elementSet.page.components.textField.value = value;
    }
    get additionalText(): string {
        return (
            this.elementSet.additionalText?.components?.textField?.value ?? null
        );
    }
    set additionalText(value: string) {
        if (this.elementSet.additionalText)
            this.elementSet.additionalText.components.textField.value = value;
    }

    private readonly defaultLevel: WarningLevel;

    constructor(readonly props: MaterialWarnDialogReasonProps) {
        super();
        this.warningLevel = this.defaultLevel = props.defaultLevel;
        this.warning = props.defaultReason;
    }

    refresh(): void {
        const keyListener = (textInput: JSX.Element, instant = false) => {
            return () => {
                if (instant) return this.props.warnDialog.updatePreview();

                // Time in milliseconds to wait input for.
                const HOLD_TIME = 500;
                textInput.setAttribute("data-last-keydown", `${Date.now()}`);
                setTimeout(() => {
                    if (
                        Date.now() -
                            +textInput.getAttribute("data-last-keydown") >=
                        HOLD_TIME
                    )
                        // MaterialWarnDialog will rate-limit updates.
                        this.props.warnDialog.updatePreview();
                }, HOLD_TIME * 1.1);
            };
        };

        const rootId = `rwMdcWarnDialogReason__${this.props.warnDialog.id}`;
        const root = (
            <div id={rootId} class={"rw-mdc-warnDialog-reason"}>
                {this.elementSet.dropdown ??
                    (this.elementSet.dropdown = (
                        <MaterialWarnDialogReasonDropdown parent={this} />
                    ))}
                {
                    (this.elementSet.levels = (
                        <MaterialWarnDialogReasonLevel parent={this} />
                    ) as JSX.Element & {
                        update?: (level: WarningLevel) => void;
                    })
                }
                {this.elementSet.page?.element ??
                    ((): JSX.Element => {
                        const textInput = (
                            <MaterialTextInput
                                width={"100%"}
                                label={i18next.t("ui:warn.reason.page")}
                                defaultText={
                                    this.props.relatedPage?.title ?? ""
                                }
                                autofocus
                                {...(this.warning != null
                                    ? { [this.warning.relatedPage]: true }
                                    : {})}
                            />
                        );
                        const components = MaterialTextInputUpgrade(textInput);
                        this.elementSet.page = {
                            element: textInput,
                            components: components,
                        };
                        components.textField.listen(
                            "focusout",
                            keyListener(textInput),
                            true
                        );
                        components.textField.listen(
                            "keydown",
                            keyListener(textInput)
                        );
                        return textInput;
                    })()}
                {this.elementSet.additionalText?.element ??
                    ((): JSX.Element => {
                        const textInput = (
                            <MaterialTextInput
                                width={"100%"}
                                label={i18next.t(
                                    "ui:warn.reason.additionalText"
                                )}
                                autofocus
                                {...(this.warning != null
                                    ? { [this.warning.additionalText]: true }
                                    : {})}
                            />
                        );
                        const components = MaterialTextInputUpgrade(textInput);
                        this.elementSet.additionalText = {
                            element: textInput,
                            components: components,
                        };
                        components.textField.listen(
                            "focusout",
                            keyListener(textInput),
                            true
                        );
                        components.textField.listen(
                            "keydown",
                            keyListener(textInput)
                        );
                        return textInput;
                    })()}
            </div>
        );

        const existingRoot = document.getElementById(rootId);
        if (existingRoot != null) {
            existingRoot.parentElement.replaceChild(
                (this.elementSet.root = root),
                existingRoot
            );
        } else this.elementSet.root = root;
    }

    render(): JSX.Element {
        this.refresh();
        return this.elementSet.root;
    }
}

export { MaterialWarnDialogReason as MaterialWarnDialogReasonController };
export default function generator(
    props: MaterialWarnDialogReasonProps
): JSX.Element & { MWDReason: MaterialWarnDialogReason } {
    const mwdReason = new MaterialWarnDialogReason(props);
    return Object.assign(mwdReason.render(), {
        MWDReason: mwdReason,
    });
}
