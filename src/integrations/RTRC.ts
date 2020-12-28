import Rollback from "../wikipedia/Rollback";
import User from "../wikipedia/User";

export default class RTRC {
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
                const rollback = await Rollback.factory(
                    {
                        page: diff.find("strong > a").attr("title"),
                        user: new User(
                            diff.find("#mw-diff-ntitle2 > a > bdi").text()
                        ),
                    },
                    true
                );
                rollback.loadOptions(false);
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
