import MaterialIconButton from "rww/styles/material/ui/components/MaterialIconButton";
import { Warning, WarningLevel, WarningType } from "rww/mediawiki";
import RedWarnStore from "rww/data/RedWarnStore";
import { BaseProps, h } from "tsx-dom";

interface MaterialWarnSearchDialogCard {
    id: string;
    warning: Warning;
}

export default function (
    props: BaseProps & MaterialWarnSearchDialogCard
): JSX.Element {
    const { warning, id } = props;
    return (
        <div
            class="rw-mdc-warnSearchDialog-warning mdc-card mdc-card--outlined"
            data-rw-warning={id}
        >
            <table>
                <tr>
                    <td style={"width: 100%"}>
                        <div class={"rw-mdc-cardTitle"}>{warning.name}</div>
                    </td>
                    <td rowSpan={4}>
                        <MaterialIconButton
                            icon={((): string => {
                                // Where icons are handled for listings
                                switch (warning.type) {
                                    case WarningType.Tiered:
                                        return "signal_cellular_alt";
                                    case WarningType.SingleIssue:
                                        return "info";
                                    case WarningType.PolicyViolation:
                                        return "new_releases";
                                }
                            })()}
                            ripple={false}
                        />
                    </td>
                </tr>
                <tr>
                    <td style={"width: 100%"}>
                        <div class={"rw-mdc-cardSubtitle"}>
                            <a
                                href={RedWarnStore.articlePath(
                                    `Template:${warning.template}${
                                        warning.type === WarningType.Tiered
                                            ? warning.levels[0] === 5
                                                ? "4im"
                                                : warning.levels[0]
                                            : ""
                                    }`
                                )}
                                target="_blank"
                            >
                                {/* Opening and closing curlies */}
                                &#123;&#123;{warning.template}
                                &#125;&#125;
                            </a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class={"rw-mdc-cardSubtitle"}>
                            {warning.type === WarningType.Tiered &&
                                `Available levels: ${warning.levels
                                    .map((v) => {
                                        return `${WarningLevel[v]} (${
                                            v === WarningLevel.Immediate
                                                ? "4im"
                                                : v
                                        })`;
                                    })
                                    .join(", ")}`}
                            {warning.type === WarningType.SingleIssue &&
                                `Single-issue warning`}
                            {warning.type === WarningType.PolicyViolation &&
                                `Policy violation warning`}
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    );
}
