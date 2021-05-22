/**
 * Gets the month header for talk pages in the format `Month YYYY`.
 * @param date The date to use.
 */
export default function (date = new Date()): string {
    return `${
        (mw.language as any).months["genitive"][date.getMonth()]
    } ${date.getFullYear()}`;
}
