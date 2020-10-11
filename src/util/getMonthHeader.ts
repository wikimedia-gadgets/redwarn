export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

/**
 * Gets the month header for talk pages in the format `Month YYYY`.
 * @param date The date to use.
 */
export default function(date = new Date()) : string {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}