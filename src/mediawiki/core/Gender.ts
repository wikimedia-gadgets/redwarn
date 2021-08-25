/** The name of a given gender. */
export type Gender = "male" | "female" | "unknown";
/** The common pronouns of a given gender. */
export type GenderPronoun = "he/him" | "she/her" | "they/them";
/** A map connecting genders to their common pronouns. */
export const GenderDict: Map<Gender, GenderPronoun> = new Map([
    ["male", "he/him"],
    ["female", "she/her"],
    ["unknown", "they/them"]
]);
