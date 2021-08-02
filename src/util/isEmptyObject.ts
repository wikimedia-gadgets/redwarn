/**
 * Does an extremely fast {} check. This doesn't rely on
 * Object.keys, or any other similar transformation function,
 * making it lightning quick.
 *
 * @param object The object to check.
 */
export default function (
    object: Record<string, any>
): object is Record<string, never> {
    for (const i in object) return false;
    return true;
}
