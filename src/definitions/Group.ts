import { MediaWikiAPI, Page } from "rww/mediawiki";

interface Group {
    name: string;
    page?: Page;
    displayName?: string;
}

export default Group;

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
