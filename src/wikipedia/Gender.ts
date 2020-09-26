export type Gender = "male" | "female" | "unknown";
export type GenderPronoun = "he/him" | "she/her" | "they/them";
export const GenderDict: Map<Gender, GenderPronoun> = new Map([
    ["male", "he/him"],
    ["female", "she/her"],
    ["unknown", "they/them"],
]);
