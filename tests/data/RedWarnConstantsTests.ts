import path from "path";
import fs from "fs";
import * as constants from "../../src/data/RedWarnConstants";

describe("RedWarn Constants file tests", () => {
    const srcFolder = path.resolve(__dirname, "..", "..", "src");
    const constantsFile = fs.readFileSync(
        path.resolve(srcFolder, "data", "RedWarnConstants.ts"),
        "utf8"
    );

    test("Ensure no other imports", () => {
        expect(constantsFile).not.toMatch(/^\s*import (?!buildinfo)/gim);
    });

    test("Internal version follows semantic versioning", () => {
        expect(constants.RW_VERSION).toMatch(/^\d*\.\d*\.\d*$/);
    });
});
