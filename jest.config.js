module.exports = {

    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
        "\\.m?[tj]sx?$": "ts-jest",
        "\\.txt$": "jest-raw-loader"
    },
    transformIgnorePatterns: [
        "node_modules[/\\\\](?!@material)"
    ],
    testRegex: "(/tests/)(.*?)(Tests?)(\\.tsx?|\\.jsx?)$",
    testPathIgnorePatterns: [
        "ignore-",
        "disabled-"
    ],
    moduleFileExtensions: ["ts", "tsx", "js"],
    moduleNameMapper: {
        "^app(.*)$": "<rootDir>/src$1",
        "\\.(css)$": "<rootDir>/tests/__mocks__/style.js",
        "buildinfo\.js$": "<rootDir>/tests/__mocks__/buildinfo.js"
    }

};