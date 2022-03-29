import { MediaWikiAPI, Page } from "rww/mediawiki";

// User groups handle permissions for a User. An example would be the Administators group on most wikis.
interface Group {
    /** The name of the group. */
    name: string;
    /** The page to link to for the given group (for example, [[WP:ROLLBACKERS]] for rollbackers). */
    page?: Page;
    /** The display name of the group. */
    displayName?: string;
}

export default Group;

/**
 * Returns an array of groups from their names.
 * @param groupNames The list of groups to get.
 */
export function GroupsFromNames(groupNames: string[]): GroupArray {
    const groups = new GroupArray();
    for (const name of groupNames) {
        if (name === "*") continue;

        if (MediaWikiAPI.groups.has(name)) {
            groups.push(MediaWikiAPI.groups.get(name));
        } else {
            groups.push({
                name: name,
            });
        }
    }
    return groups;
}

export class GroupArray extends Array<Group> {
    includesGroup(name: string | string[]): boolean {
        if (typeof name === "string")
            return this.filter((group) => group.name === name).length > 0;
        // For all groups in the array, check if they are part of this user's groups.
        else
            return name
                .map((v) => this.filter((group) => group.name === v).length > 0)
                .reduce((p, n) => p || n, false);
    }

    /**
     * Returns the first group from `groups` that this user is a member of.
     * @param groups
     */
    groupMatch(groups: string[]): Group {
        for (const group of groups) {
            const g = this.filter((g) => group === g.name);
            if (g.length > 0) return g[0];
        }
        return null;
    }
}
