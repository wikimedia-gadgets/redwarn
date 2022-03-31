import { WarningLevel } from "app/mediawiki";

export const WarningIcons: {
    [key in WarningLevel]: { icon: string; iconColor: string };
} = {
    [WarningLevel.None]: {
        icon: "check_circle",
        iconColor: "green",
    },
    [WarningLevel.Notice]: {
        icon: "info",
        iconColor: "blue",
    },
    [WarningLevel.Caution]: {
        icon: "announcement",
        iconColor: "orange",
    },
    [WarningLevel.Warning]: {
        icon: "warning",
        iconColor: "red",
    },
    [WarningLevel.Final]: {
        icon: "report", // This one has hard edges
        iconColor: "darkred",
    },
    [WarningLevel.Immediate]: {
        icon: "new_releases", // This one has star-like edges
        iconColor: "darkred",
    },
};
