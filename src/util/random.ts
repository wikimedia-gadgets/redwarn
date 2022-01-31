const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const characters = [...letters, ...numbers];

/**
 * Generates a random string of a given length with an alphabetic first
 * character. CRYPTOGRAPHICALLY INSECURE!
 *
 * @param length
 */
export default function (length = 8): string {
    let out = "";
    while (out.length < length) {
        if (out.length === 0)
            out += letters[Math.floor(Math.random() * letters.length)];
        else out += characters[Math.floor(Math.random() * characters.length)];
    }
    return out;
}
