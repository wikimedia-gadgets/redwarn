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
    static config: Map<string, any>;

    /**
     * Display a notification message to the user.
     * @param options.autoHide A boolean indicating whether the notifification should automatically
     * be hidden after shown. Or if it should persist.
     * @param options.autoHideSeconds Key to autoHideSeconds for number of seconds for timeout of
     * auto-hide notifications.
     * @param options.tag An optional string. When a notification is tagged only one message with that
     * tag will be displayed. Trying to display a new notification with the same tag as one
     * already being displayed will cause the other notification to be closed and this new
     * notification to open up inside the same place as the previous notification.
     * @param options.title An optional title for the notification. Will be displayed above the
     * content. Usually in bold.
     * @param options.type An optional string for the type of the message used for styling:
     * Examples: 'info', 'warn', 'error', 'success'.
     * @param options.visibleTimeout A boolean indicating if the autoHide timeout should be based on
     * time the page was visible to user. Or if it should use wall clock time.
     * @param options.id HTML ID to set on the notification element.
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw-method-notify
     */
    static notify(
        message: HTMLElement | HTMLElement[] | JQuery | mw.Message | string,
        options?: Partial<typeof mw.notification.defaults>
    ): JQueryPromise<mw.Notification>;

    static notification: {
        /**
         * The defaults for notify options parameter.
         * @param autoHide A boolean indicating whether the notifification should automatically
         * be hidden after shown. Or if it should persist.
         * @param autoHideSeconds Key to autoHideSeconds for number of seconds for timeout of
         * auto-hide notifications.
         * @param tag An optional string. When a notification is tagged only one message with that
         * tag will be displayed. Trying to display a new notification with the same tag as one
         * already being displayed will cause the other notification to be closed and this new
         * notification to open up inside the same place as the previous notification.
         * @param title An optional title for the notification. Will be displayed above the
         * content. Usually in bold.
         * @param type An optional string for the type of the message used for styling:
         * Examples: 'info', 'warn', 'error', 'success'.
         * @param visibleTimeout A boolean indicating if the autoHide timeout should be based on
         * time the page was visible to user. Or if it should use wall clock time.
         * @param id HTML ID to set on the notification element.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.notification-property-defaults
         */
        defaults: {
            autoHide: boolean;
            autoHideSeconds: "short" | "long";
            tag?: string;
            title?: string;
            type?: "info" | "warn" | "error" | "success";
            visibleTimeout: boolean;
            id: string;
        };
    };

    /**
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user
     */
    static user: {
        /**
         * Get the current user's name
         *
         * @link https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getName
         */
        getName(): string | null;

        /**
         * Get the current user's name
         *
         * @link https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.user-method-getName
         */
        getGroups(callback?: (groups: string[]) => void): Promise<string[]>;
    };

    /**
     * Utility library
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util
     */
    static util: {
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
        wikiUrlencode(str: string): string;

        /**
         * Check whether a string is an IP address
         *
         * @since 1.25
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-isIPAddress
         */
        isIPAddress(address: string, allowBlock?: boolean): boolean;

        /**
         * Grab the URL parameter value for the given parameter.
         * Returns null if not found.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.util-method-getParamValue
         */
        getParamValue(param: string, url?: string): string | null;
    };

    /**
     * Create an instance of mw.hook.
     *
     * @method hook
     * @member mw
     * @param {string} name Name of hook.
     * @return {mw.hook}
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook
     */
    static hook<T extends unknown[], U extends string>(name: U): mw.Hook<T>;
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
            parameters?: Record<string, any>;
            /** Default options for jQuery#ajax **/
            ajax?: AjaxSettings;
            /**
             * Whether to use U+001F when joining multi-valued parameters (since 1.28).
             * Default is true if ajax.url is not set, false otherwise for compatibility.
             **/
            useUS?: boolean;
        };

        /**
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-constructor
         */
        constructor(options?: typeof Api.defaultOptions);

        /**
         * Perform API get request
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api-method-get
         */
        get(
            parameters: Record<string, any>,
            ajaxOptions?: AjaxSettings
        ): JQueryPromise<JQueryXHR>;

        postWithEditToken(
            params: Record<string, any>,
            ajaxOptions?: AjaxSettings
        ): JQueryPromise<JQueryXHR>;

        /**
         * Convenience method for `action=rollback`.
         *
         * @param {string|mw.Title} page
         * @param {string} user
         * @param {Object} [params] Additional parameters
         * @return {jQuery.Promise}
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Api.plugin.rollback-method-rollback
         */
        rollback(
            page: string,
            user: string,
            params?: Record<string, any>
        ): JQueryPromise<Record<string, any>>;
    }

    /**
     * Create an object that can be read from or written to via methods that allow interaction both
     * with single and multiple properties at once.
     *
     * **NOTE**: This is a private utility class for internal use by the framework.
     * Don't rely on its existence.
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Map
     */
    class Map {
        /**
         * @param global
         * @private
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Map-method-constructor
         */
        private constructor(global?: boolean);

        /**
         * Check if a given key exists in the map.
         * @param selection Key to check
         * @returns True if the key exists
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Map-method-exists
         */
        exists(selection: string): boolean;

        /**
         * Get the value of one or more keys.
         *
         * If called with no arguments, all values are returned.
         * @param selection Key or array of keys to retrieve values for.
         * @param fallback Value for keys that don't exist.
         * @returns If selection was a string, returns the value, If selection was an array, returns
         * an object of key/values. If no selection is passed, a new object with all key/values is returned.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Map-method-get
         */
        get(selection: string | string[], fallback?: any): any | null;

        /**
         * Get the value of one or more keys.
         *
         * If called with no arguments, all values are returned.
         * @param selection Key to set value for, or object mapping keys to values
         * @param value Value to set (optional, only in use when key is a string)
         * @returns True on success, false on failure
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Map-method-set
         */
        set(selection: string | Record<string, any>, value: any): boolean;
    }

    /**
     * Object constructor for messages.
     *
     * Similar to the Message class in MediaWiki PHP.
     *
     * Format defaults to 'text'.
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message
     */
    class Message {
        /**
         * Object constructor for messages.
         *
         * Similar to the Message class in MediaWiki PHP.
         *
         * Format defaults to 'text'.
         * @param map Message store
         * @param key
         * @param parameters
         */
        constructor(map: mw.Map, key: string, parameters?: []);

        /**
         * Change the format to 'escaped' and convert message to string
         *
         * This is equivalent to using the 'text' format (see text), then HTML-escaping the output.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-escaped
         */
        escaped(): string;

        /**
         * Check if a message exists
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-exists
         */
        escaped(): boolean;

        /**
         * Add (does not replace) parameters for $N placeholder values.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-params
         */
        params(params: any[]): mw.Message;

        /**
         * Change format to 'parse' and convert message to string
         *
         * If `jqueryMsg` is loaded, this parses the message text from wikitext (where supported) to HTML
         *
         * Otherwise, it is equivalent to plain.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-parse
         */
        parse(): string;

        /**
         * Parse the message to DOM nodes, rather than HTML string like parse.
         *
         * This method is only available when jqueryMsg is loaded.
         * @since 1.27
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-parseDom
         */
        parseDom(): JQuery;

        /**
         * Get parsed contents of the message.
         *
         * The default parser does simple $N replacements and nothing else. This may be overridden to
         * provide a more complex message parser. The primary override is in the mediawiki.jqueryMsg module.
         *
         * This function will not be called for nonexistent messages.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-parser
         */
        parser(): string;

        /**
         * Change format to 'plain' and convert message to string
         *
         * This substitutes parameters, but otherwise does not change the message text.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-plain
         */
        plain(): string;

        /**
         * Change format to 'text' and convert message to string
         *
         * If jqueryMsg is loaded, {{-transformation is done where supported (such as {{plural:}},
         * {{gender:}}, {{int:}}).
         *
         * Otherwise, it is equivalent to plain
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-text
         */
        text(): string;

        /**
         * Convert message object to its string form based on current format.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Message-method-toString
         */
        toString(): string;
    }

    /**
     * A Notification object for 1 message.
     *
     * The constructor is not publicly accessible; use mw.notification.notify instead. This does
     * not insert anything into the document (see start).
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_
     */
    class Notification {
        /**
         * Close the notification.
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-close
         */
        close(): void;

        /**
         * Pause any running auto-hide timer for this notification
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-pause
         */
        pause(): void;

        /**
         * Start autoHide timer if not already started. Does nothing if autoHide is disabled. Either
         * to resume from pause or to make the first start.
         * @https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.Notification_-method-resume
         */
        resume(): void;

        postWithEditToken(
            params: Record<string, any>,
            ajaxOptions?: AjaxSettings
        ): JQueryPromise<JQueryXHR>;
    }

    /**
     * Registry and firing of events.
     *
     * MediaWiki has various interface components that are extended, enhanced
     * or manipulated in some other way by extensions, gadgets and even
     * in core itself.
     *
     * This framework helps streamlining the timing of when these other
     * code paths fire their plugins (instead of using document-ready,
     * which can and should be limited to firing only once).
     *
     * Features like navigating to other wiki pages, previewing an edit
     * and editing itself – without a refresh – can then retrigger these
     * hooks accordingly to ensure everything still works as expected.
     *
     * Example usage:
     *
     *     mw.hook( 'wikipage.content' ).add( fn ).remove( fn );
     *     mw.hook( 'wikipage.content' ).fire( $content );
     *
     * Handlers can be added and fired for arbitrary event names at any time. The same
     * event can be fired multiple times. The last run of an event is memorized
     * (similar to `$(document).ready` and `$.Deferred().done`).
     * This means if an event is fired, and a handler added afterwards, the added
     * function will be fired right away with the last given event data.
     *
     * Like Deferreds and Promises, the mw.hook object is both detachable and chainable.
     * Thus allowing flexible use and optimal maintainability and authority control.
     * You can pass around the `add` and/or `fire` method to another piece of code
     * without it having to know the event name (or `mw.hook` for that matter).
     *
     *     var h = mw.hook( 'bar.ready' );
     *     new mw.Foo( .. ).fetch( { callback: h.fire } );
     *
     * Note: Events are documented with an underscore instead of a dot in the event
     * name due to jsduck not supporting dots in that position.
     *
     * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook
     */
    interface Hook<T extends any[]> {
        /**
         * Register a hook handler
         *
         * @param {...Function} handler Function to bind.
         * @chainable
         */
        add: (...handler: ((...payload: T) => any)[]) => Hook<T>;

        /**
         * Unregister a hook handler
         *
         * @param {...Function} handler Function to unbind.
         * @chainable
         */
        remove: (...handler: ((...payload: T) => any)[]) => Hook<T>;

        /**
         * Run a hook.
         *
         * @param {...Mixed} data
         * @return {mw.Hook}
         * @chainable
         */
        fire: (...payload: T) => Hook<T>;
    }
}
