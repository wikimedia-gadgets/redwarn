import { WarningLevel } from "rww/mediawiki";

export default function (warningLevel: WarningLevel): string {
    switch (warningLevel) {
        case null:
            return "";
        case WarningLevel.None:
            return "";
        case WarningLevel.Notice:
            return "1";
        case WarningLevel.Caution:
            return "2";
        case WarningLevel.Warning:
            return "3";
        case WarningLevel.Final:
            return "4";
        case WarningLevel.Immediate:
            return "4im";
    }
}
