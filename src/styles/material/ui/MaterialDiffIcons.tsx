import { BaseProps, h } from "tsx-dom";
import {
    RWUIDiffIcons,
    RWUIDiffIconsProperties,
} from "rww/ui/elements/RWUIDiffIcons";
import {
    DiffIconRevertContext,
    Revert,
    RevertContextBase,
    RevertStage,
} from "rww/mediawiki";
import RevertOptions, {
    ActionSeverity,
    RevertOption,
} from "rww/definitions/RevertOptions";
import { MDCLinearProgress } from "@material/linear-progress/component";

import "../css/diffIcons.css";
import RedWarnUI from "rww/ui/RedWarnUI";
import i18next from "i18next";
import { Configuration, RevertMethod } from "rww/config";
import { RevertDoneOptions } from "rww/definitions/RevertDoneOptions";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";

function getRollbackOptionClickHandler(
    context: RevertContextBase & { diffIcons: RWUIDiffIcons },
    option: RevertOption
): () => void {
    switch (option.actionType) {
        case "custom":
            return () => option.action(context);
        case "revert":
            return () =>
                Revert.revert(
                    Object.assign(context, {
                        reason: option,
                    }) as DiffIconRevertContext
                );
        case "promptedRevert":
            return () =>
                Revert.promptRollbackReason(context, option.defaultSummary);
    }
}

const MaterialRevertProgress: Record<RevertStage, number> = {
    [RevertStage.Preparing]: 0,
    [RevertStage.Details]: 1 / 3,
    [RevertStage.Revert]: 2 / 3,
    [RevertStage.Finished]: 1,
};

const MaterialActionSeverityColors: Record<ActionSeverity, string> = {
    [ActionSeverity.Neutral]: "black",
    [ActionSeverity.GoodFaith]: "green",
    [ActionSeverity.Mild]: "blue",
    [ActionSeverity.Moderate]: "yellow",
    [ActionSeverity.Severe]: "orange",
    [ActionSeverity.Critical]: "red",
};

export default class MaterialDiffIcons extends RWUIDiffIcons {
    context: DiffIconRevertContext;
    progressBar: {
        element: JSX.Element;
        progress: MDCLinearProgress;
        progressElement: JSX.Element;
        progressLabel: JSX.Element;
    };

    constructor(props: RWUIDiffIconsProperties & BaseProps) {
        super(props);
        Object.assign(this, props);
    }

    renderRevertIcons(): JSX.Element {
        const options: JSX.Element[] = [];

        for (const option of Object.values(RevertOptions.all)) {
            options.push(
                <MaterialIconButton
                    label={option.name}
                    icon={option.icon}
                    iconColor={MaterialActionSeverityColors[option.severity]}
                    data-rw-revert-option={option.id}
                />
            );
        }

        return <div class={"rw-mdc-diffIcons-options"}>{options}</div>;
    }

    renderProgressBar(): JSX.Element {
        let progressElement: HTMLElement;
        let progressLabel: HTMLElement;
        const element = (
            <div class={"rw-mdc-diffIcons-progressBar"}>
                <div class={"rw-mdc-diffIcons-progressBar-content"}>
                    {
                        (progressElement = (
                            <div
                                role="progressbar"
                                class="mdc-linear-progress"
                                aria-label="Revert progress"
                                aria-valuemin="0"
                                aria-valuemax="1"
                                aria-valuenow="0"
                            >
                                <div class="mdc-linear-progress__buffering-dots" />
                                <div class="mdc-linear-progress__buffer" />
                                <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                                    <span class="mdc-linear-progress__bar-inner" />
                                </div>
                                <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                                    <span class="mdc-linear-progress__bar-inner" />
                                </div>
                            </div>
                        ))
                    }
                    {(progressLabel = <div>Reverting changes...</div>)}
                </div>
            </div>
        );

        this.progressBar = {
            element: element,
            progress: new MDCLinearProgress(progressElement),
            progressElement: progressElement,
            progressLabel: progressLabel,
        };

        return element;
    }

    renderRevertDoneOptions(): JSX.Element {
        const options: JSX.Element[] = [];

        for (const option of Object.values(RevertDoneOptions)) {
            options.push(
                <MaterialIconButton
                    label={option.name}
                    icon={option.icon}
                    iconColor={"black"}
                    onClick={() => option.action(this.context)}
                />
            );
        }

        return <div class={"rw-mdc-diffIcons-doneOptions"}>{options}</div>;
    }

    render(): JSX.Element {
        this.self = (
            <div class={"rw-mdc-diffIcons"}>
                {this.renderRevertIcons()}
                {this.renderProgressBar()}
                {this.renderRevertDoneOptions()}
            </div>
        );

        this.self.querySelectorAll("[data-rw-revert-option]").forEach((v) => {
            const context = {
                latestRevision: this.latestRevision,
                newRevision: this.newRevision,
                oldRevision: this.oldRevision,
                diffIcons: this,
            };

            v.addEventListener(
                "click",
                getRollbackOptionClickHandler(
                    context,
                    RevertOptions.all[v.getAttribute("data-rw-revert-option")]
                )
            );
        });

        return this.self;
    }

    onStartRevert(context: DiffIconRevertContext) {
        this.context = context;
        this.self.classList.toggle("rw-mdc-diffIcons--reverting", true);
    }

    onRevertStageChange(stage: RevertStage) {
        if (this.progressBar?.progress)
            this.progressBar.progress.progress = MaterialRevertProgress[stage];
        if (this.progressBar?.progressLabel) {
            const MaterialRevertProgressLabel: Record<RevertStage, string> = {
                [RevertStage.Preparing]: i18next.t("ui:diff.progress.prepare"),
                [RevertStage.Details]: i18next.t("ui:diff.progress.details"),
                [RevertStage.Revert]: i18next.t("ui:diff.progress.revert", {
                    context:
                        Configuration.Revert.revertMethod.value ===
                        RevertMethod.Rollback
                            ? "rollback"
                            : undefined,
                }),
                [RevertStage.Finished]: i18next.t("ui:diff.progress.prepare"),
            };
            this.progressBar.progressLabel.innerText =
                MaterialRevertProgressLabel[stage];
        }
    }

    onEndRevert() {
        this.self.classList.toggle("rw-mdc-diffIcons--reverting", false);
        this.self.classList.toggle("rw-mdc-diffIcons--finished", true);
    }

    onRevertFailure() {
        this.self.classList.toggle("rw-mdc-diffIcons--reverting", false);
        this.self.classList.toggle("rw-mdc-diffIcons--finished", false);

        RedWarnUI.Toast.quickShow({
            content: i18next.t("ui:toasts.rollbackError"),
        });
    }
}
