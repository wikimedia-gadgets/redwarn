import RWUIElement from "rww/ui/elements/RWUIElement";
import { h } from "tsx-dom";
import { User } from "rww/mediawiki/User";
import MaterialTextInput from "rww/styles/material/ui/components/MaterialTextInput";

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
    user?: User;
}

export default function (props: MaterialWarnDialogUserProps): JSX.Element {
    return new MaterialWarnDialogUser(props).render();
}

class MaterialWarnDialogUser extends RWUIElement {
    private elementSet: {
        root?: JSX.Element;
        overlay?: JSX.Element;
        main?: JSX.Element;
    } = {};

    get active(): boolean {
        return this.elementSet.root.classList.contains(
            "rw-mdc-warnDialog--active"
        );
    }
    set active(value: boolean) {
        if (value != null) {
            if (value)
                this.elementSet.root.classList.add("rw-mdc-warnDialog--active");
            else
                this.elementSet.root.classList.remove(
                    "rw-mdc-warnDialog--active"
                );
        }
        this.elementSet.root.classList.toggle("rw-mdc-warnDialog--active");
    }

    constructor(readonly props: MaterialWarnDialogUserProps = {}) {
        super();
    }

    renderOverlayContent(overlayInfo?: OverlayContent): JSX.Element {
        if (!overlayInfo) {
            overlayInfo = !!this.props.user
                ? {
                      type: "loading",
                      user: this.props.user,
                  }
                : {
                      type: "input",
                      onFinish: (newName) => {
                          this.props.user = new User(newName);
                          this.renderMain();
                          this.refresh();
                          this.active = true;
                      },
                  };
        }
        switch (overlayInfo.type) {
            case "loading":
                return (
                    <div class={"rw-mdc-warnDialog-user--loading"}>
                        <div
                            style={{
                                fontSize: "xx-large",
                            }}
                        >
                            {this.props.user.username}
                        </div>
                        <div
                            style={{
                                fontSize: "normal",
                            }}
                        >
                            Loading user information...
                        </div>
                    </div>
                );
            case "input":
                return (
                    <div class={"rw-mdc-warnDialog-user--input"}>
                        <MaterialTextInput label={"Target User"} />
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
            <div class={"rw-mdc-warnDialog-user--main"}></div>
        );
        return this.elementSet.main;
    }

    /**
     * Refreshes the content of the root element
     */
    refresh(): void {
        // Oh, how I miss setState()...
        const root = (
            <div class={"rw-mdc-warnDialog-user mdc-card mdc-card--outlined"}>
                {this.elementSet.main}
                {this.elementSet.overlay}
            </div>
        );
        if (this.elementSet.root)
            this.elementSet.root.parentElement.replaceChild(
                root,
                this.elementSet.root
            );
        else this.elementSet.root = root;
    }

    /**
     * Renders the MaterialWarnDialogUser card.
     */
    render(): JSX.Element {
        this.elementSet.overlay = this.renderOverlay();
        this.elementSet.main = this.renderMain();
        this.refresh();
        return this.elementSet.root;
    }
}
