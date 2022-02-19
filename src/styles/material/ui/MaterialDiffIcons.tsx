import { BaseProps, h } from "tsx-dom";
import {
    RWUIDiffIcons,
    RWUIDiffIconsProperties,
} from "rww/ui/elements/RWUIDiffIcons";
import {
    DiffIconRevertContext,
    RestoreStage,
    Revert,
    RevertContextBase,
    RevertStage,
} from "rww/mediawiki";
import RevertOptions, {
    ActionSeverity,
    RevertOption,
} from "rww/mediawiki/revert/RevertOptions";
import { MDCLinearProgress } from "@material/linear-progress/component";

import "../css/diffIcons.css";
import i18next from "i18next";

import { RevertDoneOptions } from "rww/mediawiki/revert/RevertDoneOptions";
import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";
import Log from "rww/data/RedWarnLog";
import { Configuration } from "rww/config/user/Configuration";
import { RevertMethod } from "rww/config/user/ConfigurationEnums";

// TODO: Convert to enum.
function getRollbackOptionClickHandler(
    diffIcons: MaterialDiffIcons,
    option: RevertOption
): () => void {
    const context = diffIcons.context;
    switch (option.actionType) {
        case "custom":
            return () => {
                Log.trace("custom RevertOption selected.", option);
                option.action(context);
            };
        case "revert":
            return () => {
                Log.trace("revert RevertOption selected.", option);
                diffIcons.selectedReason = option;
                Revert.revert(
                    Object.assign(context, {
                        reason: option,
                    }) as DiffIconRevertContext
                );
            };
        case "promptedRevert":
            return () => {
                Log.trace("promptedRevert RevertOption selected.", option);
                Revert.promptRollback(context, {
                    diffIcons: context.diffIcons,
                    defaultText: option.defaultSummary,
                });
            };
        case "promptedRestore":
            return () => {
                Log.trace("promptedRestore RevertOption selected.", option);
                Revert.promptRestore(
                    context.side === "new"
                        ? context.newRevision
                        : context.oldRevision,
                    {
                        diffIcons: context.diffIcons,
                        defaultText: option.defaultSummary,
                    }
                );
            };
    }
}

const MaterialRevertProgress: Record<RevertStage | RestoreStage, number> = {
    [RevertStage.Preparing]: 0,
    [RestoreStage.Preparing]: 0,
    [RevertStage.Details]: 1 / 3,
    [RestoreStage.Details]: 1 / 3,
    [RevertStage.Revert]: 2 / 3,
    [RestoreStage.Restore]: 2 / 3,
    [RevertStage.Finished]: 1,
    [RestoreStage.Finished]: 1,
};

// Default severity colors.
const MaterialActionSeverityColors: Record<ActionSeverity, string> = {
    // Default
    [ActionSeverity.Neutral]: "black",
    [ActionSeverity.GoodFaith]: "green",
    [ActionSeverity.Mild]: "blue",
    [ActionSeverity.Moderate]: "gold",
    [ActionSeverity.Severe]: "orange",
    [ActionSeverity.Critical]: "red",
};

const MaterialHighContrastActionSeverityColors: Record<ActionSeverity, string> =
    {
        // High contrast
        [ActionSeverity.Neutral]: "black",
        [ActionSeverity.GoodFaith]: "blue",
        [ActionSeverity.Mild]: "blue",
        [ActionSeverity.Moderate]: "red",
        [ActionSeverity.Severe]: "red",
        [ActionSeverity.Critical]: "red",
    };

export default class MaterialDiffIcons extends RWUIDiffIcons {
    _context: RevertContextBase &
        Partial<DiffIconRevertContext> & {
            diffIcons: RWUIDiffIcons;
            side: "new" | "old";
        };
    get context(): MaterialDiffIcons["_context"] {
        this._context = {
            latestRevision: this.latestRevision,
            newRevision: this.newRevision,
            oldRevision: this.oldRevision,
            side: this.side,
            diffIcons: this,
        };
        return this._context;
    }

    progressBar: {
        element: JSX.Element;
        progress: MDCLinearProgress;
        progressElement: JSX.Element;
        progressLabel: JSX.Element;
    };
    finishMessageElement: HTMLElement;

    selectedReason: RevertOption;
    readonly latestIcons;

    constructor(props: RWUIDiffIconsProperties & BaseProps) {
        super(props);
        Object.assign(this, props);
        if (
            props.latestRevision.revisionID ===
            (props.side === "new"
                ? props.newRevision.revisionID
                : props.oldRevision.revisionID)
        ) {
            this.latestIcons = true;
        }
    }

    renderRestoreIcon(): JSX.Element {
        return (
            <div class={"rw-mdc-diffIcons-options"}>
                <MaterialIconButton
                    label={"Restore this revision"}
                    icon={"history"}
                    iconColor={"purple"}
                    onClick={() => {
                        Revert.promptRestore(
                            this.side === "new"
                                ? this.newRevision
                                : this.oldRevision,
                            { diffIcons: this }
                        );
                    }}
                />
            </div>
        );
    }

    renderRevertIcons(): JSX.Element {
        const options: JSX.Element[] = [];

        for (const option of Object.values(RevertOptions.all)) {
            if (!option.enabled && !option.system) continue;
            options.push(
                <MaterialIconButton
                    label={option.name}
                    icon={option.icon}
                    iconColor={
                        option.color ??
                        Configuration.Accessibility.highContrast.value
                            ? MaterialHighContrastActionSeverityColors[
                                  option.severity
                              ]
                            : MaterialActionSeverityColors[option.severity]
                    }
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

        for (const option of Object.values(RevertDoneOptions())) {
            if (this.latestIcons || (!this.latestIcons && option.showOnRestore))
                options.push(
                    <MaterialIconButton
                        label={option.name}
                        icon={option.icon}
                        iconColor={"black"}
                        onClick={() =>
                            option.action(
                                Object.assign(this.context, {
                                    reason: this.selectedReason,
                                })
                            )
                        }
                    />
                );
        }

        return (
            <div class={"rw-mdc-diffIcons-doneOptions"}>
                <div>{options}</div>
                {
                    (this.finishMessageElement = (
                        <div>
                            {i18next.t<string>("ui:diff.progress.finish")}
                        </div>
                    ))
                }
            </div>
        );
    }

    render(): JSX.Element {
        this.self = (
            <div class={"rw-mdc-diffIcons"}>
                {this.latestIcons
                    ? this.renderRevertIcons()
                    : this.renderRestoreIcon()}
                {this.renderProgressBar()}
                {this.renderRevertDoneOptions()}
            </div>
        );

        this.self.querySelectorAll("[data-rw-revert-option]").forEach((v) => {
            v.addEventListener(
                "click",
                getRollbackOptionClickHandler(
                    this,
                    RevertOptions.all[v.getAttribute("data-rw-revert-option")]
                )
            );
        });

        return this.self;
    }

    onStartRevert(context: DiffIconRevertContext) {
        Object.assign(this.context, context);
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
    }

    onStartRestore(): void {
        this.self.classList.toggle("rw-mdc-diffIcons--reverting", true);
    }

    onRestoreStageChange(stage: RestoreStage): void {
        if (this.progressBar?.progress)
            this.progressBar.progress.progress = MaterialRevertProgress[stage];
        if (this.progressBar?.progressLabel) {
            const MaterialRestoreProgressLabel: Record<RestoreStage, string> = {
                [RestoreStage.Preparing]: i18next.t("ui:diff.progress.prepare"),
                [RestoreStage.Details]: i18next.t("ui:diff.progress.details"),
                [RestoreStage.Restore]: i18next.t("ui:diff.progress.restore"),
                [RestoreStage.Finished]: i18next.t("ui:diff.progress.prepare"),
            };
            this.progressBar.progressLabel.innerText =
                MaterialRestoreProgressLabel[stage];
        }
    }

    onEndRestore(editResponse: { edit: Record<string, any> }): void {
        this.self.classList.toggle("rw-mdc-diffIcons--reverting", false);
        this.self.classList.toggle("rw-mdc-diffIcons--finished", true);

        this.finishMessageElement.innerText = i18next.t<string>(
            "ui:diff.progress.finish",
            {
                context: editResponse.edit.nochange ? "nochange" : undefined,
            }
        );
    }

    onRestoreFailure(): void {
        this.self.classList.toggle("rw-mdc-diffIcons--reverting", false);
        this.self.classList.toggle("rw-mdc-diffIcons--finished", false);
    }
}
