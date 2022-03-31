import { RWUIDialog } from "app/ui/elements/RWUIDialog";
import { upgradeMaterialDialog } from "app/styles/material/Material";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "app/styles/material/ui/MaterialDialog";
import i18next from "i18next";
import { h } from "tsx-dom";
import MaterialButton from "app/styles/material/ui/components/MaterialButton";
import MaterialRadioField from "app/styles/material/ui/components/MaterialRadioField";
import { RecentPages } from "app/mediawiki/util/RecentPages";
import toCSS from "app/styles/material/util/toCSS";

export default class MaterialWarnDialogRecentPages extends RWUIDialog<string> {
    page: string;

    public constructor() {
        super();
    }

    show(): Promise<string> {
        return upgradeMaterialDialog(this, {
            onClose: async (event) => {
                if (event.detail.action === "confirm") {
                    return this.page;
                } else return null;
            },
        }).then((v) => v.wait());
    }

    render(): HTMLDialogElement {
        return (this.element = (
            <MaterialDialog id={this.id}>
                <MaterialDialogTitle>
                    {i18next.t<string>("ui:warn.recentPagesDialog.dialogTitle")}
                </MaterialDialogTitle>
                <MaterialDialogContent>
                    <MaterialRadioField<string>
                        radios={RecentPages.pages.map((page) => ({
                            value: page,
                            children: (
                                <span
                                    style={toCSS({
                                        display: "inline-block",
                                        padding: "10px 0",
                                    })}
                                >
                                    {page}
                                </span>
                            ),
                        }))}
                        direction={"vertical"}
                        onChange={(value) => {
                            this.page = value;
                        }}
                    />
                </MaterialDialogContent>
                <MaterialDialogActions>
                    <MaterialButton dialogAction="cancel" action>
                        {i18next.t<string>("ui:cancel")}
                    </MaterialButton>
                    <MaterialButton dialogAction="confirm" action raised>
                        {i18next.t<string>("ui:confirm")}
                    </MaterialButton>
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement);
    }
}
