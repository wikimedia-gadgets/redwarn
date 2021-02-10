import { MaterialWarnDialogChildProps } from "rww/styles/material/ui/MaterialWarnDialog";
import {
    User,
    Warning,
    WarningCategory,
    WarningCategoryNames,
    Warnings,
} from "rww/mediawiki";
import { h } from "tsx-dom";
import MaterialSelect, {
    MaterialSelectItem,
} from "rww/styles/material/ui/components/MaterialSelect";
import { MaterialWarnDialogChild } from "rww/styles/material/ui/components/MaterialWarnDialogChild";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";
import MaterialRadioField from "rww/styles/material/ui/components/MaterialRadioField";

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

    return (
        <span class="rw-mdc-warnDialog-reason--dropdown">
            <MaterialSelect<Warning>
                label={"Warning"}
                items={finalSelectItems}
                required={true}
                onChange={(index, value) => {
                    parent.warning = value;
                }}
            />
            <MaterialIconButton
                class={"rw-mdc-warnDialog-reason--search"}
                icon={"search"}
                label={"Search for a warning"}
                onClick={() => {
                    // TODO Open warning search dialog and set that as warning
                    // Access the select items with MDCSelect
                }}
            />
        </span>
    );
}

function MaterialWarnDialogReasonLevel({
    parent,
}: {
    parent: MaterialWarnDialogReason;
}): JSX.Element {
    return <MaterialRadioField radios={[]} />;
}

export default function (
    props: MaterialWarnDialogChildProps & {
        defaultReason?: Warning;
        defaultLevel?: 1 | 2 | 3 | 4 | 5;
    }
): JSX.Element {
    return new MaterialWarnDialogReason(props).render();
}

class MaterialWarnDialogReason extends MaterialWarnDialogChild {
    private elementSet: {
        root?: JSX.Element;
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

        // Reassign the warning level to the highest possible value, capped at the current level.
        if (
            this.warningLevel != null &&
            !value.levels.includes(this.warningLevel)
        ) {
            for (
                let highestPossibleLevel = this.warningLevel;
                highestPossibleLevel <= 0;
                highestPossibleLevel--
            ) {
                if (value.levels.includes(highestPossibleLevel)) {
                    this.warningLevel = highestPossibleLevel;
                    break;
                }
                // No warning level found. Something must be wrong.
                // Defer to lowest level provided by warning.
                this.warningLevel = value.levels[0];
            }
        }
        // warningLevel automatically refreshes for us. So we'll do it on our
        // own if the warning level doesn't get changed.
        else this.refresh();
    }
    private _warningLevel: null | 0 | 1 | 2 | 3 | 4 | 5;
    get warningLevel(): null | 0 | 1 | 2 | 3 | 4 | 5 {
        return this._warningLevel;
    }
    set warningLevel(value: null | 0 | 1 | 2 | 3 | 4 | 5) {
        this._warningLevel = value;
        this.refresh();
    }

    constructor(
        readonly props: MaterialWarnDialogChildProps & {
            defaultReason?: Warning;
            defaultLevel?: 1 | 2 | 3 | 4 | 5;
        }
    ) {
        super();
        this.warningLevel = props.defaultLevel;
        this.warning = props.defaultReason;
    }

    refresh(): void {
        const rootId = `rwMdcWarnDialogReason__${this.props.warnDialog.id}`;
        const root = (
            <div class={"rw-mdc-warnDialog-reason"}>
                <MaterialWarnDialogReasonDropdown parent={this} />
                <MaterialWarnDialogReasonLevel parent={this} />
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
