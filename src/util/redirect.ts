export default function(url: string, inNewTab = false): void {
    if (inNewTab) {
        Object.assign(document.createElement("a"), {
            target: "_blank",
            href: url,
        }).click(); // Open in new tab
    } else {
        window.location.href = url; // open here
    }
}
