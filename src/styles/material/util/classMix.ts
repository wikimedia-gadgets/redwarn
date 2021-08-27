export default function (...classes: (string | null | false)[]): string {
    return classes.filter((v) => v != null && v != false).join(" ");
}
