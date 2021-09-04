/**
 * Determines whether or not an editor is an IP address.
 *
 * @param ip The name to check.
 */
export default function (ip: string): boolean {
    return mw.util.isIPv4Address(ip) || mw.util.isIPv6Address(ip);
}
