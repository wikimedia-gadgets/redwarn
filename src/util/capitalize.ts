/**
 * Capitalises the given string.
 * @param target The string to capitalise.
 */
export default function (target: string): string {
    return target.charAt(0).toUpperCase() + target.slice(1);
}
