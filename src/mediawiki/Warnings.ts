import { WarningLevel } from "./WarningLevel";
import type { User } from "rww/mediawiki/User";
import RedWarnWikiConfiguration from "rww/data/RedWarnWikiConfiguration";

// TODO Move this to wiki-specific definition files.
// TODO i18n

export interface WarningOptions {
    warningText: string;
    targetUser: User;
    warning?: Warning;
    warnLevel?: WarningLevel;
    relatedPage?: string;
    additionalText?: string;
}

export enum WarningType {
    Tiered,
    SingleIssue,
    PolicyViolation,
}

export interface WarningCategory {
    id: string;
    label: string;
}

export type SerializedWarningCategories = Record<
    string,
    Omit<WarningCategory, "id">
>;

type WarningFieldVisibility = "required" | "disabled" | "optional";

interface WarningBase {
    name: string;
    template: string;
    note?: string;
    keywords?: string[];

    relatedPage?:
        | WarningFieldVisibility
        | {
              visibility?: WarningFieldVisibility;
              label?: string;
          };
    additionalText?:
        | WarningFieldVisibility
        | {
              visibility?: WarningFieldVisibility;
              label?: string;
          };
}

export function getWarningFieldVisibility(
    field:
        | WarningFieldVisibility
        | {
              visibility?: WarningFieldVisibility;
              label?: string;
          }
): WarningFieldVisibility {
    return typeof field === "string" ? field : field.visibility;
}

export interface TieredWarning extends WarningBase {
    category: WarningCategory;
    type: WarningType.Tiered;
    levels: WarningLevel[];
}

export interface SingleIssueWarning extends WarningBase {
    category: WarningCategory;
    type: WarningType.SingleIssue;
}

export interface PolicyViolationWarning extends WarningBase {
    category: WarningCategory;
    type: WarningType.PolicyViolation;
}
export type Warning =
    | TieredWarning
    | SingleIssueWarning
    | PolicyViolationWarning;

export type SerializedWarningTypes = "tiered" | "single" | "policy";
export const SerializedWarningType: Record<
    SerializedWarningTypes,
    WarningType
> = {
    tiered: WarningType.Tiered,
    single: WarningType.SingleIssue,
    policy: WarningType.PolicyViolation,
};

export interface SerializedTieredWarning extends WarningBase {
    category: string;
    type: Extract<SerializedWarningTypes, "tiered">;
    levels: WarningLevel[];
}

export interface SerializedNonTieredWarning extends WarningBase {
    category: string;
    type: Exclude<SerializedWarningTypes, "tiered">;
}

export type SerializedWarning =
    | SerializedTieredWarning
    | SerializedNonTieredWarning;

export class WarningManager {
    public static get warnings(): Record<string, Warning> {
        return RedWarnWikiConfiguration.c.warnings.warnings;
    }
    public static get warningCategories(): WarningCategory[] {
        return RedWarnWikiConfiguration.c.warnings.categories;
    }
    public static get warningCategoriesMap(): Record<string, WarningCategory> {
        return RedWarnWikiConfiguration.c.warnings.categories.reduce(
            (obj, next) => {
                obj[next.id] = next;
                return obj;
            },
            <Record<string, WarningCategory>>{}
        );
    }
    public static get warningsByCategories(): Record<
        string,
        Record<string, Warning>
    > {
        return Object.entries(this.warnings).reduce(
            (categories, [id, warning]) => {
                if (!categories[warning.category.id])
                    categories[warning.category.id] = {};

                categories[warning.category.id][id] = warning;
                return categories;
            },
            <Record<string, Record<string, Warning>>>{}
        );
    }
    public static get warningArrayByCategories(): Record<string, Warning[]> {
        return Object.entries(this.warnings).reduce(
            (categories, [id, warning]) => {
                if (!categories[warning.category.id])
                    categories[warning.category.id] = [];

                categories[warning.category.id].push(warning);
                return categories;
            },
            <Record<string, Warning[]>>{}
        );
    }
}
