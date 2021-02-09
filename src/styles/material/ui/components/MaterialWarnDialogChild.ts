import RWUIElement from "rww/ui/elements/RWUIElement";

export abstract class MaterialWarnDialogChild extends RWUIElement {
    /**
     * Refresh the contents of this child without changing the root.
     */
    abstract refresh(): void;
}
