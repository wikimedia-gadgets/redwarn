import { Setting } from "./Setting";

export default class Config {
    static async refresh(): Promise<void> {
        await $.ajax(
            "/w/index.php?title=Special:MyPage/redwarnConfig.js&action=raw&ctype=text/javascript",
            { dataType: "script" }
        ); // This is effectively mw.loader.getScript, but without caching
        if (window.rw.config?.new != null) {
            this.allSettings().forEach((s) => s.refresh());
        }
    }

    static allSettings(): Map<string, Setting<unknown>> {
        const map = new Map();
        for (const [key, value] of Object.entries(this)) {
            if (value instanceof Setting) {
                map.set(key, value);
            }
        }
        return map;
    }
}
