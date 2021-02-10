export default function (title: string): string {
    return new mw.Title(title).toString();
}
