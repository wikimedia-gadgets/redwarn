export default async function (duration: number) {
    return new Promise((res) => setTimeout(res, duration));
}
