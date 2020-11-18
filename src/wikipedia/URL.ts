import RedWarnStore from "../data/RedWarnStore";

export default class WikipediaURL {
    static getHistory(page: string): string {
        return `${RedWarnStore.wikiIndex}?title=${mw.util.wikiUrlencode(
            page
        )}&action=history`;
    }

    static getDiff(page: string, newId: string, parentId: string): string {
        return `${RedWarnStore.wikiIndex}?title=${mw.util.wikiUrlencode(
            page
        )}&diff=${newId}&oldid=${parentId}&diffmode=source`;
    }
}
