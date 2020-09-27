// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
export default function(string : string) : string {
    // Referring to the table here:
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
    // these characters should be escaped
    // \ ^ $ * + ? . ( ) | { } [ ]
    // These characters only have special meaning inside of brackets
    // they do not need to be escaped, but they MAY be escaped
    // without any adverse effects (to the best of my knowledge and casual testing)
    // : ! , =
    // my test "~!@#$%^&*(){}[]`/=?+\|-_;:'\",<.>".match(/[\#]/g)

    const specials = [
        // order matters for these
        "-"
        , "["
        , "]"
        // order doesn't matter for any of these
        , "/"
        , "{"
        , "}"
        , "("
        , ")"
        , "*"
        , "+"
        , "?"
        , "."
        , "\\"
        , "^"
        , "$"
        , "|"
    ];

    // I choose to escape every character with '\'
    // even though only some strictly require it when inside of []
    const regex = RegExp(`[${specials.join("\\")}]`, "g");

    return string.replace(regex, "\\$&");
}