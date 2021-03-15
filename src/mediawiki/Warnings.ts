import { WarningLevel } from "./WarningLevel";

// TODO Move this to wiki-specific definition files.
// TODO i18n

export enum WarningCategory {
    Common,
    Article,
    Spam,
    Editors,
    Remove,
    Other,
    Remind,
    Policy,
}

export enum WarningType {
    Tiered,
    SingleIssue,
    PolicyViolation,
}

export const WarningCategoryNames: Record<WarningCategory, string> = {
    [WarningCategory.Common]: "Common warnings",
    [WarningCategory.Article]: "Article conduct warnings",
    [WarningCategory.Spam]: "Promotions and spam",
    [WarningCategory.Editors]: "Behavior towards other editors",
    [WarningCategory.Remove]: "Removal of deletion tags",
    [WarningCategory.Other]: "Other",
    [WarningCategory.Remind]: "Reminders",
    [WarningCategory.Policy]: "Policy violation warnings",
};

interface WarningBase {
    name: string;
    category: WarningCategory;
    template: string;
    note?: string;
    keywords?: string[];
}

export interface TieredWarning extends WarningBase {
    type: WarningType.Tiered;
    levels: WarningLevel[];
}

export interface SingleIssueWarning extends WarningBase {
    type: WarningType.SingleIssue;
}

export interface PolicyViolationWarning extends WarningBase {
    type: WarningType.PolicyViolation;
}

export type Warning =
    | TieredWarning
    | SingleIssueWarning
    | PolicyViolationWarning;

export const Warnings: Record<string, Warning> = {
    "vandalism": {
        name: "Vandalism",
        category: WarningCategory.Common,
        template: "uw-vandalism",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "disruptive": {
        name: "Disruptive editing",
        category: WarningCategory.Common,
        template: "uw-disruptive",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "test": {
        name: "Editing tests",
        category: WarningCategory.Common,
        template: "uw-test",
        type: WarningType.Tiered,
        levels: [1, 2, 3],
    },
    "delete": {
        name: "Removal of content, blanking",
        category: WarningCategory.Common,
        template: "uw-delete",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "generic": {
        name: "Generic warning (for template series missing level 4)",
        category: WarningCategory.Common,
        template: "uw-generic",
        type: WarningType.Tiered,
        levels: [4],
    },
    "biog": {
        name: "Adding unreferenced information about living persons",
        category: WarningCategory.Article,
        template: "uw-biog",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "error": {
        name: "Introducing deliberate factual errors",
        category: WarningCategory.Article,
        template: "uw-error",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "genre": {
        name:
            "Frequent or mass changes to genres without consensus or reference",
        category: WarningCategory.Article,
        template: "uw-genre",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "image": {
        name: "Image-related vandalism",
        category: WarningCategory.Article,
        template: "uw-image",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "joke": {
        name: "Using improper humor",
        category: WarningCategory.Article,
        template: "uw-joke",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "nor": {
        name:
            "Adding original research, including unpublished syntheses of sources",
        category: WarningCategory.Article,
        template: "uw-nor",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "notcensored": {
        name: "Censorship of material",
        category: WarningCategory.Article,
        template: "uw-notcensored",
        type: WarningType.Tiered,
        levels: [1, 2, 3],
    },
    "own": {
        name: "Ownership of articles",
        category: WarningCategory.Article,
        template: "uw-own",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "tdel": {
        name: "Removal of maintenance templates",
        category: WarningCategory.Article,
        template: "uw-tdel",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "unsourced": {
        name: "Addition of unsourced or improperly cited material",
        category: WarningCategory.Article,
        template: "uw-unsourced",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "advert": {
        name: "Using Wikipedia for advertising or promotion",
        category: WarningCategory.Spam,
        template: "uw-advert",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "npov": {
        name: "Not adhering to neutral point of view",
        category: WarningCategory.Spam,
        template: "uw-npov",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "paid": {
        name:
            "Paid editing without disclosure under the Wikimedia Terms of Use",
        category: WarningCategory.Spam,
        template: "uw-paid",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "spam": {
        name: "Adding spam links",
        category: WarningCategory.Spam,
        template: "uw-spam",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "agf": {
        name: "Not assuming good faith",
        category: WarningCategory.Editors,
        template: "uw-agf",
        type: WarningType.Tiered,
        levels: [1, 2, 3],
    },
    "harass": {
        name: "Harassment of other users",
        category: WarningCategory.Editors,
        template: "uw-harass",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "npa": {
        name: "Personal attack directed at a specific editor",
        category: WarningCategory.Editors,
        template: "uw-npa",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "tempabuse": {
        name: "Improper use of warning or blocking template",
        category: WarningCategory.Editors,
        template: "uw-tempabuse",
        type: WarningType.Tiered,
        levels: [1, 2],
    },
    "afd": {
        name: "Removing {{afd}} templates",
        category: WarningCategory.Remove,
        template: "uw-afd",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "blpprod": {
        name: "Removing {{blp prod}} templates",
        category: WarningCategory.Remove,
        template: "uw-blpprod",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "idt": {
        name: "Removing file deletion tags",
        category: WarningCategory.Remove,
        template: "uw-idt",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "speedy": {
        name: "Removing speedy deletion tags",
        category: WarningCategory.Remove,
        template: "uw-speedy",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "attempt": {
        name: "Triggering the edit filter",
        category: WarningCategory.Other,
        template: "uw-attempt",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "chat": {
        name: "Using talk page as forum",
        category: WarningCategory.Other,
        template: "uw-chat",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "create": {
        name: "Creating inappropriate pages",
        category: WarningCategory.Other,
        template: "uw-create",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "mos": {
        name: "Manual of style",
        category: WarningCategory.Other,
        template: "uw-mos",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4],
    },
    "move": {
        name: "Page moves against naming conventions or consensus",
        category: WarningCategory.Other,
        template: "uw-move",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "tpv": {
        name: "Refactoring others' talk page comments",
        category: WarningCategory.Other,
        template: "uw-tpv",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "upload": {
        name: "Uploading unencyclopedic images",
        category: WarningCategory.Other,
        template: "uw-upload",
        type: WarningType.Tiered,
        levels: [1, 2, 3, 4, WarningLevel.Immediate],
    },
    "aiv": {
        name: "Bad AIV report",
        category: WarningCategory.Remind,
        template: "uw-aiv",
        type: WarningType.SingleIssue,
    },
    "autobiography": {
        name: "Creating autobiographies",
        category: WarningCategory.Remind,
        template: "uw-autobiography",
        type: WarningType.SingleIssue,
    },
    "badcat": {
        name: "Adding incorrect categories",
        category: WarningCategory.Remind,
        template: "uw-badcat",
        type: WarningType.SingleIssue,
    },
    "badlistentry": {
        name: "Adding inappropriate entries to lists",
        category: WarningCategory.Remind,
        template: "uw-badlistentry",
        type: WarningType.SingleIssue,
    },
    "bite": {
        name: "Being harsh to newcomers",
        category: WarningCategory.Remind,
        template: "uw-bite",
        type: WarningType.SingleIssue,
    },
    "coi": {
        name: "Conflict of interest",
        category: WarningCategory.Remind,
        template: "uw-coi",
        type: WarningType.SingleIssue,
    },
    "controversial": {
        name: "Introducing controversial material",
        category: WarningCategory.Remind,
        template: "uw-controversial",
        type: WarningType.SingleIssue,
    },
    "copying": {
        name: "Copying text to another page",
        category: WarningCategory.Remind,
        template: "uw-copying",
        type: WarningType.SingleIssue,
    },
    "crystal": {
        name: "Adding speculative or unconfirmed information",
        category: WarningCategory.Remind,
        template: "uw-crystal",
        type: WarningType.SingleIssue,
    },
    "cpmove": {
        name: "Cut and paste moves",
        category: WarningCategory.Remind,
        template: "uw-c&pmove",
        type: WarningType.SingleIssue,
    },
    "dab": {
        name: "Incorrect edit to a disambiguation page",
        category: WarningCategory.Remind,
        template: "uw-dab",
        type: WarningType.SingleIssue,
    },
    "date": {
        name: "Unnecessarily changing date formats",
        category: WarningCategory.Remind,
        template: "uw-date",
        type: WarningType.SingleIssue,
    },
    "deadlink": {
        name: "Removing proper sources containing dead links",
        category: WarningCategory.Remind,
        template: "uw-deadlink",
        type: WarningType.SingleIssue,
    },
    "draftfirst": {
        name: "User should draft in draftspace or userspace",
        category: WarningCategory.Remind,
        template: "uw-draftfirst",
        type: WarningType.SingleIssue,
    },
    "editsummary": {
        name: "Not using edit comment",
        category: WarningCategory.Remind,
        template: "uw-editsummary",
        type: WarningType.SingleIssue,
    },
    "elinbody": {
        name: "Adding external links to the body of an article",
        category: WarningCategory.Remind,
        template: "uw-elinbody",
        type: WarningType.SingleIssue,
    },
    "english": {
        name: "Not communicating in English",
        category: WarningCategory.Remind,
        template: "uw-english",
        type: WarningType.SingleIssue,
    },
    "hasty": {
        name: "Hasty addition of speedy deletion tags",
        category: WarningCategory.Remind,
        template: "uw-hasty",
        type: WarningType.SingleIssue,
    },
    "italicize": {
        name:
            "Italicize books, films, albums, magazines, TV series, etc within articles",
        category: WarningCategory.Remind,
        template: "uw-italicize",
        type: WarningType.SingleIssue,
    },
    "lang": {
        name: "Unnecessarily changing between British and American English",
        category: WarningCategory.Remind,
        template: "uw-lang",
        type: WarningType.SingleIssue,
    },
    "linking": {
        name: "Excessive addition of redlinks or repeated blue links",
        category: WarningCategory.Remind,
        template: "uw-linking",
        type: WarningType.SingleIssue,
    },
    "minor": {
        name: "Incorrect use of minor edits check box",
        category: WarningCategory.Remind,
        template: "uw-minor",
        type: WarningType.SingleIssue,
    },
    "notenglish": {
        name: "Creating non-English articles",
        category: WarningCategory.Remind,
        template: "uw-notenglish",
        type: WarningType.SingleIssue,
    },
    "notvote": {
        name: "We use consensus, not voting",
        category: WarningCategory.Remind,
        template: "uw-notvote",
        type: WarningType.SingleIssue,
    },
    "plagiarism": {
        name: "Copying from public domain sources without attribution",
        category: WarningCategory.Remind,
        template: "uw-plagiarism",
        type: WarningType.SingleIssue,
    },
    "preview": {
        name: "Use preview button to avoid mistakes",
        category: WarningCategory.Remind,
        template: "uw-preview",
        type: WarningType.SingleIssue,
    },
    "redlink": {
        name: "Indiscriminate removal of redlinks",
        category: WarningCategory.Remind,
        template: "uw-redlink",
        type: WarningType.SingleIssue,
    },
    "selfrevert": {
        name: "Reverting self tests",
        category: WarningCategory.Remind,
        template: "uw-selfrevert",
        type: WarningType.SingleIssue,
    },
    "socialnetwork": {
        name: "Wikipedia is not a social network",
        category: WarningCategory.Remind,
        template: "uw-socialnetwork",
        type: WarningType.SingleIssue,
    },
    "sofixit": {
        name: "Be bold and fix things yourself",
        category: WarningCategory.Remind,
        template: "uw-sofixit",
        type: WarningType.SingleIssue,
    },
    "spoiler": {
        name:
            "Adding spoiler alerts or removing spoilers from appropriate sections",
        category: WarningCategory.Remind,
        template: "uw-spoiler",
        type: WarningType.SingleIssue,
    },
    "talkinarticle": {
        name: "Talk in article",
        category: WarningCategory.Remind,
        template: "uw-talkinarticle",
        type: WarningType.SingleIssue,
    },
    "tilde": {
        name: "Not signing posts",
        category: WarningCategory.Remind,
        template: "uw-tilde",
        type: WarningType.SingleIssue,
    },
    "toppost": {
        name: "Posting at the top of talk pages",
        category: WarningCategory.Remind,
        template: "uw-toppost",
        type: WarningType.SingleIssue,
    },
    "userspaceDraftFinish": {
        name: "Stale userspace draft",
        category: WarningCategory.Remind,
        template: "uw-userspace draft finish",
        type: WarningType.SingleIssue,
    },
    "vgscope": {
        name: "Adding video game walkthroughs, cheats or instructions",
        category: WarningCategory.Remind,
        template: "uw-vgscope",
        type: WarningType.SingleIssue,
    },
    "warn": {
        name: "Place user warning templates when reverting vandalism",
        category: WarningCategory.Remind,
        template: "uw-warn",
        type: WarningType.SingleIssue,
    },
    "wrongsummary": {
        name: "Using inaccurate or inappropriate edit summaries",
        category: WarningCategory.Remind,
        template: "uw-wrongsummary",
        type: WarningType.SingleIssue,
    },
    "3rr": {
        name: "Potential three-revert rule violation",
        category: WarningCategory.Policy,
        template: "uw-3rr",
        type: WarningType.PolicyViolation,
    },
    "affiliate": {
        name: "Affiliate marketing",
        category: WarningCategory.Policy,
        template: "uw-affiliate",
        type: WarningType.PolicyViolation,
    },
    "agfsock": {
        name: "Use of multiple accounts (assuming good faith)",
        category: WarningCategory.Policy,
        template: "uw-agf-sock",
        type: WarningType.PolicyViolation,
    },
    "attack": {
        name: "Creating attack pages",
        category: WarningCategory.Policy,
        template: "uw-attack",
        type: WarningType.PolicyViolation,
    },
    "botun": {
        name: "Bot username",
        category: WarningCategory.Policy,
        template: "uw-botun",
        type: WarningType.PolicyViolation,
        note:
            "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins.",
    },
    "canvass": {
        name: "Canvassing",
        category: WarningCategory.Policy,
        template: "uw-canvass",
        type: WarningType.PolicyViolation,
    },
    "copyright": {
        name: "Copyright violation",
        category: WarningCategory.Policy,
        template: "uw-copyright",
        type: WarningType.PolicyViolation,
    },
    "copyrightlink": {
        name: "Linking to copyrighted works violation",
        category: WarningCategory.Policy,
        template: "uw-copyright-link",
        type: WarningType.PolicyViolation,
    },
    "copyrightnew": {
        name: "Copyright violation (with explanation for new users)",
        category: WarningCategory.Policy,
        template: "uw-copyright-new",
        type: WarningType.PolicyViolation,
    },
    "copyrightremove": {
        name: "Removing {{copyvio}} template from articles",
        category: WarningCategory.Policy,
        template: "uw-copyright-remove",
        type: WarningType.PolicyViolation,
    },
    "efsummary": {
        name: "Edit comment triggering the edit filter",
        category: WarningCategory.Policy,
        template: "uw-efsummary",
        type: WarningType.PolicyViolation,
    },
    "ew": {
        name: "Edit warring (stronger wording)",
        category: WarningCategory.Policy,
        template: "uw-ew",
        type: WarningType.PolicyViolation,
    },
    "ewsoft": {
        name: "Edit warring (softer wording for newcomers)",
        category: WarningCategory.Policy,
        template: "uw-ewsoft",
        type: WarningType.PolicyViolation,
    },
    "hijacking": {
        name: "Hijacking articles",
        category: WarningCategory.Policy,
        template: "uw-hijacking",
        type: WarningType.PolicyViolation,
    },
    "hoax": {
        name: "Creating hoaxes",
        category: WarningCategory.Policy,
        template: "uw-hoax",
        type: WarningType.PolicyViolation,
    },
    "legal": {
        name: "Making legal threats",
        category: WarningCategory.Policy,
        template: "uw-legal",
        type: WarningType.PolicyViolation,
    },
    "login": {
        name: "Editing while logged out",
        category: WarningCategory.Policy,
        template: "uw-login",
        type: WarningType.PolicyViolation,
    },
    "multipleIPs": {
        name: "Usage of multiple IPs",
        category: WarningCategory.Policy,
        template: "uw-multipleIPs",
        type: WarningType.PolicyViolation,
    },
    "pinfo": {
        name: "Personal info",
        category: WarningCategory.Policy,
        template: "uw-pinfo",
        type: WarningType.PolicyViolation,
    },
    "salt": {
        name: "Recreating salted articles under a different title",
        category: WarningCategory.Policy,
        template: "uw-salt",
        type: WarningType.PolicyViolation,
    },
    "socksuspect": {
        name: "Sockpuppetry",
        category: WarningCategory.Policy,
        template: "uw-socksuspect",
        type: WarningType.PolicyViolation,
    },
    "upv": {
        name: "Userpage vandalism",
        category: WarningCategory.Policy,
        template: "uw-upv",
        type: WarningType.PolicyViolation,
    },
    "username": {
        name: "Username is against policy",
        category: WarningCategory.Policy,
        template: "uw-username",
        type: WarningType.PolicyViolation,
        note:
            "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins.",
    },
    "coiusername": {
        name: "Username is against policy, and conflict of interest",
        category: WarningCategory.Policy,
        template: "uw-coi-username",
        type: WarningType.PolicyViolation,
        note:
            "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins.",
    },
    "userpage": {
        name: "Userpage or subpage is against policy",
        category: WarningCategory.Policy,
        template: "uw-userpage",
        type: WarningType.PolicyViolation,
        note:
            "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins.",
    },
};

export const WarningsByCategory: Record<
    WarningCategory,
    typeof Warnings
> = Object.entries(Warnings).reduce((categories, [id, warning]) => {
    if (!categories[warning.category]) categories[warning.category] = {};

    categories[warning.category][id] = warning;
    return categories;
}, <Record<WarningCategory, typeof Warnings>>{});

export type Warnings = Readonly<typeof Warnings>;
export type WarningsByCategory = Readonly<typeof WarningsByCategory>;
