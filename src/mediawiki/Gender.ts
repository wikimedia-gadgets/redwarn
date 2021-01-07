/** The name of a give gender. */
export type Gender = "male" | "female" | "unknown";
/** The pronoun of a give gender. */
export type GenderPronoun = "he/him" | "she/her" | "they/them";
/** A map connecting genders to their pronouns. */
export const GenderDict: Map<Gender, GenderPronoun> = new Map([
    ["male", "he/him"],
    ["female", "she/her"],
    ["unknown", "they/them"],
]);
