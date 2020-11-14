/**
 * Parses to semantic versioning strings and returns -1, 0, or 1 based on the difference.
 * @returns `-1` if the first version is older than the second version,
 *          `0` if the first version is equal to the second version,
 *          `1` if the first version is newer than the second version
 */
export default function(versionA : string, versionB : string) : -1 | 0 | 1 | null {
    const [
        versionAWhole,
        versionAMajor,
        versionAMinor,
        versionAPatch
    ] = /(\d+)\.(\d+)\.(\d+)/g.exec(versionA) ?? [];
    const [
        versionBWhole,
        versionBMajor,
        versionBMinor,
        versionBPatch
    ] = /(\d+)\.(\d+)\.(\d+)/g.exec(versionB) ?? [];

    if (versionAWhole == null || versionBWhole == null)
        return null;

    if (versionAWhole === versionBWhole)
        return 0;

    if (+(versionAMajor) > +(versionBMajor))
        return 1;
    else if (+(versionAMajor) < +(versionBMajor))
        return -1;

    if (+(versionAMinor) > +(versionBMinor))
        return 1;
    else if (+(versionAMinor) < +(versionBMinor))
        return -1;

    if (+(versionAPatch) > +(versionBPatch))
        return 1;
    else if (+(versionAPatch) < +(versionBPatch))
        return -1;

    return 0;
}