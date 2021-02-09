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

    return <MaterialSelect items={finalSelectItems} />;
}

export default function (
    props: MaterialWarnDialogChildProps & {
        defaultReason?: Warning;
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

    constructor(
        readonly props: MaterialWarnDialogChildProps & {
            defaultReason?: Warning;
        }
    ) {
        super();
    }

    changeWarning(warning: Warning, level?: number) {
        // TODO
    }

    refresh(): void {
        const rootId = `rwMdcWarnDialogReason__${this.props.warnDialog.id}`;
        const root = (
            <div class={"rw-mdc-warnDialog-reason"}>
                <MaterialWarnDialogReasonDropdown parent={this} />
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
