import i18next from "i18next";

// TODO write tests for these

/**
 * Returns a formatted version of the age of the provided date.
 *
 * @param age The date to process.
 */
export default function formatAge(age: Date): string {
    const ageFormat = i18next.t<Record<string, string>>("misc:ageFormat");

    const difference = Date.now() - age.getTime();

    const years = Math.floor(difference / 31557600000);
    const months = Math.floor(difference / 2629800000);
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor(difference / 60000);
    const seconds = Math.floor(difference / 1000);

    let str: string;
    if (seconds <= 44) {
        str = ageFormat.s;
    } else if (seconds <= 89) {
        str = ageFormat.m;
    } else if (minutes <= 44) {
        str = ageFormat.mm.replace("%d", minutes.toString());
    } else if (minutes <= 89) {
        str = ageFormat.h;
    } else if (hours <= 21) {
        str = ageFormat.hh.replace("%d", hours.toString());
    } else if (hours <= 35) {
        str = ageFormat.d;
    } else if (days <= 25) {
        str = ageFormat.dd.replace("%d", days.toString());
    } else if (days <= 45) {
        str = ageFormat.M;
    } else if (days <= 319) {
        str = ageFormat.MM.replace("%d", months.toString());
    } else if (days <= 547) {
        str = ageFormat.y;
    } else {
        str = ageFormat.yy.replace("%d", years.toString());
    }
    return ageFormat.past.replace("%s", str);
}
