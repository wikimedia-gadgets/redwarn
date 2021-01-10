import { MediaWikiAPI, Page } from "rww/mediawiki/MediaWiki";

interface Group {
    name: string;
    page?: Page;
    displayName?: string;
}

export default Group;

export function GroupsFromNames(groupNames: string[]): Group[] {
    const groups = [];
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
