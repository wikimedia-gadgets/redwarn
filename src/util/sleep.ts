/**
 * Returns a promise that awaits after a given number of milliseconds.
 * @param ms Duration to wait for.
 */
export default async function (ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}
