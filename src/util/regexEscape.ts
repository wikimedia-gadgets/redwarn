/**
 * Escapes a string that may contain special characters for regular expressions.
 * @param string The string to escape.
 */
export default function (string: string): string {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
