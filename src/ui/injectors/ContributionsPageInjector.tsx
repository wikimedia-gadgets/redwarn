import { h } from "tsx-dom";
import i18next from "i18next";
import { Revert, Revision } from "rww/mediawiki";
import RedWarnWikiConfiguration from "rww/config/wiki/RedWarnWikiConfiguration";
import Log from "rww/data/RedWarnLog";

export default class ContributionsPageInjector {
    /**
     * Initialize the injector. If the page is a diff page, this injector
     * will trigger.
     */
    static async init(): Promise<void> {
        if (mw.config.get("wgPageName").startsWith("Special:Contributions"))
            ContributionsPageInjector.display();
    }

    static display(): void {
        Log.info("Loading contributions page buttons...");
        document
            .querySelectorAll(
                ".mw-contributions-list > li.mw-contributions-current[data-mw-revid]"
            )
            .forEach((li) => {
                const revision = Revision.fromID(
                    +li.getAttribute("data-mw-revid")
                );

                const context = {
                    newRevision: revision,
                    latestRevision: revision,
                };

                const previewLink = (
                    <a
                        style="color: green; cursor: pointer;"
                        onClick={() => Revert.preview(context)}
                        data-rw-tooltip={i18next.t<string>(
                            "ui:contribs.previewTooltip"
                        )}
                    >
                        {i18next.t<string>("ui:contribs.previewLink")}
                    </a>
                );

                const vandalLink = (
                    <a
                        style="color: red; cursor: pointer;"
                        onClick={() =>
                            Revert.revert(
                                Object.assign(context, {
                                    prefilledReason:
                                        RedWarnWikiConfiguration.c.warnings
                                            .vandalismWarning.name,
                                })
                            )
                        }
                        data-rw-tooltip={i18next.t<string>(
                            "ui:contribs.vandalTooltip"
                        )}
                    >
                        {i18next.t<string>("ui:contribs.vandalLink")}
                    </a>
                );

                const rollbackLink = (
                    <a
                        style="color: blue; cursor: pointer;"
                        onClick={async () => {
                            Revert.revert(
                                Object.assign(context, {
                                    prefilledReason:
                                        await Revert.promptRollbackReason(
                                            "",
                                            context
                                        ),
                                })
                            );
                        }}
                        data-rw-tooltip={i18next.t<string>(
                            "ui:contribs.rollbackTooltip"
                        )}
                    >
                        {i18next.t<string>("ui:contribs.rollbackLink")}
                    </a>
                );

                const wrapper = (
                    <span style="cursor: default; font-family: Roboto; font-weight: 400;">
                        &nbsp;
                        {previewLink}&nbsp;
                        {vandalLink}&nbsp;
                        {rollbackLink}
                    </span>
                );

                li.querySelector(".mw-uctop").appendChild(wrapper);
            });
    }
}
