import { RWUIToast } from "rww/ui/elements/RWUIToast";
import { h } from "tsx-dom";
import { getMaterialStorage } from "rww/styles/material/storage/MaterialStyleStorage";
import { MDCSnackbar } from "@material/snackbar";

/**
 * The MaterialToast is a handling class used to show dialogs on the screen. This will
 * automatically handle dialog actions, content, etc.
 *
 * To show a dialog on the DOM, use {@link MaterialToast.show}.
 */
export default class MaterialToast extends RWUIToast {
    private showPromise: {
        resolve: (value: void | PromiseLike<void>) => void;
        reject: (reason?: any) => void;
    };
    show(): Promise<void> {
        const styleStorage = getMaterialStorage();
        styleStorage.toastQueue.push(this);
        if (styleStorage.toastQueue.length === 1) {
            styleStorage.toastQueue.shift()._show();
        }
        return new Promise((resolve, reject) => {
            this.showPromise = { resolve, reject };
        });
    }
    private _show() {
        document.body.appendChild(this.render());
        const snackbar = new MDCSnackbar(this.element);
        snackbar.initialize();
        snackbar.timeoutMs = this.props.timeout ?? 5000;
        snackbar.open();

        snackbar.listen(
            "MDCSnackbar:closed",
            async (event: Event & { detail: { action: string } }) => {
                if (event.detail.action === "action") {
                    this.props.action.callback();
                }
                const styleStorage = getMaterialStorage();
                if (styleStorage.toastQueue.length >= 1) {
                    styleStorage.toastQueue.shift()._show();
                }
                this.showPromise.resolve();
            }
        );
    }

    render(): HTMLDivElement {
        return (this.element = (
            <div
                class={`mdc-snackbar${
                    ["", " mdc-snackbar--leading", " mdc-snackbar--stacked"][
                        this.props.style
                    ]
                }`}
                id={this.id}
            >
                <div
                    class="mdc-snackbar__surface"
                    role="status"
                    aria-relevant="additions"
                >
                    <div class="mdc-snackbar__label" aria-atomic="false">
                        {this.props.content}
                    </div>
                    {this.props.action && (
                        <div class="mdc-snackbar__actions" aria-atomic="true">
                            <button
                                type="button"
                                class="mdc-button mdc-snackbar__action"
                            >
                                <div class="mdc-button__ripple" />
                                <span class="mdc-button__label">
                                    {this.props.action.text}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ) as HTMLDivElement);
    }
}
