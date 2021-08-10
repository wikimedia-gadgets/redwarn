import path from "path";
import fs from "fs";
import * as constants from "../../src/data/RedWarnConstants";
import { rootDir } from "../RedWarnWebTestUtils";

describe("RedWarn Constants file tests", () => {
    const constantsFile = fs.readFileSync(
        path.resolve(rootDir, "src", "data", "RedWarnConstants.ts"),
        "utf8"
    );

    test("Ensure no other imports", () => {
        expect(constantsFile).not.toMatch(/^\s*import (?!buildinfo)/gim);
    });

    test("Internal version follows semantic versioning", () => {
        expect(constants.RW_VERSION).toMatch(/^\d*\.\d*\.\d*$/);
    });
});
