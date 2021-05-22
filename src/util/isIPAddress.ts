export default function (ip: string): boolean {
    return mw.util.isIPv4Address(ip) || mw.util.isIPv6Address(ip);
}
