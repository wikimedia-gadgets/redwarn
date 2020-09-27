/**

 Since it's too much of a bother to convert the ENTIRE MediaWiki JS
 API into TypeScript definitions (and since attempts to convert the
 existing JSDoc declarations have failed), these declarations are
 manually written. Their types are manually taken from the docs.

 https://doc.wikimedia.org/mediawiki-core/master/js/

**/

/**

 Rules for creating declarations:
  - Singletons must be part of the class declaration, not the namespace declaration.
  - If it's a class, declare it under a namespace with the same name as the parent.
  - JQueryPromise is not an instance of Promise, so keep all promises as JQueryPromise.

**/

/**
 * Base library for MediaWiki.
 *
 * Exposed globally as `mw`, with `mediaWiki` as alias.
 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
 */
declare class mw {
    /**
     * Map of configuration values.
     *
     * Check out [the complete list of configuration values](https://www.mediawiki.org/wiki/Manual:Interface/JavaScript#mw.config)
     * on mediawiki.org.
     *
     * If `$wgLegacyJavaScriptGlobals` is true, this Map will add its values to the
     * global `window` object.
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-property-config
     */
    static config : Map<string, any>;

    /**
     * Utility library
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util
     */
    static util : {

        /**
         * Encode page titles for use in a URL
         *
         * We want / and : to be included as literal characters in our title URLs
         * as they otherwise fatally break the title.
         *
         * The others are decoded because we can, it's prettier and matches behaviour
         * of `wfUrlencode` in PHP.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-wikiUrlencode
         */
        wikiUrlencode(str : string) : string;

        /**
         * Check whether a string is an IP address
         *
         * @since 1.25
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-isIPAddress
         */
        isIPAddress(address : string, allowBlock? : boolean) : boolean;

    }

    /**
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user
     */
    static user : {

        /**
         * Get the current user's name
         *
         * @link https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getName
         */
        getName() : string | null

        /**
         * Get the current user's name
         *
         * @link https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getName
         */
        getGroups(callback? : (groups : string[]) => void) : Promise<string[]>

    }

}

/**
 * Base library for MediaWiki.
 *
 * Exposed globally as `mw`, with `mediaWiki` as alias.
 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
 */
declare namespace mw {

    import AjaxSettings = JQuery.AjaxSettings;

    /**
     * Constructor to create an object to interact with the API of a particular
     * MediaWiki server. mw.Api objects represent the API of a particular MediaWiki server.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api
     */
    class Api {

        /**
         * Default options for jQuery#ajax calls. Can be overridden by passing
         * `options` to {@link mw.Api} constructor.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-property-defaultOptions
         */
        private static defaultOptions: {
            /** Default query parameters for API requests **/
            parameters: Record<string, any>,
            /** Default options for jQuery#ajax **/
            ajax: AjaxSettings,
            /**
             * Whether to use U+001F when joining multi-valued parameters (since 1.28).
             * Default is true if ajax.url is not set, false otherwise for compatibility.
             **/
            useUS: boolean
        };

        /**
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-constructor
         */
        constructor(options?: typeof Api.defaultOptions);

        /**
         * Perform API get request
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-get
         */
        get(parameters: Record<string, any>, ajaxOptions?: AjaxSettings)
            : JQueryPromise<JQueryXHR>;

        postWithEditToken(params: Record<string, any>, ajaxOptions?: AjaxSettings)
            : JQueryPromise<JQueryXHR>

    }

}