import { b64en } from "rww/util";

export default function (data: string, contentType?: string): string {
    if (data.length > 4000000000) {
        // Limit imposed by IE. Not like we support it anyway.
        throw new Error(
            "You must be extremely insane as to put a 4 GB dependency onto your style definition."
        );
    }

    return `data:${contentType ?? "text"};base64,${b64en(data)}`;
}
