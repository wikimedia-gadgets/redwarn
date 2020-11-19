import { BaseProps, h as TSX } from "tsx-dom";

export interface MaterialButtonProperties extends BaseProps {
    dialogAction?: string | { data: string; text: string };
}

export default function ({
    dialogAction,
    children,
}: MaterialButtonProperties): JSX.Element {
    const classes = ["mdc-button"];

    if (dialogAction) {
        classes.push("mdc-dialog__button");
    }

    return (
        <button
            type="button"
            class={classes.join(" ")}
            data-mdc-dialog-action={
                dialogAction == null
                    ? false
                    : typeof dialogAction === "string"
                        ? dialogAction
                        : dialogAction.data
            }
        >
            <div class="mdc-button__ripple" />
            <span class="mdc-button__label">{children}</span>
        </button>
    );
}
