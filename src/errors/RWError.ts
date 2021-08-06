// note: enum must be before RWErrorBase or else TS gets mad

import i18next, { i18n } from "i18next";

/**
 * Enum that contains all the errors. New errors must be registered here.
 *
 * Sections:
 *
 * | Section |  Description   |
 * |---------|----------------|
 * | 0XXX    | Debug Messages |
 * | 1XXX    | Info Messages  |
 * | 2XXX    | Startup        |
 * | 3XXX    | Dialog/UI      |
 * | 4XXX    | MediaWiki/API  |
 * | 5XXX    | Permission     |
 * | 6XXX    | Config         |
 * | 7XXX    | Style          |
 * | 8XXX    | <unused>       |
 * | 9XXX    | Misc.          |
 *
 */

export const enum RWErrors {
    UNSET = "RW0000",
    StartupComplete = "RW0001",
    APIError = "RW4000",
    PageMissing = "RW4001",
    PageInvalid = "RW4002",
    RevisionMissing = "RW4003",
    SectionIndexMissing = "RW4004",
    StyleMissing = "RW7000",
}

/**
 * Base class for a RedWarn error. Create an error by copying the TemplateError.
 * It is not necessary to create a class for every error. For messages (RW0000-RW1999)
 * and other errors without classes GenericRWError may be used.
 */
export default abstract class RWErrorBase {
    readonly code: RWErrors = RWErrors.UNSET;
    static readonly message: string = "";
    get message(): string {
        // basically the equivalent of this.constructor.message, i.e. RWErrorBase.message
        // using this mega scuffed hack so we don't need to redeclare message getter for each subclass
        return Object.getPrototypeOf(this).constructor.message;
    }
}

/**
 * RedWarn error. Set message to a i18next compatible format string. Params are passed in as objects.
 *
 * How this works: we make an instance of i18next then leverage the interpolation function of i18next
 * then pass the parameters and the format string that we found using a super scuffed javascript
 * hack because JS doesn't have getClass like in java. This is so that we use the message of each individual
 * extending class instead of for the base class.
 */
export class RWFormattedError<
    T extends Record<string, any>
> extends RWErrorBase {
    constructor(readonly params: T) {
        super();
    }
    get message() {
        const formatString = Object.getPrototypeOf(this).constructor.message;
        //return mw.format(formatString, this.params);
        return RWFormattedError.i18next.services.interpolator.interpolate(
            formatString,
            this.params,
            "qqq",
            {}
        );
    }

    // Leverage i18next to format error strings, in the future this can also be used to i18n error strings
    static i18next: i18n;
    static async init() {
        if (RWFormattedError.i18next != null) {
            throw "Already initialized!";
        }
        RWFormattedError.i18next = i18next.createInstance();
        await RWFormattedError.i18next.init();
    }
}
