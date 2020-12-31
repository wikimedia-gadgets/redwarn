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
    moduleFileExtensions: ["ts", "tsx", "js"]

};