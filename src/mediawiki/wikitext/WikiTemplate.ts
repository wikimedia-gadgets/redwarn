interface WikiTemplateBuildOptions {
    subst: boolean;
    block: boolean;
    forceParameterName: boolean;
    compressionMinimum: number;
}

const defaultBuildOptions: WikiTemplateBuildOptions = {
    subst: false,
    block: false,
    forceParameterName: false,
    compressionMinimum: 2,
};

/**
 * Squeaky clean wikitext template builder, which immediately handles messy symbols
 * inside of template parameters (namely pipes and equal signs).
 */
export default class WikiTemplate {
    public params: Record<number | string, any>;

    constructor(
        public title: string,
        params: any[] | Record<number | string, any>
    ) {
        if (Array.isArray(params)) {
            this.params = {};
            for (let i = 0; i < params.length; i++) {
                this.params[i + 1] = params[i];
            }
        } else {
            this.params = params;
        }
    }

    set(key: number | string, value: string): WikiTemplate {
        this.params[key] = value;
        return this;
    }

    build(_options: Partial<WikiTemplateBuildOptions> = {}): string {
        const options = Object.assign({}, defaultBuildOptions, _options);
        let wikitext = `{{${options.subst ? "subst:" : ""}${this.title}`;

        const spacer = options.block ? "\n" : "";
        const zeroIndexed = !!(this.params["0"] ?? this.params[0]);
        const numericalParameters: Record<number, any> = {};
        const stringParameters: Record<string, any> = {};

        // Convert to one-indexed parameters, convert number strings to numbers.
        // Also convert pipes into {{!}} to avoid accidentally starting new parameter statements.
        // Also convert equal signs into &#61; to avoid accidentally declaring named parameters.
        for (const [key, value] of Object.entries(this.params)) {
            const actualKey =
                !isNaN(+key) && zeroIndexed
                    ? +key + 1
                    : isNaN(+key)
                    ? key
                    : +key;

            const escapePipes = (
                text: string,
                level: number
            ): [string, number] => {
                let final = "";
                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    if (char === "|" && level === 0) final += "{{!}}";
                    else if (
                        char === "=" &&
                        level === 0 &&
                        !options.forceParameterName
                    )
                        final += "&#61;";
                    else if (char === "{") {
                        const recurseResult = escapePipes(
                            text.slice(i + 1),
                            level + 1
                        );
                        final += "{" + recurseResult[0];
                        i += recurseResult[1];
                    } else if (char === "}" && level !== 0)
                        return [final + "}", i + 1];
                    else final += char;
                }
                return [final, text.length];
            };

            if (typeof actualKey === "number")
                numericalParameters[actualKey] = !!value
                    ? escapePipes(`${value}`, 0)[0]
                    : value;
            else
                stringParameters[actualKey] = !!value
                    ? escapePipes(`${value}`, 0)[0]
                    : value;
        }

        // Find gaps of 3 items or more in the numerical parameters, and transfer those to string
        // parameters (avoids long chains of pipes). At this point, numerical indexes should already
        // start at 1, so start the for loop at 1.
        let lastNumbered = 0;
        const highestNumericalParameter = Math.max(
            ...Object.keys(numericalParameters)
                .map((v) => +v)
                .filter((v) => !isNaN(v))
        );
        for (let i = 1; i < highestNumericalParameter; i++) {
            if (
                !!numericalParameters[i] &&
                `${numericalParameters[i]}`.trim().length !== 0
            ) {
                lastNumbered = i;
            } else if (i - lastNumbered > options.compressionMinimum) {
                const breakIndex = i;
                // Destroy newly-created blank parameters to prevent duplicate keys.
                for (let j = 1; j < i - lastNumbered; j++) {
                    delete numericalParameters[j + lastNumbered];
                }
                for (const index in numericalParameters) {
                    if (+index >= breakIndex) {
                        stringParameters[index] = numericalParameters[index];
                        delete numericalParameters[index];
                    }
                }
            } else {
                // Fill with blank to create blank param in template code.
                numericalParameters[i] = "";
            }
        }

        // Append numerical parameters to wikitext.
        for (const [key, value] of Object.entries(numericalParameters)) {
            const actualValue =
                value instanceof WikiTemplate ? value.build(_options) : value;
            if (options.forceParameterName || actualValue.includes("=")) {
                wikitext += `${spacer}|${key}=${actualValue}`;
            } else {
                wikitext += `${spacer}|${actualValue}`;
            }
        }
        // Append string parameters to wikitext.
        for (const [key, value] of Object.entries(stringParameters)) {
            const actualValue =
                value instanceof WikiTemplate ? value.build(_options) : value;
            wikitext += `${spacer}|${key}=${actualValue}`;
        }

        wikitext += `${spacer}}}`;
        return wikitext;
    }
}
