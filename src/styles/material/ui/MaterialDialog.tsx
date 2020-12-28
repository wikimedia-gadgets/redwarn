import { BaseProps, ComponentChildren, h } from "@sportshead/tsx-dom";

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

export function MaterialDialogTitle({
    children,
    style,
}: BaseProps & { style?: Partial<CSSStyleDeclaration> }): JSX.Element {
    return (
        <h2 class="mdc-dialog__title" style={style}>
            {children}
        </h2>
    );
}

export function MaterialDialogContent({
    children,
    style,
}: BaseProps & { style?: Partial<CSSStyleDeclaration> }): JSX.Element {
    return (
        <h2 class="mdc-dialog__content" style={style}>
            {children}
        </h2>
    );
}

export function MaterialDialogActions({
    children,
    style,
}: BaseProps & { style?: Partial<CSSStyleDeclaration> }): JSX.Element {
    return (
        <h2 class="mdc-dialog__actions" style={style}>
            {children}
        </h2>
    );
}
