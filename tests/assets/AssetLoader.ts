import fs from "fs";
import path from "path";

export default class AssetLoader {

    static getHTML(key : string) : string {
        return fs.readFileSync(path.resolve(__dirname, "html", `${key}.html`)).toString("utf-8");
    }

}