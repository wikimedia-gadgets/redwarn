import RedWarnStore from "rww/data/RedWarnStore";
import { Page } from "rww/mediawiki";
import { url } from ".";

export default function (article: string | Page, fullURL?: boolean): string {
    const articlePath = RedWarnStore.wikiArticlePath.replace(
        /\$1/g,
        mw.util.wikiUrlencode(article instanceof Page ? article.title : article)
    );

    if (fullURL) return url(articlePath);
    else return articlePath;
}
