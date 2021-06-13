// import {Rollback} from "rww/mediawiki";
// import DiffViewerInjector from "rww/ui/injectors/DiffViewerInjector";

export default class RealTimeRecentChanges {
    private static onRTRC: boolean;
    static init(): void {
        this.onRTRC =
            (mw.config.get("wgTitle") === "Krinkle/RTRC" &&
                mw.config.get("wgAction") === "view") ||
            (mw.config.get("wgCanonicalSpecialPageName") === "Blankpage" &&
                // https://github.com/Krinkle/mw-gadget-rtrc/blob/f84d47fa8e776d31ad6f83764930a352a695d572/src/rtrc.js#L1655-L1656
                mw.config.get("wgTitle").split("/", 2)[1] === "RTRC");
        if (this.onRTRC) {
            mw.hook("wikipage.diff").add(async (diff: JQuery) => {
                // TODO: dev-rwTS-difficons
                // const context = new RevertContext(
                //     Revision.fromID(Rollback.getNewerRevisionId(), {
                //         page: Page.fromTitle(
                //             diff.find("strong > a").attr("title")
                //         ),
                //         user: User.fromUsername(
                //             diff.find("#mw-diff-ntitle2 > a > bdi").text()
                //         ),
                //     })
                // );
                // DiffViewerInjector.loadOptions(context, false);
            });
        }
    }

    static nextDiff(): void {
        if (
            this.onRTRC &&
            ($('input[name="autoDiff"]')[0] as HTMLInputElement).checked
        ) {
            $("#diffNext").trigger("click");
        }
    }
}
