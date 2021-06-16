import { h } from "tsx-dom";
import { RWUIDiffIcons } from "rww/ui/elements/RWUIDiffIcons";
import { Revert, RevertContext } from "rww/mediawiki";
import { RevertOption } from "rww/definitions/RevertOptions";

function getRollbackOptionClickHandler(
    context: RevertContext,
    option: RevertOption
): () => void {
    switch (option.actionType) {
        case "custom":
            return () => option.action(context);
        case "revert":
            return () =>
                Revert.revert(Object.assign(context, { revertOption: option }));
        case "promptedRevert":
            return () =>
                Revert.promptRollbackReason(context, option.defaultSummary);
    }
}

export default class MaterialDiffIcons extends RWUIDiffIcons {
    render(): JSX.Element {
        return <div></div>;
    }
}
