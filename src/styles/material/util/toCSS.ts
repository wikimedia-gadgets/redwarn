export default function (rules: Record<string, any>): string {
    // TypeScript gets mad if we try to do this in one `return rules;`.
    if (rules === null) return null;
    if (rules === undefined) return undefined;

    const transformedRules: Record<string, any> = {};

    for (const [key, value] of Object.entries(rules)) {
        if (value == null) continue;
        const splitKey = key.split(/(?=[A-Z])/).map((v) => v.toLowerCase());
        transformedRules[splitKey.join("-")] = value;
    }

    let compiledRules = "";
    for (const [key, value] of Object.entries(transformedRules)) {
        compiledRules += `${key}:${value};`;
    }

    return compiledRules;
}
