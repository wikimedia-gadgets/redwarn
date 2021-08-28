/**
 * A page or section where page protection requests will be added.
 */
export interface ProtectionRequestTarget {
    /**
     * The target page to add to.
     *
     * @example Wikipedia:Requests for page protection/Increase
     */
    page: string;
    /**
     * The target section ID to add to.
     */
    section?: number | string;
    /**
     * The wikitext to add to the target page/section.
     */
    template: string;
    /**
     * Whether or not the content will be appended or prepended to the
     * target page/section.
     *
     * @default "append"
     */
    method?: "append" | "prepend";
    /**
     * The amount of new lines to add before/after each request when
     * appending/prepending, respectively.
     *
     * @default 0
     */
    extraLines?: number;
}

export function isProtectionRequestTarget(
    object: any
): object is ProtectionRequestTarget {
    return (
        typeof object === "object" &&
        typeof object["page"] === "string" &&
        typeof object["template"] === "string"
    );
}
