// https://stackoverflow.com/a/27747377/12573645
// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex(dec: number) {
    return dec.toString(16).padStart(2, "0");
}

// generateId :: Integer -> String
export default function generateId(length = 8): string {
    const arr = new Uint8Array(length / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join("");
}
