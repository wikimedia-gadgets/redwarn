import DiffViewerInjector from "app/ui/injectors/DiffViewerInjector";
import ContributionsPageInjector from "app/ui/injectors/ContributionsPageInjector";
import PageIconsInjector from "app/ui/injectors/PageIconsInjector";
import PreferencesInjector from "./PreferencesInjector";

export default class UIInjectors {
    diffViewerInjector: DiffViewerInjector = new DiffViewerInjector();
    contributionsPageInjector: ContributionsPageInjector =
        new ContributionsPageInjector();
    pageIconsInjector: PageIconsInjector = new PageIconsInjector();
    preferencesInjector: PreferencesInjector = new PreferencesInjector();
    /**
     * Run all injectors.
     *
     * Injectors are responsible for modifying existing MediaWiki DOM. This allows
     * for non-invasive DOM procedures, and allows a separation between UI and DOM-
     * modifying code from actual API functionality.
     */
    async inject(): Promise<any> {
        return Promise.all([
            this.diffViewerInjector.init(),
            this.contributionsPageInjector.init(),
            this.pageIconsInjector.init(),
            this.preferencesInjector.init(),
        ]);
    }
}
