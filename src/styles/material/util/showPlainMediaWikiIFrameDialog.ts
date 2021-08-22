import { Page } from "rww/mediawiki";
import RedWarnUI from "rww/ui/RedWarnUI";
import { RWUIIFrameDialogProps } from "rww/ui/elements/RWUIIFrameDialog";
import { url } from "rww/util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const plainCSS: string = require("../plain/plainMediaWiki.css.txt");

interface PlainMediaWikiIFrameDialogShowOptions {
    safeMode?: boolean;
}

export default function (
    page: Page,
    additionalProps: Partial<Omit<RWUIIFrameDialogProps, "src">> &
        PlainMediaWikiIFrameDialogShowOptions = {}
): Promise<any> {
    const frameOptions: RWUIIFrameDialogProps = Object.assign(
        {
            src: additionalProps.safeMode
                ? url(page.url, { safemode: "true" })
                : page.url,
            width: "calc(100vw - 176px)",
            height: "90vh"
        },
        additionalProps
    );
    if (frameOptions.customStyle) {
        if (Array.isArray(frameOptions.customStyle))
            frameOptions.customStyle.push(plainCSS);
        else frameOptions.customStyle = [frameOptions.customStyle, plainCSS];
    } else frameOptions.customStyle = plainCSS;

    return new RedWarnUI.IFrameDialog(frameOptions).show();
}
