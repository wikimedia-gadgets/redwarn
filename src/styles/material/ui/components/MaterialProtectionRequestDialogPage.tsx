import { h } from "tsx-dom";
import MaterialProtectionRequestDialog from "rww/styles/material/ui/MaterialProtectionRequestDialog";
import MaterialInputCard, {
    MaterialInputCardProps
} from "rww/styles/material/ui/components/MaterialInputCard";
import { Page, ProtectionManager } from "rww/mediawiki";
import i18next from "i18next";
import toCSS from "rww/styles/material/util/toCSS";
import { capitalize } from "rww/util";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import { isFlaggedRevsProtectionEntry } from "rww/mediawiki/protection/ProtectionEntry";

interface MaterialProtectionRequestDialogPageProps
    extends MaterialInputCardProps {
    parent: MaterialProtectionRequestDialog;
}

export class MaterialProtectionRequestDialogPage extends MaterialInputCard {
    readonly parent: MaterialProtectionRequestDialog;
    constructor(props: MaterialProtectionRequestDialogPageProps) {
        super(props);

        this.parent = props.parent;
        this.props.outlined = true;
        this.props.i18n = i18next.t("ui:protectionRequest.page", {
            returnObjects: true
        });
    }

    async renderMain(value: string): Promise<HTMLDivElement> {
        this.parent.page = Page.fromTitle(value);

        // Disable controls
        this.parent.protectionInformation = null;
        // Grab page protection information.
        this.parent.protectionInformation = await ProtectionManager.getProtectionInformation(
            this.parent.page
        );
        this.parent.protectionReasons = await ProtectionManager.getProtectionReasons(
            this.parent.page
        );

        // Turn information into elements.
        const protectionEntryElements: JSX.Element[] = [];

        for (const entry of this.parent.protectionInformation) {
            if (entry.type !== "edit" && entry.type !== "_flaggedrevs")
                // Block everything except edits.
                continue;

            const level = RedWarnWikiConfiguration.c.protection?.levels?.find(
                (v) =>
                    (entry.type === "_flaggedrevs" &&
                        v.id === "_flaggedrevs") ||
                    v.id === entry.level
            );

            const note = isFlaggedRevsProtectionEntry(entry)
                ? ""
                : entry.cascade != null
                ? i18next.t("ui:protectionRequest.info.cascading")
                : entry.source != null
                ? i18next.t("ui:protectionRequest.info.cascaded")
                : "";

            protectionEntryElements.push(
                <div
                    style={toCSS({
                        display: "block"
                    })}
                    class={"rw-mdc-prd-protectionLevel"}
                >
                    {level?.iconURL ? (
                        <img alt={level.name} src={level.iconURL} />
                    ) : (
                        <span
                            class="material-icons"
                            style={toCSS({
                                color: level?.color ?? "black"
                            })}
                        >
                            lock
                        </span>
                    )}
                    <span class={"rw-mdc-protectionLevels--name"}>
                        {`${capitalize(
                            level != null
                                ? i18next.t(
                                      "ui:protectionRequest.info.detailed",
                                      {
                                          statusName: level.statusName,
                                          ...(entry.expiry === "infinity"
                                              ? {
                                                    context: "indefinite"
                                                }
                                              : {
                                                    date: entry.expiry.toLocaleString()
                                                }),
                                          note:
                                              note.length > 0
                                                  ? i18next.t(
                                                        "ui:protectionRequest.info.note",
                                                        {
                                                            detail: note
                                                        }
                                                    )
                                                  : ""
                                      }
                                  )
                                : i18next.t(
                                      "ui:protectionRequest.info.fallback",
                                      {
                                          type: entry.type,
                                          level: entry.level,
                                          ...(entry.expiry === "infinity"
                                              ? {
                                                    context: "indefinite"
                                                }
                                              : {
                                                    date: entry.expiry.toLocaleString()
                                                }),
                                          note:
                                              note.length > 0
                                                  ? i18next.t(
                                                        "ui:protectionRequest.info.note",
                                                        {
                                                            detail: note
                                                        }
                                                    )
                                                  : ""
                                      }
                                  )
                        )}`}
                    </span>
                </div>
            );
        }

        if (protectionEntryElements.length === 0) {
            protectionEntryElements.push(
                <div
                    style={toCSS({
                        display: "inline-block"
                    })}
                    class={"rw-mdc-prd-protectionLevel"}
                >
                    <span
                        class="material-icons"
                        style={toCSS({
                            color: "black"
                        })}
                    >
                        lock_open
                    </span>
                    <span class={"rw-mdc-protectionLevels--name"}>
                        {`${i18next.t(
                            "ui:protectionRequest.info.unprotected"
                        )}`}
                    </span>
                </div>
            );
        }

        return (
            <div>
                <div class={"rw-mdc-prd-title__title"}>
                    <span
                        onClick={() => {
                            this.beginInput();
                        }}
                        data-rw-mdc-tooltip={i18next.t(
                            "ui:protectionRequest.page.change"
                        )}
                    >
                        {value}
                    </span>
                </div>
                <div class={"rw-mdc-prd-protectionInfo"}>
                    {protectionEntryElements}
                </div>
            </div>
        ) as HTMLDivElement;
    }
}

export default function generator(
    props: MaterialProtectionRequestDialogPageProps
): JSX.Element & { MPRDTitle: MaterialProtectionRequestDialogPage } {
    const mprdTitle = new MaterialProtectionRequestDialogPage(props);
    return Object.assign(mprdTitle.render(), {
        MPRDTitle: mprdTitle
    });
}
