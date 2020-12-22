import { RWUISelectionDialog } from "../../../ui/RWUIDialog";
import MaterialDialog, {
    MaterialDialogContent,
    MaterialDialogTitle,
} from "./MaterialDialog";
import { h as TSX } from "tsx-dom";
import MaterialButton from "./MaterialButton";
import { getMaterialStorage } from "../storage/MaterialStyleStorage";
import { MDCRipple } from "@material/ripple";
import { MDCDialog } from "@material/dialog";

export default class MaterialSelectionDialog extends RWUISelectionDialog {
    show(): Promise<void> {
        const styleStorage = getMaterialStorage();
        styleStorage.dialogTracker.set(this.id, this);

        document.body.appendChild(this.render());

        console.log(this.element);

        $(this.element)
            .find("button")
            .each((_, el) => void new MDCRipple(el));
        const dialog = new MDCDialog(this.element);
        dialog.open();

        return new Promise((resolve) => {
            dialog.listen(
                "MDCDialog:closed",
                (event: Event & { detail: { action: string } }) => {
                    this._result = event.detail.action;

                    const res = styleStorage.dialogTracker.get(this.id).result;
                    styleStorage.dialogTracker.delete(this.id);
                    resolve(res);
                }
            );
        });
    }
    render(): HTMLDialogElement {
        this.element = (
            <MaterialDialog
                surfaceProperties={{
                    "style": `width: ${this.props.width ?? "30vw"};`,
                    "aria-modal": true,
                    "aria-labelledby": this.props.title ?? "RedWarn dialog",
                }}
            >
                {this.props.title && (
                    <MaterialDialogTitle>
                        {this.props.title}
                    </MaterialDialogTitle>
                )}
                <MaterialDialogContent>
                    {...this.props.items.flatMap((item) => [
                        <MaterialButton
                            dialogAction={item.data}
                            icon={item.icon}
                            iconColor={item.iconColor}
                            style={{ width: "100%", textAlign: "left" }}
                            contentStyle={
                                item.content.length > 40 && { fontSize: "12px" }
                            }
                        >
                            {item.content}
                        </MaterialButton>,
                        <hr />,
                    ])}
                </MaterialDialogContent>
            </MaterialDialog>
        ) as HTMLDialogElement;
        return this.element;
    }
}
