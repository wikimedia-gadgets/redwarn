import RedWarnLocalDB from "rww/data/database/RedWarnLocalDB";
import RedWarnStore from "rww/data/RedWarnStore";

export class RecentPages {

    static get recentPages(): typeof RedWarnLocalDB.i.recentPages {
        return RedWarnLocalDB.i.recentPages;
    }
    private static get page(): typeof RedWarnStore.currentPage {
        return RedWarnStore.currentPage;
    }

    static pages: string[];

    static async init(): Promise<void> {
        RecentPages.recentPages.put({
            title: RecentPages.page.title.getPrefixedText(),
            lastVisit: Date.now()
        });

        (await RecentPages.recentPages.getAll())
            .sort((a, b) => b.lastVisit - a.lastVisit)
            .slice(50)
            .forEach(page => RecentPages.recentPages.delete(page.title));

        RecentPages.pages = (await RecentPages.recentPages.getAll())
            .sort((a, b) => b.lastVisit - a.lastVisit)
            .map(page => page.title);
    }

}
