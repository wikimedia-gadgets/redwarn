import { BaseProps, ComponentChildren, h as TSX } from "tsx-dom";

export interface MaterialDialogProperties {
    containerProperties?: JSX.HTMLAttributes & Record<string, any>;
    surfaceProperties?: JSX.HTMLAttributes & Record<string, any>;
    children: ComponentChildren;
    id: string;
}

export default function ({
    containerProperties,
    surfaceProperties,
    children,
    id,
}: MaterialDialogProperties): JSX.Element {
    return (
        <div id={id} class="mdc-dialog">
            <div class="mdc-dialog__container" {...containerProperties}>
                <div class="mdc-dialog__surface" {...surfaceProperties}>
                    {children}
                </div>
            </div>
            <div class="mdc-dialog__scrim" />
        </div>
    );
}

export function MaterialDialogTitle({ children }: BaseProps): JSX.Element {
    return <h2 class="mdc-dialog__title">{children}</h2>;
}

export function MaterialDialogContent({ children }: BaseProps): JSX.Element {
    return <h2 class="mdc-dialog__content">{children}</h2>;
}

export function MaterialDialogActions({ children }: BaseProps): JSX.Element {
    return <h2 class="mdc-dialog__actions">{children}</h2>;
}
