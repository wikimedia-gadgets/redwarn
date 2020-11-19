/**
 * Base class for a RedWarn error. Create an error by copying the TemplateError.
 * It is not necessary to create a class for every error. For messages (RW0000-RW1999)
 * and other errors without classes GenericRWError may be used.
 */
export default abstract class RWErrorBase {
    static readonly code: RWErrors;
    static readonly message: string;
}

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
export enum RWErrors {
    StartupComplete = "RW0001",
}
