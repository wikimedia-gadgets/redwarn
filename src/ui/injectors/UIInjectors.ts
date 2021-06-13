// import DiffViewerInjector from "rww/ui/injectors/DiffViewerInjector";

export default class UIInjectors {
    /**
     * Run all injectors.
     *
     * Injectors are responsible for modifying existing MediaWiki DOM. This allows
     * for non-invasive DOM procedures, and allows a separation between UI and DOM-
     * modifying code from actual API functionality.
     */
    static async inject(): Promise<any> {
        // return Promise.all([DiffViewerInjector.init()]);
    }
}
