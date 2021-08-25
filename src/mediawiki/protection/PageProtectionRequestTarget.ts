/**
 * A page or section where page protection requests will be added.
 */
export interface PageProtectionRequestTarget {
    /**
     * The target page to add to.
     *
     * @example Wikipedia:Requests for page protection/Increase
     */
    page: string;
    /**
     * The target section ID to add to. If each request adds a new level
     * 2 heading, this value should be set to "new".
     */
    section?: number | "new";
    /**
     * The wikitext to add to the target page/section.
     */
    template: string;
    /**
     * Whether or not the content will be appended or prepended to the
     * target page/section.
     *
     * @default "prepend"
     */
    method?: "append" | "prepend";
    /**
     * The amount of new lines to add before/after each request when
     * appending/prepending, respectively.
     *
     * @default 0
     */
    extraLines: 0;
}
