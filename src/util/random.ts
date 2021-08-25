const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz09123456789";

/**
 * Generates a random string of a given length. CRYPTOGRAPHICALLY
 * INSECURE!
 *
 * @param length
 */
export default function (length = 8): string {
    let out = "";
    while (out.length < length) {
        out += characters[Math.floor(Math.random() * characters.length)];
    }
    return out;
}
