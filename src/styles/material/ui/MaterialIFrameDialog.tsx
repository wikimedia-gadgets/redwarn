import { ComponentChild, h } from "tsx-dom";

import { RWUIIFrameDialog } from "rww/ui/elements/RWUIDialog";
import {
    registerMaterialDialog,
    upgradeMaterialDialog,
} from "rww/styles/material/Material";

import { getMaterialStorage } from "rww/styles/material/storage/MaterialStyleStorage";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";
import i18next from "i18next";
import Dependencies from "rww/ui/Dependencies";

import "../css/iframeDialog.css";

export default class MaterialIFrameDialog extends RWUIIFrameDialog {
    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    show(): Promise<any> {
        const styleStorage = getMaterialStorage();
        registerMaterialDialog(this);
        const dialog = upgradeMaterialDialog(this);

        return new Promise((resolve) => {
            dialog.listen(
                "MDCDialog:closed",
                async (event: Event & { detail: { action: string } }) => {
                    styleStorage.dialogTracker.delete(this.id);
                    resolve(null);
                }
            );
        });
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
                    "class": "mdc-dialog__surface rw-mdc-iframeDialog",
                    "style": `width:${this.props.width ?? "70vw"};height:${
                        this.props.height ?? "90vh"
                    };`,
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
                <MaterialDialogContent>
                    <iframe src={this.props.src} />
                </MaterialDialogContent>
                <MaterialDialogActions>
                    {!!this.props.actions && this.props.actions.length > 0 ? (
                        this.renderActions()
                    ) : (
                        <MaterialButton dialogAction={"close"}>
                            {`${i18next.t("ui:close")}`}
                        </MaterialButton>
                    )}
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;

        const actualDependencies = this.props.dependencies ?? [];

        if (this.props.customStyle) {
            if (Array.isArray(this.props.customStyle)) {
                for (const style in this.props.customStyle)
                    actualDependencies.push({
                        type: "style",
                        id: `rw-iframe-dialog-customStyle-${style}`,
                        src: `data:text/css;base64,${btoa(
                            this.props.customStyle[style]
                        )}`,
                    });
            } else {
                actualDependencies.push({
                    type: "style",
                    id: "rw-iframe-dialog-customStyle",
                    src: `data:text/css;base64,${btoa(this.props.customStyle)}`,
                });
            }
        }

        if (this.props.customScripts) {
            if (Array.isArray(this.props.customScripts)) {
                for (const script in this.props.customScripts)
                    actualDependencies.push({
                        type: "script",
                        id: `rw-iframe-dialog-customScript-${script}`,
                        src: `data:text/css;base64,${btoa(
                            this.props.customScripts[script]
                        )}`,
                    });
            } else {
                actualDependencies.push({
                    type: "style",
                    id: "rw-iframe-dialog-customStyle",
                    src: `data:text/css;base64,${btoa(
                        this.props.customScripts
                    )}`,
                });
            }
        }

        const iframe: HTMLIFrameElement = this.element.querySelector("iframe");
        const iframeInit = () => {
            const iframeDoc =
                iframe.contentDocument || iframe.contentWindow?.document;
            if (!!iframeDoc) {
                const headInit = () => {
                    if (!!iframeDoc.head) {
                        for (const dependency of actualDependencies) {
                            const depElement = Dependencies.buildDependency(
                                dependency
                            );
                            console.log(depElement);
                            let oldElement;
                            if (
                                (oldElement = iframe.contentDocument.getElementById(
                                    depElement.id
                                )) == null
                            )
                                iframe.contentDocument.head.append(depElement);
                            else {
                                oldElement.parentElement.replaceChild(
                                    depElement,
                                    oldElement
                                );
                            }
                            console.log(depElement.parentElement);
                        }
                        return;
                    }
                    setTimeout(() => {
                        iframeInit();
                    }, 10);
                };
                const bodyInit = () => {
                    if (!!iframeDoc.body) {
                        if (this.props.disableRedWarn) {
                            iframe.contentDocument.body.classList.add(
                                "rw-disable"
                            );
                        }
                        return;
                    }
                    setTimeout(() => {
                        iframeInit();
                    }, 10);
                };
                headInit();
                bodyInit();

                return;
            }

            setTimeout(() => {
                iframeInit();
            }, 25);
        };
        iframe.addEventListener("load", () => {
            iframeInit();
        });

        return this.element;
    }
}
