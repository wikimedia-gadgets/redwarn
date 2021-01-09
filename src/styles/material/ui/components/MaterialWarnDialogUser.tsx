import RWUIElement from "rww/ui/elements/RWUIElement";
import { h } from "tsx-dom";
import { User, WarningIcons, WarningLevel } from "rww/mediawiki/MediaWiki";
import MaterialTextInput, {
    MaterialTextInputComponents,
    MaterialTextInputUpgrade,
} from "rww/styles/material/ui/components/MaterialTextInput";
import MaterialWarnDialog from "rww/styles/material/ui/MaterialWarnDialog";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";
import RWUI from "rww/ui/RWUI";
import i18next from "i18next";
import moment from "moment";
import Bullet from "./Bullet";

interface OverlayContentLoading {
    type: "loading";
    user: User;
}

interface OverlayContentInput {
    type: "input";
    onFinish: (newName: string) => void;
}

type OverlayContent = OverlayContentInput | OverlayContentLoading;

interface MaterialWarnDialogUserProps {
    warnDialog: MaterialWarnDialog;
    user?: User;
}

/**
 * The actual user card. Used when the user is loaded.
 */
function MaterialWarnDialogUserCard({ user }: { user: User }): JSX.Element {
    if (!user.isPopulated() || !user.warningAnalysis) {
        throw new Error(
            "MaterialWarnDialogUserCard called without the User being fully-populated."
        );
    }

    const warningIcon = WarningIcons[user.warningAnalysis.level];

    return (
        <table>
            <tr>
                <td rowSpan={2}>
                    <div class={"rw-mdc-warnDialog-user--username"}>
                        {user.username}
                    </div>
                    <div class={"rw-mdc-warnDialog-user--overview"}>
                        <a>
                            {`${i18next.t("mediawiki:warn.user.overview", {
                                edits: user.editCount.toLocaleString(),
                            })}`}
                        </a>
                        <Bullet />
                        <a>{moment(user.registered).fromNow()}</a>
                    </div>
                </td>
                <td>
                    <MaterialIconButton
                        {...warningIcon}
                        label={i18next.t("mediawiki:warn.user.highestLevel")}
                        tooltip={`${i18next.t(`mediawiki:warn.user.levelInfo`, {
                            context: `${WarningLevel[
                                user.warningAnalysis.level
                            ].toLowerCase()}`,
                        })}`}
                        {...(user.warningAnalysis.level > 3 && {
                            onClick: () => {
                                // TODO AIV thing
                                new RWUI.Toast({
                                    content: "Under construction.",
                                }).show();
                            },
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
                            // TODO open in dialog
                            user.talkPage.openInNewTab();
                        }}
                    />
                </td>
            </tr>
        </table>
    );
}

export default function (props: MaterialWarnDialogUserProps): JSX.Element {
    return new MaterialWarnDialogUser(props).render();
}

class MaterialWarnDialogUser extends RWUIElement {
    private elementSet: {
        root?: JSX.Element;
        overlay?: JSX.Element;
        main?: JSX.Element;
        targetUserInput?: {
            element: JSX.Element;
            components: MaterialTextInputComponents;
        };
    } = {};

    get active(): boolean {
        return this.elementSet.root.classList.contains(
            "rw-mdc-warnDialog-user--active"
        );
    }
    set active(value: boolean) {
        if (value)
            this.elementSet.root.classList.add(
                "rw-mdc-warnDialog-user--active"
            );
        else this.elementSet.root.classList.remove("rw-mdc-warnDialog--active");
    }

    private user: User;
    private updating: boolean;

    constructor(readonly props: MaterialWarnDialogUserProps) {
        super();
        this.user = props.user;
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
                          this.updateUser(User.fromUsername(newName));
                      },
                  };
        }

        // Clear `targetUserInput` in case it gets removed.
        this.elementSet.targetUserInput = undefined;

        switch (overlayInfo.type) {
            case "loading":
                return (
                    <div class="rw-mdc-warnDialog-user--loading">
                        <div class={"rw-mdc-warnDialog-user--username"}>
                            {this.user.username}
                        </div>
                        <div>Loading user information...</div>
                    </div>
                );
            case "input":
                const textInput = (
                    <MaterialTextInput width={"80%"} label={"Target User"} />
                );
                this.elementSet.targetUserInput = {
                    element: textInput,
                    components: MaterialTextInputUpgrade(textInput),
                };

                textInput.querySelector("input").onblur = () => {
                    // MediaWiki trims the start and end of article names. Might as well.
                    const content = this.elementSet.targetUserInput.components.textField.value.trim();
                    if (content.length > 0)
                        (overlayInfo as OverlayContentInput).onFinish(content);
                };
                return (
                    <div class={"rw-mdc-warnDialog-user--input"}>
                        {textInput}
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
                    <MaterialWarnDialogUserCard user={this.user} />
                ) : (
                    ""
                )}
            </div>
        );
        return this.elementSet.main;
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
        this.user = user;

        if (!user.isPopulated()) {
            // Set to inactive in order to hoist loading screen.
            this.active = false;
            this.refresh();

            await user.populate();
        }
        if (!user.warningAnalysis) {
            // Set to inactive in order to hoist loading screen.
            this.active = false;
            this.refresh();

            await user.getWarningAnalysis();
        }

        this.updating = false;
        // All done. Show!
        this.active = true;
        this.refresh();
    }

    /**
     * Refreshes the content of the root element
     */
    refresh(): void {
        // Oh, how I miss setState()...
        const root = (
            <div class={"rw-mdc-warnDialog-user mdc-card mdc-card--outlined"}>
                {this.renderMain()}
                {this.renderOverlay()}
            </div>
        );

        if (this.elementSet.root) {
            this.elementSet.root.parentElement.replaceChild(
                root,
                this.elementSet.root
            );
        }

        this.elementSet.root = root;

        if (
            !!this.user &&
            this.user.isPopulated() &&
            !!this.user.warningAnalysis
        )
            this.active = true;
        else {
            this.active = false;
            if (!this.updating && !this.active)
                // Execute asynchronously to prevent repeat calls.
                setTimeout(() => {
                    this.updateUser(this.props.user);
                });
        }
    }

    /**
     * Renders the MaterialWarnDialogUser card.
     */
    render(): JSX.Element {
        this.refresh();
        return this.elementSet.root;
    }
}
