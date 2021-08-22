export default function (rules: Record<string, any>) {
    const transformedRules: Record<string, any> = {};

    for (const [key, value] of Object.entries(rules)) {
        const splitKey = key.split(/(?=[A-Z])/).map((v) => v.toLowerCase());
        transformedRules[splitKey.join("-")] = value;
    }

    let compiledRules = "";
    for (const [key, value] of Object.entries(transformedRules)) {
        compiledRules += `${key}:${value};`;
    }

    return compiledRules;
}
