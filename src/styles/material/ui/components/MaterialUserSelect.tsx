import { h } from "tsx-dom";
import { Page, User, UserAccount, WarningLevel } from "rww/mediawiki";
import MaterialTextInput, {
    MaterialTextInputComponents,
    MaterialTextInputUpgrade
} from "rww/styles/material/ui/components/MaterialTextInput";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";
import RedWarnUI from "rww/ui/RedWarnUI";
import i18next from "i18next";
import Bullet from "./Bullet";
import {
    capitalize,
    formatAge,
    generateId,
    getMonthHeader,
    normalize
} from "rww/util";
import MaterialMenu, { openMenu } from "./MaterialMenu";
import showPlainMediaWikiIFrameDialog from "rww/styles/material/util/showPlainMediaWikiIFrameDialog";
import { MaterialWarnDialogChild } from "./MaterialWarnDialogChild";
import { WarningIcons } from "rww/styles/material/data/WarningIcons";
import Log from "rww/data/RedWarnLog";
import Group from "rww/mediawiki/core/Group";
import "../../css/userSelect.css";
import { UserMissingError } from "rww/errors/MediaWikiErrors";

interface OverlayContentLoading {
    type: "loading";
    user: User;
}

interface OverlayContentInput {
    type: "input";
    onFinish: (newName: string) => void;
}

type OverlayContent = OverlayContentInput | OverlayContentLoading;

function MaterialUserSelectCardAccountGroups({
    parent
}: {
    parent: MaterialUserSelect;
}): JSX.Element {
    if (!(parent.user instanceof UserAccount)) return;

    const user: UserAccount = parent.user;

    return (
        <div class={"rw-mdc-userSelect--groups"}>
            {/* TODO: i18n (slightly complicated) */}
            <b>Groups:</b>{" "}
            {user.groups
                .map<JSX.Element>(
                    (group: Group): JSX.Element => {
                        console.log(group);
                        return (
                            <a
                                target={group.page && "_blank"}
                                href={group.page.url}
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

function MaterialUserSelectCardAccountInfo({
    parent
}: {
    parent: MaterialUserSelect;
}): JSX.Element {
    if (!(parent.user instanceof UserAccount))
        return (
            <div class={"rw-mdc-userSelect--overview"}>
                {/* TODO Eventually replace with per-wiki page */}
                <a href={"/wiki/w:en:IP_address"} target="_blank">
                    {i18next.t<string>("mediawiki:ip")}
                </a>
            </div>
        );

    const user: UserAccount = parent.user;

    return (
        <div class={"rw-mdc-userSelect--overview"}>
            <a
                onClick={() => {
                    showPlainMediaWikiIFrameDialog(
                        Page.fromTitle(
                            `Special:Contributions/${user.username}`
                        ),
                        {
                            disableRedWarn: true,
                            safeMode: true
                        }
                    );
                }}
                data-rw-mdc-tooltip={i18next.t(
                    "ui:userSelect.show.contributions"
                )}
            >
                {i18next.t<string>("ui:userSelect.edits", {
                    edits: user.editCount.toLocaleString()
                })}
            </a>
            <Bullet />
            <a
                onClick={() => {
                    showPlainMediaWikiIFrameDialog(user.userPage, {
                        disableRedWarn: true,
                        safeMode: true
                    });
                }}
                data-rw-mdc-tooltip={i18next.t("ui:userSelect.show.userpage")}
            >
                {i18next.t<string>("ui:userSelect.age", {
                    localeAge: formatAge(user.registered)
                })}
            </a>
        </div>
    );
}

/**
 * The actual user card. Used when the user is loaded.
 */
function MaterialUserSelectCard({
    parent
}: {
    parent: MaterialUserSelect;
}): JSX.Element {
    const user = parent.user;

    if (!user.isPopulated() || !user.warningAnalysis) {
        throw new Error(
            "MaterialUserSelectCard called without the User being fully-populated."
        );
    }

    const cardId = generateId(8);
    const warningIcon = WarningIcons[user.warningAnalysis.level];

    return (
        <table>
            <tr>
                <td rowSpan={2}>
                    <div class={"rw-mdc-userSelect--main"}>
                        <div class={"rw-mdc-userSelect--username"}>
                            <a
                                onClick={() => {
                                    parent.clearUser();
                                }}
                                data-rw-mdc-tooltip={i18next.t(
                                    "ui:userSelect.change"
                                )}
                            >
                                {user.username}
                            </a>
                        </div>
                        <MaterialUserSelectCardAccountInfo parent={parent} />
                    </div>
                    <MaterialUserSelectCardAccountGroups parent={parent} />
                </td>
                <td>
                    <MaterialIconButton
                        {...warningIcon}
                        label={i18next.t("ui:userSelect.highestLevel")}
                        tooltip={i18next.t<string>(`ui:userSelect.levelInfo`, {
                            context: `${WarningLevel[
                                user.warningAnalysis.level
                            ].toLowerCase()}`
                        })}
                        {...(user.warningAnalysis.level > 3
                            ? {
                                  onClick: () => {
                                      // TODO AIV thing
                                      RedWarnUI.Toast.quickShow({
                                          content: i18next.t("ui:unfinished")
                                      });
                                  }
                              }
                            : {})}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    <MaterialIconButton
                        icon={"assignment_ind"}
                        tooltip={i18next
                            .t("ui:userSelect.talk.main")
                            .toString()}
                        onClick={() => {
                            openMenu(`menu__${cardId}`);
                        }}
                        data-menu-id={`menu__${cardId}`}
                    />
                    <MaterialMenu
                        id={`menu__${cardId}`}
                        items={[
                            {
                                label: i18next
                                    .t("ui:userSelect.talk.month")
                                    .toString(),
                                action(): void {
                                    showPlainMediaWikiIFrameDialog(
                                        user.talkPage,
                                        {
                                            disableRedWarn: true,
                                            redirect: false,
                                            fragment: mw.util.wikiUrlencode(
                                                getMonthHeader()
                                            ),
                                            customStyle: `#${mw.util.wikiUrlencode(
                                                getMonthHeader()
                                            )}{background-color:#fd0;}`
                                        }
                                    );
                                }
                            },
                            {
                                label: i18next
                                    .t("ui:userSelect.talk.whole")
                                    .toString(),
                                action(): void {
                                    showPlainMediaWikiIFrameDialog(
                                        user.talkPage,
                                        {
                                            disableRedWarn: true,
                                            redirect: false
                                        }
                                    );
                                }
                            }
                        ]}
                    />
                </td>
            </tr>
        </table>
    );
}

export interface MaterialUserSelectProps {
    id?: string;
    originalUser?: User;
}

export abstract class MaterialUserSelect extends MaterialWarnDialogChild {
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
            this.elementSet.root.classList.toggle(
                "rw-mdc-userSelect--active",
                this._active
            );
        }
        return this._active;
    }
    set active(value: boolean) {
        if (!!this.elementSet.root) {
            this.elementSet.root.classList.toggle(
                "rw-mdc-userSelect--active",
                value
            );
        }
        this._active = value;
    }

    lastUser: User;

    _user: User;
    get user(): User {
        return this._user;
    }
    set user(value: User) {
        this._user = value;
        this.onPreUserChange(value);
    }

    private updating: boolean;

    protected constructor(readonly props: MaterialUserSelectProps) {
        super();
        if (this.props.id == null) this.props.id = generateId();
        this.user = props.originalUser;
    }

    abstract onPreUserChange(user: User): PromiseOrNot<void>;
    abstract onUserChange(user: User): PromiseOrNot<void>;
    abstract onPostUserChange(user: User): PromiseOrNot<void>;

    renderOverlayContent(overlayInfo?: OverlayContent): JSX.Element {
        if (!overlayInfo) {
            overlayInfo = !!this.user
                ? {
                      type: "loading",
                      user: this.user
                  }
                : {
                      type: "input",
                      onFinish: (newName) => {
                          this.updateUser(User.fromUsername(newName));
                      }
                  };
        }

        // Clear `targetUserInput` in case it gets removed.
        this.elementSet.targetUserInput = undefined;

        switch (overlayInfo.type) {
            case "loading":
                return (
                    <div class="rw-mdc-userSelect--loading">
                        <div
                            class={"rw-mdc-userSelect--username"}
                            onClick={() => {
                                if (!this.updating) this.updateUser(this.user);
                                else
                                    RedWarnUI.Toast.quickShow({
                                        content: i18next.t(
                                            "ui:userSelect.load_wait"
                                        )
                                    });
                            }}
                        >
                            {this.user.username}
                        </div>
                        <div>{i18next.t<string>("ui:userSelect.loading")}</div>
                    </div>
                );
            case "input":
                const textInput = (
                    <MaterialTextInput
                        width={"100%"}
                        label={i18next.t("ui:userSelect.input")}
                        defaultText={this.lastUser?.username ?? ""}
                        autofocus
                    />
                );
                this.elementSet.targetUserInput = {
                    element: textInput,
                    components: MaterialTextInputUpgrade(textInput)
                };

                const updateName = () => {
                    // MediaWiki trims the start and end of article names. Might as well.
                    const content = this.elementSet.targetUserInput.components.textField.value.trim();
                    if (content.length > 0)
                        (overlayInfo as OverlayContentInput).onFinish(
                            normalize(content)
                        );
                };

                textInput.querySelector("input");
                textInput
                    .querySelector("input")
                    .addEventListener("keyup", (event) => {
                        if (event.key === "Enter") {
                            updateName();
                        } else if (event.key === "Escape") {
                            this.elementSet.targetUserInput.components.textField.value = this.lastUser.username;
                            updateName();
                        }
                    });
                return (
                    <div class={"rw-mdc-userSelect--input"}>
                        {textInput}
                        <MaterialIconButton
                            icon={"send"}
                            tooltip={i18next
                                .t("ui:userSelect.confirm")
                                .toString()}
                            onClick={() => {
                                updateName();
                            }}
                        />
                        {
                            // Don't show the reset button if the target was initially unset.
                            this.lastUser && (
                                <MaterialIconButton
                                    icon={"close"}
                                    tooltip={i18next.t("ui:cancel").toString()}
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
            <div class={"rw-mdc-userSelect--overlay"}>
                {this.renderOverlayContent()}
            </div>
        );
        return this.elementSet.overlay;
    }

    renderMain(): JSX.Element {
        this.elementSet.main = (
            <div class={"rw-mdc-userSelect--main"}>
                {
                    // Do not use `this.active` - this will require two refreshes.
                    !!this.user &&
                    this.user.isPopulated() &&
                    !!this.user?.warningAnalysis ? (
                        <MaterialUserSelectCard parent={this} />
                    ) : (
                        ""
                    )
                }
            </div>
        );
        return this.elementSet.main;
    }

    /**
     * Removes the target user and resets the input field.
     */
    async clearUser(lastUser?: User): Promise<void> {
        this.lastUser = lastUser ?? this.user;
        this.user = undefined;
        this.active = false;
        this.refresh();
    }

    /**
     * Updates the dialog's user and loads new data accordingly.
     * @param user
     */
    async updateUser(user: User): Promise<void> {
        if (user == null) return;

        if (this.updating)
            Log.trace(
                "Attempted to update user twice. Subsequent attempt blocked."
            );

        // Reuse the previous user object if it's the same user.
        if (!!this.lastUser && user.username === this.lastUser.username)
            this.user = this.lastUser;
        else this.user = user;

        if (this.user != null) {
            if (!this.user.isPopulated()) {
                // Set to inactive in order to hoist loading screen.
                this.updating = true;
                this.refresh();

                try {
                    await this.user.populate();
                } catch (e) {
                    if (e instanceof UserMissingError) {
                        RedWarnUI.Toast.quickShow({
                            content: i18next.t("ui:userSelect.missing")
                        });
                    } else if (e instanceof UserMissingError) {
                        RedWarnUI.Toast.quickShow({
                            content: i18next.t("ui:userSelect.invalid")
                        });
                    } else {
                        RedWarnUI.Toast.quickShow({
                            content: i18next.t("ui:userSelect.fail")
                        });
                    }
                    this.clearUser();
                    return;
                }
            }

            await this.onUserChange(this.user);

            if (this.user && !this.user.warningAnalysis) {
                // Set to updating in order to hoist loading screen.
                this.updating = true;
                this.refresh();

                await this.user.getWarningAnalysis();
            }

            await this.onPostUserChange(this.user);
        }

        // All done. Show!
        this.updating = false;

        // Small delay in order to let previous refreshes pass through.
        setTimeout(() => {
            this.refresh();
        }, 100);
    }

    /**
     * Refreshes the content of the root element.
     */
    refresh(): void {
        const rootId = `rwMdcUserSelect__${this.props.id}`;
        // Oh, how I miss setState()...
        const root = (
            <div
                id={rootId}
                class={"rw-mdc-userSelect mdc-card mdc-card--outlined"}
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

        // Setter requires `this.elementSet.root` to be up to date.
        this.active =
            !this.updating &&
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
     * Renders the MaterialUserSelect card.
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
                    "rw-mdc-userSelect--active"
                ) &&
                // No children in main element
                this.elementSet.main.children.length == 0
            ) {
                Log.warn(
                    "Invalid MaterialUserSelect state detected! Please investigate in the future.",
                    {
                        elementSet: this.elementSet,
                        state: this._active,
                        statePostUpdate: this._active,
                        updating: this.updating,
                        user: this.user,
                        lastUser: this.lastUser
                    }
                );
                this.refresh();
            }
        }, 1000);

        return this.elementSet.root;
    }
}
