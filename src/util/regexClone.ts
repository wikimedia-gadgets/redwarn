/**
 * Clones a regular expression.
 * @param originalRegex The original regular expression.
 * @param injectFlags Flags to be injected (optional).
 * @see https://gist.github.com/bennadel/97f7530ca0de0523008e
 */
export default function(originalRegex : RegExp, injectFlags = "") : RegExp {
    const pattern = originalRegex.source;
    let flags = originalRegex.flags;

    for (const flag of injectFlags.toLowerCase()) {
        if (!flags.includes(flag))
            flags += flag;
    }

    // Return a clone with the additive flags.
    return new RegExp(pattern, flags);
}