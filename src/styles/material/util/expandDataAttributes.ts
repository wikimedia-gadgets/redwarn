export default function (props: Record<string, any>): Record<string, any> {
    return Object.entries(props)
        .filter(([name]) => name.startsWith("data-"))
        .reduce<Record<string, any>>((attributes, next): Record<
            string,
            any
        > => {
            attributes[next[0]] = next[1];
            return attributes;
        }, {});
}
