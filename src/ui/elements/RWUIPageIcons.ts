import RWUIElement from "app/ui/elements/RWUIElement";

/**
 * The RWUIPageIcons handle the page customization icons found in the top-right
 * corner of article pages.
 *
 * Note that RWUIPageIcons are not used if the user has set RedWarn options to
 * appear in the sidebar or portlet.
 */
export class RWUIPageIcons extends RWUIElement {
    public static readonly elementName = "rwPageIcons";

    /**
     * This element, as returned by {@link RWUIPageIcons.render}.
     */
    self: HTMLElement;

    /**
     * Renders the page icons. These are then wrapped by a RedWarn container
     * element to isolate other elements.
     *
     * This is called only once: on insertion. Any subsequent expected changes
     * to this element will be called through other functions.
     */
    render(): JSX.Element {
        return undefined;
    }
}
