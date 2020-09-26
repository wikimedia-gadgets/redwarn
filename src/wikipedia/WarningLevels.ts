export enum WarningLevels {
    none,
    notice,
    caution,
    warning,
    final,
}

export interface LastWarningLevel {
    level: WarningLevels;
    notices?: string;
    pageContent?: string;
}
