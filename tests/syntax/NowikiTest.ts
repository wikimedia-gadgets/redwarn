import path from "path";
import fs from "fs";
import { rootDir } from "../RedWarnWebTestUtils";

describe("Ensure no usage of <nowiki> inside of source files", () => {
    const filter = /\.[jt]sx?$/;

    const enterDirectory = (directory: string): string[] => {
        const files: string[] = [];
        fs.readdirSync(directory).forEach((file: string) => {
            const absolutePath = path.join(directory, file);
            if (fs.statSync(absolutePath).isDirectory())
                files.push(...enterDirectory(absolutePath));
            else {
                if (filter.test(file)) {
                    files.push(absolutePath);
                }
            }
        });
        return files;
    };

    const srcFolder = path.resolve(rootDir, "src");
    for (const sourceFile of enterDirectory(srcFolder)) {
        test(path.relative(srcFolder, sourceFile), () => {
            expect(
                /<\/?\s*nowiki\s*\/?>/.test(fs.readFileSync(sourceFile, "utf8"))
            ).toBe(false);
        });
    }
});
