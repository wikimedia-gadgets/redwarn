import { RWUIToast } from "rww/ui/elements/RWUIToast";
import { h } from "tsx-dom";

/**
 * The MaterialPreferencesTab is a handling class used for different tabs in the preferences page.
 */
export default class MaterialToast extends RWUIToast {
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
                                onClick={this.props.action.callback}
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
