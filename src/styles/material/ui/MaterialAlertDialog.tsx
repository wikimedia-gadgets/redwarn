import { ComponentChild, h } from "tsx-dom";

import { RWUIAlertDialog } from "rww/ui/elements/RWUIAlertDialog";
import { upgradeMaterialDialog } from "rww/styles/material/Material";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";

/**
 * The MaterialAlertDialog is a handling class used to show dialogs on the screen. This will
 * automatically handle dialog actions, content, etc.
 *
 * To show a dialog on the DOM, use {@link MaterialAlertDialog.show}.
 */
export default class MaterialAlertDialog extends RWUIAlertDialog {
    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    show(): Promise<string> {
        return upgradeMaterialDialog(this, {
            onClose: async (event) => {
                const actionSelected = this.props.actions.find(
                    (action) => action.data === event.detail.action
                );
                if (actionSelected != null) {
                    return actionSelected.action
                        ? (await actionSelected.action(event)) ??
                              event.detail.action
                        : event.detail.action;
                } else {
                    return event.detail.action;
                }
            },
        }).then((v) => v.wait());
    }

    /**
     * Renders the MaterialAlertDialog's actions (as buttons).
     * @return A collection of {@link HTMLButtonElement}s, all of which are MDL buttons.
     */
    private renderActions(): ComponentChild[] {
        const buttons: ComponentChild[] = [];
        for (const action of this.props.actions) {
            buttons.push(
                <MaterialButton
                    dialogAction={
                        action.text == null
                            ? action.data
                            : {
                                  data: action.data,
                                  text: action.text,
                              }
                    }
                >
                    {action.text ?? action.data}
                </MaterialButton>
            );
        }

        return buttons;
    }

    /**
     * Renders a MaterialAlertDialog.
     *
     * NOTE: Only use this when appending to body! Otherwise, use {@link MaterialAlertDialog.element}.
     * @returns A {@link HTMLDialogElement}.
     */
    render(): HTMLDialogElement {
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "style": `width: ${this.props.width ?? "30vw"};`,
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog",
                }}
                id={this.id}
            >
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                {this.props.content && (
                    <MaterialDialogContent>
                        {this.props.content}
                    </MaterialDialogContent>
                )}
                {this.props.preformattedContent && (
                    <pre>{this.props.preformattedContent}</pre>
                )}
                <MaterialDialogActions>
                    {this.renderActions()}
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;

        return this.element;
    }
}
