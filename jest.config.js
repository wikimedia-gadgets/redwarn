module.exports = {

    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
        '^.+\\.m?[tj]sx?$': 'ts-jest'
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
        "^rww(.*)$": "<rootDir>/src$1",
        "\\.(css)$": "<rootDir>/tests/__mocks__/style.js",
        "!$": "<rootDir>/tests/__mocks__/buildinfo.js"
    }

};