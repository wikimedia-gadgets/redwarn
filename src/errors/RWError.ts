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
 * | 4XXX    | Wikipedia API  |
 * | 5XXX    | Permission     |
 * | 6XXX    | Config         |
 * | 7XXX    | <unused>       |
 * | 8XXX    | <unused>       |
 * | 9XXX    | Misc.          |
 *
 */
export const enum RWErrors {
    UNSET = "RW0000",
    StartupComplete = "RW0001",
}

/**
 * Base class for a RedWarn error. Create an error by copying the TemplateError.
 * It is not necessary to create a class for every error. For messages (RW0000-RW1999)
 * and other errors without classes GenericRWError may be used.
 */
export default abstract class RWErrorBase {
    static readonly code: RWErrors = RWErrors.UNSET;
    static readonly message: string = "";
    get message() {
        // basically the equivalent of this.constructor.message, i.e. RWErrorBase.message
        // using this mega scuffed hack so we don't need to redeclare message getter for each subclass
        return Object.getPrototypeOf(this).constructor.message;
    }
}

export class RWFormattedError extends RWErrorBase {
    constructor(readonly params: any[]) {
        super();
    }
    get message() {
        const formatString = Object.getPrototypeOf(this).constructor.message;
        // TODO remove these three comments when types-mediawiki gets updated
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore mw.format doesn't exist in types-mediawiki yet
        return mw.format(formatString, this.params);
    }
}
