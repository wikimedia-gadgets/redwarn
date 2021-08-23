import { BaseProps, ComponentChildren, h } from "tsx-dom";

export interface MaterialDialogProperties {
    draggable?: boolean;
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
    draggable
}: MaterialDialogProperties): JSX.Element {
    return (
        <div
            id={id}
            class="mdc-dialog"
            data-rw-mdc-dialog-draggable={draggable}
        >
            <div
                {...containerProperties}
                class={`mdc-dialog__container ${
                    containerProperties.class ?? ""
                }`}
            >
                <div
                    {...surfaceProperties}
                    class={`mdc-dialog__surface ${
                        surfaceProperties.class ?? ""
                    }`}
                >
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
    tabIndex
}: BaseProps & {
    style?: Partial<CSSStyleDeclaration>;
    tabIndex?: number;
}): JSX.Element {
    return (
        <h2 class="mdc-dialog__title" style={style} tabIndex={tabIndex}>
            {children}
        </h2>
    );
}

export function MaterialDialogContent({
    children,
    style
}: BaseProps & { style?: Partial<CSSStyleDeclaration> }): JSX.Element {
    return (
        <div class="mdc-dialog__content" style={style}>
            {children}
        </div>
    );
}

export function MaterialDialogActions({
    children,
    style
}: BaseProps & { style?: Partial<CSSStyleDeclaration> }): JSX.Element {
    return (
        <div class="mdc-dialog__actions" style={style}>
            {children}
        </div>
    );
}
