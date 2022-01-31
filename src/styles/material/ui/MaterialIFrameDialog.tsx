import { ComponentChild, h } from "tsx-dom";

import { RWUIIFrameDialog } from "rww/ui/elements/RWUIIFrameDialog";
import { upgradeMaterialDialog } from "rww/styles/material/Material";
import MaterialButton from "./components/MaterialButton";
import MaterialDialog, {
    MaterialDialogActions,
    MaterialDialogContent,
    MaterialDialogTitle
} from "./MaterialDialog";
import i18next from "i18next";
import Dependencies from "rww/data/Dependencies";

import "../css/iframeDialog.css";
import { url } from "rww/util";
import RedWarnUI from "rww/ui/RedWarnUI";

export default class MaterialIFrameDialog extends RWUIIFrameDialog {
    /**
     * Show a dialog on screen. You can await this if you want to block until the dialog closes.
     * @returns The result - the value returned by the selected button in {@link RWUIDialogProperties.actions}.
     */
    show(): Promise<void> {
        return upgradeMaterialDialog<void>(this).then((v) => v.wait());
    }

    /**
     * Renders the MaterialIFrameDialog's actions (as buttons).
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
                                  text: action.text
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
        let iframe: HTMLIFrameElement;
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "class": "mdc-dialog__surface rw-mdc-iframeDialog",
                    "style": `width:${this.props.width ?? "70vw"};height:${
                        this.props.height ?? "90vh"
                    };`,
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog"
                }}
                id={this.id}
            >
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent>
                    {
                        (iframe = (
                            <iframe
                                src={
                                    !!this.props.fragment
                                        ? url(this.props.src, undefined, {
                                              fragment: this.props.fragment
                                          })
                                        : this.props.src
                                }
                            />
                        ) as HTMLIFrameElement)
                    }
                </MaterialDialogContent>
                <MaterialDialogActions>
                    {!!this.props.actions && this.props.actions.length > 0
                        ? this.renderActions()
                        : [
                              <MaterialButton
                                  onClick={() => {
                                      navigator.clipboard
                                          .writeText(
                                              iframe.contentDocument?.location
                                                  ?.href ?? iframe.src
                                          )
                                          .then(() => {
                                              RedWarnUI.Toast.quickShow({
                                                  content: i18next.t(
                                                      "ui:copyURL.success"
                                                  )
                                              });
                                          })
                                          .catch(() => {
                                              RedWarnUI.Toast.quickShow({
                                                  content: i18next.t(
                                                      "ui:copyURL.failure"
                                                  )
                                              });
                                          });
                                  }}
                                  style={{ float: "left", marginRight: "auto" }}
                              >
                                  {i18next.t<string>("ui:copyURL.button")}
                              </MaterialButton>,
                              <MaterialButton dialogAction={"close"}>
                                  {i18next.t<string>("ui:close")}
                              </MaterialButton>
                          ]}
                </MaterialDialogActions>
            </MaterialDialog>
        ) as HTMLDialogElement;

        const actualDependencies = this.props.dependencies ?? [];

        if (this.props.customStyle) {
            if (Array.isArray(this.props.customStyle)) {
                actualDependencies.push({
                    type: "style",
                    id: `rw-iframe-dialog-customStyle`,
                    src: `data:text/css;base64,${btoa(
                        this.props.customStyle.reduce((p, n) => `${p}\n\n${n}`)
                    )}`
                });
            } else {
                actualDependencies.push({
                    type: "style",
                    id: "rw-iframe-dialog-customStyle",
                    src: `data:text/css;base64,${btoa(this.props.customStyle)}`
                });
            }
        }

        if (this.props.customScripts) {
            if (Array.isArray(this.props.customScripts)) {
                actualDependencies.push({
                    type: "script",
                    id: `rw-iframe-dialog-customScript`,
                    src: `data:text/javascript;base64,${btoa(
                        this.props.customScripts.reduce(
                            (p, n) => `${p}\n\n${n}`
                        )
                    )}`
                });
            } else {
                actualDependencies.push({
                    type: "script",
                    id: "rw-iframe-dialog-customScript",
                    src: `data:text/javascript;base64,${btoa(
                        this.props.customScripts
                    )}`
                });
            }
        }

        const iframeInit = () => {
            if (!document.body.contains(this.element)) return;

            const iframeDoc =
                iframe.contentDocument || iframe.contentWindow?.document;
            if (
                !!iframeDoc &&
                iframeDoc.location.toString() !== "about:blank"
            ) {
                const headInit = async () => {
                    const iframeDoc =
                        iframe.contentDocument ||
                        iframe.contentWindow?.document;
                    if (!!iframeDoc.head) {
                        for (const dependency of actualDependencies) {
                            const depElement = await Dependencies.buildDependency(
                                dependency
                            );
                            let oldElement;
                            if (
                                (oldElement = iframeDoc.getElementById(
                                    depElement.id
                                )) == null
                            )
                                iframeDoc.head.append(depElement);
                            else {
                                oldElement.parentElement.replaceChild(
                                    depElement,
                                    oldElement
                                );
                            }
                        }
                        return;
                    }
                    setTimeout(() => {
                        headInit();
                    }, 2);
                };
                const bodyInit = () => {
                    const iframeDoc =
                        iframe.contentDocument ||
                        iframe.contentWindow?.document;
                    if (!!iframeDoc.body) {
                        if (this.props.disableRedWarn) {
                            iframeDoc.body.classList.add("rw-disable");
                        }
                        return;
                    }
                    setTimeout(() => {
                        bodyInit();
                    }, 2);
                };
                headInit();
                bodyInit();

                return;
            }

            setTimeout(() => {
                iframeInit();
            }, 2);
        };
        setTimeout(() => {
            iframeInit();
        }, 25);

        return this.element;
    }
}
