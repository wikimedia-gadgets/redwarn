import { RWUIPageIcons } from "rww/ui/elements/RWUIPageIcons";
import { BaseProps, h } from "tsx-dom";

export default class MaterialPageIcons extends RWUIPageIcons {
    public static readonly elementName = "rwPageIcons";

    /**
     * This element, as returned by {@link RWUIPageIcons.render}.
     */
    self: HTMLElement;

    constructor(props?: BaseProps) {
        super();
        Object.assign(props, this);
    }

    renderIcons(): JSX.Element[] {
        const icons: JSX.Element[] = [];

        return icons;
    }

    /**
     * Returns the rendered page icons.
     */
    render(): JSX.Element {
        return (this.self = <div>{this.renderIcons()}</div>);
    }
}
