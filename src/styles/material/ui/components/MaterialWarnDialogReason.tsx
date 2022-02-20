import { MaterialWarnDialogChildProps } from "rww/styles/material/ui/MaterialWarnDialog";

import {
    getWarningFieldVisibility,
    Page,
    User,
    Warning,
    WarningLevel,
    WarningLevelComments,
    WarningManager,
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
import MaterialWarnDialogRecentPages from "rww/styles/material/ui/components/MaterialWarnDialogRecentPages";
import classMix from "rww/styles/material/util/classMix";

function MaterialWarnDialogReasonDropdown({
    parent,
}: {
    parent: MaterialWarnDialogReason;
}): JSX.Element {
    const finalSelectItems: MaterialSelectItem<Warning>[] = [];
    for (const [category, warningSet] of Object.entries(
        WarningManager.warningArrayByCategories
    )) {
        if (finalSelectItems.length !== 0)
            finalSelectItems.push({
                type: "divider",
            });
        finalSelectItems.push({
            type: "header",
            label: WarningManager.warningCategoriesMap[category].label,
        });

        for (const warning of warningSet) {
            finalSelectItems.push({
                type: "action",
                label: warning.name,
                value: warning,
                selected: parent.props.defaultReason === warning,
            });
        }
    }

    let isSearchOpen = false;
    const element = (
        <span class="rw-mdc-warnDialog-reason--dropdown">
            <MaterialSelect<Warning>
                label={i18next
                    .t("ui:warn.reason.warningSelectionDropdownTitle")
                    .toString()}
                items={finalSelectItems}
                required={true}
                onChange={(index, value) => {
                    parent.warning = value;
                }}
                onKeyDown={async (key) => {
                    // Only allow single-character keys.
                    if (!/^.$/g.test(key.key)) return;

                    // Prevent action on rapid keypress.
                    const lastPress = (key.target as HTMLElement).getAttribute(
                        "data-last-keydown"
                    );
                    if (lastPress && Date.now() < +lastPress + 500) return;
                    (key.target as HTMLElement).setAttribute(
                        "data-last-keydown",
                        `${Date.now()}`
                    );

                    if (!isSearchOpen) {
                        // Open search dialog
                        isSearchOpen = true;
                        const newWarning = await new MaterialWarnSearchDialog({
                            startingText: key.key,
                        }).show();
                        const select: MaterialSelectElement<Warning> =
                            element.querySelector(".mdc-select");
                        select.setItem(newWarning);
                        isSearchOpen = false;
                    }
                }}
            />
            <MaterialIconButton
                class={"rw-mdc-warnDialog-reason--search"}
                icon={"search"}
                label={i18next
                    .t("ui:warn:reason:searchDialogOpenerTooltip")
                    .toString()}
                onClick={async () => {
                    const newWarning = await new MaterialWarnSearchDialog({
                        selectedWarning: parent.warning,
                    }).show();
                    const select: MaterialSelectElement<Warning> =
                        element.querySelector(".mdc-select");
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
                const radios: MaterialRadioProps<WarningLevel>[] = [];
                for (
                    let level = WarningLevel.Notice;
                    level <= WarningLevel.Immediate;
                    level++
                ) {
                    const comments = WarningLevelComments[level];
                    if (parent.warning.levels.includes(level)) {
                        radios.push({
                            value: level,
                            checked: parent.warningLevel == level,
                            tooltip: i18next.t(
                                "ui:warn.reason.levelSelectionLevel",
                                {
                                    level: comments.alternative ?? level,
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
                        radios.push({
                            value: level,
                            tooltip: i18next.t(
                                "ui:warn.reason.levelSelectionLevelNotPresent",
                                {
                                    level: comments.alternative ?? level,
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
                selectorElement = (
                    <b>
                        {i18next
                            .t("ui:warn.reason.singleIssueTemplate")
                            .toString()}
                    </b>
                );
                break;
            case WarningType.PolicyViolation:
                selectorElement = (
                    <b>
                        {i18next
                            .t("ui:warn.reason.policyViolationTemplate")
                            .toString()}
                    </b>
                );
                break;
        }
    }
    // TODO i18n
    else
        selectorElement = (
            <span>{i18next.t<string>("ui:warn.reason.noWarningSelected")}</span>
        );

    return Object.assign(
        <div class="rw-mdc-warnDialog-reason--levels">
            <table>
                <tr>
                    <td>{i18next.t<string>("ui:warn.reason.warningLevel")}</td>
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
        recentPagesButton?: {
            element: JSX.Element;
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
            for (
                let highestPossibleLevel = this.defaultLevel;
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
            // Defer to the lowest level provided by warning.
            this.warningLevel = value.levels[0];
        } else {
            this.warningLevel = null;
        }
        this.props.warnDialog.updatePreview(true);
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

        this.props.warnDialog.updatePreview(true);
    }
    get relatedPage(): string {
        return this.elementSet.page?.components?.textField?.value ?? null;
    }
    set relatedPage(value: string) {
        if (this.elementSet.page)
            this.elementSet.page.components.textField.value = value;
        this.props.warnDialog.updatePreview(true);
    }
    get additionalText(): string {
        return (
            this.elementSet.additionalText?.components?.textField?.value ?? null
        );
    }
    set additionalText(value: string) {
        if (this.elementSet.additionalText)
            this.elementSet.additionalText.components.textField.value = value;
        this.props.warnDialog.updatePreview(true);
    }

    defaultLevel: WarningLevel;

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
                {this.warning?.note && (
                    <div class="rw-mdc-warnDialog-reason-note">
                        {this.warning.note}
                    </div>
                )}
                <div
                    class={classMix(
                        "rw-mdc-warnDialog-page",
                        typeof this.warning?.relatedPage === "object" &&
                            this.warning.relatedPage?.recentPages === false &&
                            "rw-warnDialog-hideRecentPages"
                    )}
                >
                    {((): JSX.Element => {
                        // Do not use a null coalescing operator to reuse the related page,
                        // this must be rebuilt every time.
                        let label =
                            typeof this.warning?.relatedPage === "object"
                                ? this.warning.relatedPage?.label
                                : null;
                        if (label == null)
                            label = i18next.t<string>("ui:warn.reason.page");

                        const textInput = (
                            <MaterialTextInput
                                class={"rw-mdc-warnDialog-page--textField"}
                                label={label}
                                defaultText={
                                    this.elementSet?.page?.components?.textField
                                        ?.value ??
                                    this.props.relatedPage?.title?.getPrefixedText() ??
                                    ""
                                }
                                autofocus
                                {...(this.warning != null
                                    ? {
                                          [getWarningFieldVisibility(
                                              this.warning.relatedPage
                                          )]: true,
                                      }
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
                    {this.elementSet.recentPagesButton?.element ??
                        ((): JSX.Element => {
                            return (
                                <MaterialIconButton
                                    class={"rw-mdc-warnDialog-page--recent"}
                                    icon={"today"}
                                    label={i18next
                                        .t(
                                            "ui:warn.reason.recentPageOpenerTooltip"
                                        )
                                        .toString()}
                                    onClick={async () => {
                                        const newPage =
                                            await new MaterialWarnDialogRecentPages().show();
                                        if (newPage) this.relatedPage = newPage;
                                    }}
                                />
                            );
                        })()}
                </div>
                {((): JSX.Element => {
                    // Do not use a null coalescing operator to reuse the related page,
                    // this must be rebuilt every time.
                    let label =
                        typeof this.warning?.additionalText === "object"
                            ? this.warning.additionalText?.label
                            : null;
                    if (label == null)
                        label = i18next.t<string>(
                            "ui:warn.reason.additionalText"
                        );

                    const textInput = (
                        <MaterialTextInput
                            width={"100%"}
                            label={label}
                            defaultText={
                                this.elementSet?.additionalText?.components
                                    ?.textField?.value ?? ""
                            }
                            autofocus
                            {...(this.warning != null
                                ? {
                                      [getWarningFieldVisibility(
                                          this.warning.additionalText
                                      )]: true,
                                  }
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
