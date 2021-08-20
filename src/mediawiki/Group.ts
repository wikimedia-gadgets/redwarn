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
 * @param groupName The list of groups to get.
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

export class GroupArray extends Array {
    includesGroup(name: string): boolean {
        return this.filter((group) => group.name === name).length > 0;
    }
}
