import { h } from "tsx-dom";
import { Page, User, UserAccount, WarningLevel } from "rww/mediawiki";
import MaterialTextInput, {
    MaterialTextInputComponents,
    MaterialTextInputUpgrade,
} from "rww/styles/material/ui/components/MaterialTextInput";
import { MaterialWarnDialogChildProps } from "rww/styles/material/ui/MaterialWarnDialog";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";
import RWUI from "rww/ui/RWUI";
import i18next from "i18next";
import moment from "moment";
import Bullet from "./Bullet";
import {
    articlePath,
    capitalize,
    generateId,
    getMonthHeader,
    normalize,
} from "rww/util";
import { MDCChipSet } from "@material/chips";
import MaterialMenu, { openMenu } from "./MaterialMenu";
import showPlainMediaWikiIFrameDialog from "rww/styles/material/util/showPlainMediaWikiIFrameDialog";
import { MaterialWarnDialogChild } from "./MaterialWarnDialogChild";
import { WarningIcons } from "rww/styles/material/data/WarningIcons";

interface OverlayContentLoading {
    type: "loading";
    user: User;
}

interface OverlayContentInput {
    type: "input";
    onFinish: (newName: string) => void;
}

type OverlayContent = OverlayContentInput | OverlayContentLoading;

function MaterialWarnDialogUserCardAccountGroups({
    parent,
}: {
    parent: MaterialWarnDialogUser;
}): JSX.Element {
    if (!(parent.user instanceof UserAccount)) return;

    const user: UserAccount = parent.user;

    return (
        <div class={"rw-mdc-warnDialog-user--groups"}>
            {user.groups
                .map<JSX.Element>(
                    (group): JSX.Element => {
                        return (
                            <a
                                target={group.page && "_blank"}
                                href={
                                    group.page && `${articlePath(group.page)}`
                                }
                            >
                                {capitalize(group.displayName)}
                            </a>
                        );
                    }
                )
                .reduce((p, n, index, array) => {
                    return index === array.length - 1
                        ? p.concat(n)
                        : p.concat(n, ", ");
                }, [])}
        </div>
    );
}

function MaterialWarnDialogUserCardAccountInfo({
    parent,
}: {
    parent: MaterialWarnDialogUser;
}): JSX.Element {
    if (!(parent.user instanceof UserAccount))
        return (
            <div class={"rw-mdc-warnDialog-user--overview"}>
                {/* TODO Eventually replace with per-wiki page */}
                <a href={"/wiki/w:en:IP_address"} target="_blank">
                    {`${i18next.t("mediawiki:ip")}`}
                </a>
            </div>
        );

    const user: UserAccount = parent.user;

    return (
        <div class={"rw-mdc-warnDialog-user--overview"}>
            <a
                onClick={() => {
                    showPlainMediaWikiIFrameDialog(
                        Page.fromTitle(
                            `Special:Contributions/${user.username}`
                        ),
                        {
                            disableRedWarn: true,
                            safeMode: true,
                        }
                    );
                }}
                data-rw-mdc-tooltip={i18next.t(
                    "ui:warn.user.show.contributions"
                )}
            >
                {`${i18next.t("ui:warn.user.edits", {
                    edits: user.editCount.toLocaleString(),
                })}`}
            </a>
            <Bullet />
            <a
                onClick={() => {
                    showPlainMediaWikiIFrameDialog(user.userPage, {
                        disableRedWarn: true,
                        safeMode: true,
                    });
                }}
                data-rw-mdc-tooltip={i18next.t("ui:warn.user.show.userpage")}
            >{`${i18next.t("ui:warn.user.age", {
                localeAge: moment(user.registered).fromNow(),
            })}`}</a>
        </div>
    );
}

/**
 * The actual user card. Used when the user is loaded.
 */
function MaterialWarnDialogUserCard({
    parent,
}: {
    parent: MaterialWarnDialogUser;
}): JSX.Element {
    const user = parent.user;
    if (!user.isPopulated() || !user.warningAnalysis) {
        throw new Error(
            "MaterialWarnDialogUserCard called without the User being fully-populated."
        );
    }

    const cardId = generateId(8);
    const warningIcon = WarningIcons[user.warningAnalysis.level];

    const card = (
        <table>
            <tr>
                <td rowSpan={2}>
                    <div class={"rw-mdc-warnDialog-user--main"}>
                        <div class={"rw-mdc-warnDialog-user--username"}>
                            <a
                                onClick={() => {
                                    parent.clearUser();
                                }}
                                data-rw-mdc-tooltip={i18next.t(
                                    "ui:warn.user.change"
                                )}
                            >
                                {user.username}
                            </a>
                        </div>
                        <MaterialWarnDialogUserCardAccountInfo
                            parent={parent}
                        />
                    </div>
                    <MaterialWarnDialogUserCardAccountGroups parent={parent} />
                </td>
                <td>
                    <MaterialIconButton
                        {...warningIcon}
                        label={i18next.t("ui:warn.user.highestLevel")}
                        tooltip={`${i18next.t(`ui:warn.user.levelInfo`, {
                            context: `${WarningLevel[
                                user.warningAnalysis.level
                            ].toLowerCase()}`,
                        })}`}
                        {...(user.warningAnalysis.level > 3
                            ? {
                                  onClick: () => {
                                      // TODO AIV thing
                                      new RWUI.Toast({
                                          content: "Under construction.",
                                      }).show();
                                  },
                              }
                            : {
                                  disabled: true,
                              })}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    <MaterialIconButton
                        icon={"assignment_ind"}
                        tooltip={"User talk page"}
                        onClick={() => {
                            openMenu(`menu__${cardId}`);
                        }}
                        data-menu-id={`menu__${cardId}`}
                    />
                    <MaterialMenu
                        id={`menu__${cardId}`}
                        items={[
                            {
                                label: "Notices for this month",
                                action(): void {
                                    showPlainMediaWikiIFrameDialog(
                                        user.talkPage,
                                        {
                                            disableRedWarn: true,
                                            fragment: mw.util.wikiUrlencode(
                                                getMonthHeader()
                                            ),
                                            customStyle: `#${mw.util.wikiUrlencode(
                                                getMonthHeader()
                                            )} { background-color: #fd0; }`,
                                        }
                                    );
                                },
                            },
                            {
                                label: "Entire talk page",
                                action(): void {
                                    showPlainMediaWikiIFrameDialog(
                                        user.talkPage,
                                        {
                                            disableRedWarn: true,
                                        }
                                    );
                                },
                            },
                        ]}
                    />
                </td>
            </tr>
        </table>
    );

    if (card.querySelector(".mdc-chip-set"))
        new MDCChipSet(card.querySelector(".mdc-chip-set"));

    return card;
}

class MaterialWarnDialogUser extends MaterialWarnDialogChild {
    private elementSet: {
        root?: JSX.Element;
        overlay?: JSX.Element;
        main?: JSX.Element;
        targetUserInput?: {
            element: JSX.Element;
            components: MaterialTextInputComponents;
        };
    } = {};

    private _active: boolean;
    get active(): boolean {
        if (!!this.elementSet.root) {
            if (this._active)
                this.elementSet.root.classList.add(
                    "rw-mdc-warnDialog-user--active"
                );
            else
                this.elementSet.root.classList.remove(
                    "rw-mdc-warnDialog--active"
                );
        }
        return this._active;
    }
    set active(value: boolean) {
        if (!!this.elementSet.root) {
            if (this._active)
                this.elementSet.root.classList.add(
                    "rw-mdc-warnDialog-user--active"
                );
            else
                this.elementSet.root.classList.remove(
                    "rw-mdc-warnDialog--active"
                );
        }
        this._active = value;
    }

    lastUser: User;

    get user(): User {
        return this.props.warnDialog.user;
    }
    set user(value: User) {
        this.props.warnDialog.user = value;
        this.props.warnDialog.updatePreview();
    }

    private updating: boolean;

    constructor(
        readonly props: MaterialWarnDialogChildProps & { originalUser?: User }
    ) {
        super();
        this.user = props.originalUser;
    }

    renderOverlayContent(overlayInfo?: OverlayContent): JSX.Element {
        if (!overlayInfo) {
            overlayInfo = !!this.user
                ? {
                      type: "loading",
                      user: this.user,
                  }
                : {
                      type: "input",
                      onFinish: (newName) => {
                          this.updateUser(
                              User.fromUsername(normalize(newName))
                          );
                      },
                  };
        }

        // Clear `targetUserInput` in case it gets removed.
        this.elementSet.targetUserInput = undefined;

        switch (overlayInfo.type) {
            case "loading":
                return (
                    <div class="rw-mdc-warnDialog-user--loading">
                        <div
                            class={"rw-mdc-warnDialog-user--username"}
                            onClick={() => {
                                if (!this.updating) this.updateUser(this.user);
                                else
                                    new RWUI.Toast({
                                        content: i18next.t(
                                            "ui:warn.user.load_wait"
                                        ),
                                    }).show();
                            }}
                        >
                            {this.user.username}
                        </div>
                        <div>{`${i18next.t("ui:warn.user.loading")}`}</div>
                    </div>
                );
            case "input":
                const textInput = (
                    <MaterialTextInput
                        width={"400px"}
                        label={i18next.t("ui:warn.user.input")}
                        defaultText={this.lastUser.username}
                        autofocus
                    />
                );
                this.elementSet.targetUserInput = {
                    element: textInput,
                    components: MaterialTextInputUpgrade(textInput),
                };

                const updateName = () => {
                    // MediaWiki trims the start and end of article names. Might as well.
                    const content = this.elementSet.targetUserInput.components.textField.value.trim();
                    if (content.length > 0)
                        (overlayInfo as OverlayContentInput).onFinish(content);
                };

                textInput
                    .querySelector("input")
                    .addEventListener("blur", () => {
                        updateName();
                    });
                textInput
                    .querySelector("input")
                    .addEventListener("keyup", (event) => {
                        if (event.key === "Enter") {
                            updateName();
                        }
                    });
                return (
                    <div class={"rw-mdc-warnDialog-user--input"}>
                        {textInput}
                        <MaterialIconButton
                            icon={"send"}
                            tooltip={"Target this user"}
                            onClick={() => {
                                updateName();
                            }}
                        />
                        {
                            // Don't show the reset button if the target was initially unset.
                            this.lastUser && (
                                <MaterialIconButton
                                    icon={"close"}
                                    tooltip={"Cancel"}
                                    onClick={() => {
                                        (overlayInfo as OverlayContentInput).onFinish(
                                            this.lastUser.username
                                        );
                                    }}
                                />
                            )
                        }
                    </div>
                );
        }
    }

    renderOverlay(): JSX.Element {
        this.elementSet.overlay = (
            <div class={"rw-mdc-warnDialog-user--overlay"}>
                {this.renderOverlayContent()}
            </div>
        );
        return this.elementSet.overlay;
    }

    renderMain(): JSX.Element {
        this.elementSet.main = (
            <div class={"rw-mdc-warnDialog-user--main"}>
                {!!this.user &&
                this.user.isPopulated() &&
                !!this.user.warningAnalysis ? (
                    <MaterialWarnDialogUserCard parent={this} />
                ) : (
                    ""
                )}
            </div>
        );
        return this.elementSet.main;
    }

    /**
     * Removes the target user and resets the input field.
     */
    async clearUser(): Promise<void> {
        this.lastUser = this.user;
        this.user = undefined;
        this.active = false;
        this.refresh();
    }

    /**
     * Updates the dialog's user and loads new data accordingly.
     * @param user
     */
    async updateUser(user: User): Promise<void> {
        if (this.updating)
            console.warn(
                "Attempted to update user twice. Subsequent attempt blocked."
            );

        this.updating = true;

        if (!!this.lastUser && user.username === this.lastUser.username)
            // Let's not waste resources in getting the same user's data.
            this.user = this.lastUser;
        else this.user = user;

        if (!this.user.isPopulated()) {
            // Set to inactive in order to hoist loading screen.
            this.active = false;
            this.refresh();

            await this.user.populate();
        }
        if (!this.user.warningAnalysis) {
            // Set to inactive in order to hoist loading screen.
            this.active = false;
            this.refresh();

            await this.user.getWarningAnalysis();
        }

        this.updating = false;
        // All done. Show!
        this.active = true;

        // Small delay in order to let previous refreshes pass through.
        setTimeout(() => {
            this.refresh();
        }, 100);
    }

    /**
     * Refreshes the content of the root element.
     */
    refresh(): void {
        const rootId = `rwMdcWarnDialogUser__${this.props.warnDialog.id}`;
        // Oh, how I miss setState()...
        const root = (
            <div
                id={rootId}
                class={"rw-mdc-warnDialog-user mdc-card mdc-card--outlined"}
            >
                {this.renderMain()}
                {this.renderOverlay()}
            </div>
        );

        const existingRoot = document.getElementById(rootId);
        if (existingRoot != null) {
            existingRoot.parentElement.replaceChild(
                (this.elementSet.root = root),
                existingRoot
            );
        } else this.elementSet.root = root;

        this.active =
            !!this.user &&
            this.user.isPopulated() &&
            !!this.user.warningAnalysis;

        if (!!this.elementSet.targetUserInput) {
            if ($(this.elementSet.targetUserInput.element).is(":visible")) {
                this.elementSet.targetUserInput.components.textField.focus();
            }
        }
    }

    /**
     * Renders the MaterialWarnDialogUser card.
     */
    render(): JSX.Element {
        this.refresh();

        if (!this.elementSet.root) {
            throw "Refresh did not build warn dialog!";
        }

        if (
            (!this.user ||
                !this.user.isPopulated() ||
                !this.user.warningAnalysis) &&
            !this.updating &&
            !this.active
        )
            // Execute asynchronously to prevent repeat calls.
            (async () => {
                this.updateUser(this.props.originalUser);
            })();

        // Watch out for an invalid state (i.e. active but main content not rendered)
        const warnDialogUserMonitor = setInterval(() => {
            if (this.elementSet.root.parentElement == null) {
                // We've been popped of the DOM. Stop looping.
                clearInterval(warnDialogUserMonitor);
                return;
            }

            if (
                // Is active
                this.elementSet.root.classList.contains(
                    "rw-mdc-warnDialog-user--active"
                ) &&
                // No children in main element
                this.elementSet.main.children.length == 0
            ) {
                console.warn(
                    "Invalid MaterialWarnDialogUser state detected! Please investigate in the future.",
                    {
                        elementSet: this.elementSet,
                        state: this._active,
                        statePostUpdate: this._active,
                        updating: this.updating,
                        user: this.user,
                        lastUser: this.lastUser,
                    }
                );
                this.refresh();
            }
        }, 1000);

        return this.elementSet.root;
    }
}

export { MaterialWarnDialogUser as MaterialWarnDialogUserController };
export default function generator(
    props: MaterialWarnDialogChildProps & { originalUser?: User }
): JSX.Element & { MWDUser: MaterialWarnDialogUser } {
    const mwdUser = new MaterialWarnDialogUser(props);
    return Object.assign(mwdUser.render(), {
        MWDUser: mwdUser,
    });
}
