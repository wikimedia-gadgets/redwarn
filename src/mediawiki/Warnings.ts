import { WarningLevel } from "rww/mediawiki";

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

export interface Warning {
    name: string;
    category: WarningCategory;
    template: string;
    levels: WarningLevel[];
    note?: string;
    keywords?: string[];
}

export const Warnings: Record<string, Warning> = {
    vandalism: {
        name: "Vandalism",
        category: WarningCategory.Common,
        template: "uw-vandalism",
        levels: [1, 2, 3, 4, 5],
    },
    disruptive: {
        name: "Disruptive editing",
        category: WarningCategory.Common,
        template: "uw-disruptive",
        levels: [1, 2, 3, 4],
    },
    test: {
        name: "Editing tests",
        category: WarningCategory.Common,
        template: "uw-test",
        levels: [1, 2, 3],
    },
    delete: {
        name: "Removal of content, blanking",
        category: WarningCategory.Common,
        template: "uw-delete",
        levels: [1, 2, 3, 4, 5],
    },
    generic: {
        name: "Generic warning (for template series missing level 4)",
        category: WarningCategory.Common,
        template: "uw-generic",
        levels: [4],
    },
    biog: {
        name: "Adding unreferenced information about living persons",
        category: WarningCategory.Article,
        template: "uw-biog",
        levels: [1, 2, 3, 4, 5],
    },
    error: {
        name: "Introducing deliberate factual errors",
        category: WarningCategory.Article,
        template: "uw-error",
        levels: [1, 2, 3, 4],
    },
    genre: {
        name:
            "Frequent or mass changes to genres without consensus or reference",
        category: WarningCategory.Article,
        template: "uw-genre",
        levels: [1, 2, 3, 4],
    },
    image: {
        name: "Image-related vandalism",
        category: WarningCategory.Article,
        template: "uw-image",
        levels: [1, 2, 3, 4, 5],
    },
    joke: {
        name: "Using improper humor",
        category: WarningCategory.Article,
        template: "uw-joke",
        levels: [1, 2, 3, 4, 5],
    },
    nor: {
        name:
            "Adding original research, including unpublished syntheses of sources",
        category: WarningCategory.Article,
        template: "uw-nor",
        levels: [1, 2, 3, 4],
    },
    notcensored: {
        name: "Censorship of material",
        category: WarningCategory.Article,
        template: "uw-notcensored",
        levels: [1, 2, 3],
    },
    own: {
        name: "Ownership of articles",
        category: WarningCategory.Article,
        template: "uw-own",
        levels: [1, 2, 3, 4, 5],
    },
    tdel: {
        name: "Removal of maintenance templates",
        category: WarningCategory.Article,
        template: "uw-tdel",
        levels: [1, 2, 3, 4],
    },
    unsourced: {
        name: "Addition of unsourced or improperly cited material",
        category: WarningCategory.Article,
        template: "uw-unsourced",
        levels: [1, 2, 3, 4],
    },
    advert: {
        name: "Using Wikipedia for advertising or promotion",
        category: WarningCategory.Spam,
        template: "uw-advert",
        levels: [1, 2, 3, 4, 5],
    },
    npov: {
        name: "Not adhering to neutral point of view",
        category: WarningCategory.Spam,
        template: "uw-npov",
        levels: [1, 2, 3, 4],
    },
    paid: {
        name:
            "Paid editing without disclosure under the Wikimedia Terms of Use",
        category: WarningCategory.Spam,
        template: "uw-paid",
        levels: [1, 2, 3, 4],
    },
    spam: {
        name: "Adding spam links",
        category: WarningCategory.Spam,
        template: "uw-spam",
        levels: [1, 2, 3, 4, 5],
    },
    agf: {
        name: "Not assuming good faith",
        category: WarningCategory.Editors,
        template: "uw-agf",
        levels: [1, 2, 3],
    },
    harass: {
        name: "Harassment of other users",
        category: WarningCategory.Editors,
        template: "uw-harass",
        levels: [1, 2, 3, 4, 5],
    },
    npa: {
        name: "Personal attack directed at a specific editor",
        category: WarningCategory.Editors,
        template: "uw-npa",
        levels: [1, 2, 3, 4, 5],
    },
    tempabuse: {
        name: "Improper use of warning or blocking template",
        category: WarningCategory.Editors,
        template: "uw-tempabuse",
        levels: [1, 2],
    },
    afd: {
        name: "Removing {{afd}} templates",
        category: WarningCategory.Remove,
        template: "uw-afd",
        levels: [1, 2, 3, 4],
    },
    blpprod: {
        name: "Removing {{blp prod}} templates",
        category: WarningCategory.Remove,
        template: "uw-blpprod",
        levels: [1, 2, 3, 4],
    },
    idt: {
        name: "Removing file deletion tags",
        category: WarningCategory.Remove,
        template: "uw-idt",
        levels: [1, 2, 3, 4],
    },
    speedy: {
        name: "Removing speedy deletion tags",
        category: WarningCategory.Remove,
        template: "uw-speedy",
        levels: [1, 2, 3, 4],
    },
    attempt: {
        name: "Triggering the edit filter",
        category: WarningCategory.Other,
        template: "uw-attempt",
        levels: [1, 2, 3, 4],
    },
    chat: {
        name: "Using talk page as forum",
        category: WarningCategory.Other,
        template: "uw-chat",
        levels: [1, 2, 3, 4],
    },
    create: {
        name: "Creating inappropriate pages",
        category: WarningCategory.Other,
        template: "uw-create",
        levels: [1, 2, 3, 4, 5],
    },
    mos: {
        name: "Manual of style",
        category: WarningCategory.Other,
        template: "uw-mos",
        levels: [1, 2, 3, 4],
    },
    move: {
        name: "Page moves against naming conventions or consensus",
        category: WarningCategory.Other,
        template: "uw-move",
        levels: [1, 2, 3, 4, 5],
    },
    tpv: {
        name: "Refactoring others' talk page comments",
        category: WarningCategory.Other,
        template: "uw-tpv",
        levels: [1, 2, 3, 4, 5],
    },
    upload: {
        name: "Uploading unencyclopedic images",
        category: WarningCategory.Other,
        template: "uw-upload",
        levels: [1, 2, 3, 4, 5],
    },
    aiv: {
        name: "Bad AIV report",
        category: WarningCategory.Remind,
        template: "uw-aiv",
        levels: [0],
    },
    autobiography: {
        name: "Creating autobiographies",
        category: WarningCategory.Remind,
        template: "uw-autobiography",
        levels: [0],
    },
    badcat: {
        name: "Adding incorrect categories",
        category: WarningCategory.Remind,
        template: "uw-badcat",
        levels: [0],
    },
    badlistentry: {
        name: "Adding inappropriate entries to lists",
        category: WarningCategory.Remind,
        template: "uw-badlistentry",
        levels: [0],
    },
    bite: {
        name: "Being harsh to newcomers",
        category: WarningCategory.Remind,
        template: "uw-bite",
        levels: [0],
    },
    coi: {
        name: "Conflict of interest",
        category: WarningCategory.Remind,
        template: "uw-coi",
        levels: [0],
    },
    controversial: {
        name: "Introducing controversial material",
        category: WarningCategory.Remind,
        template: "uw-controversial",
        levels: [0],
    },
    copying: {
        name: "Copying text to another page",
        category: WarningCategory.Remind,
        template: "uw-copying",
        levels: [0],
    },
    crystal: {
        name: "Adding speculative or unconfirmed information",
        category: WarningCategory.Remind,
        template: "uw-crystal",
        levels: [0],
    },
    cpmove: {
        name: "Cut and paste moves",
        category: WarningCategory.Remind,
        template: "uw-c&pmove",
        levels: [0],
    },
    dab: {
        name: "Incorrect edit to a disambiguation page",
        category: WarningCategory.Remind,
        template: "uw-dab",
        levels: [0],
    },
    date: {
        name: "Unnecessarily changing date formats",
        category: WarningCategory.Remind,
        template: "uw-date",
        levels: [0],
    },
    deadlink: {
        name: "Removing proper sources containing dead links",
        category: WarningCategory.Remind,
        template: "uw-deadlink",
        levels: [0],
    },
    draftfirst: {
        name: "User should draft in draftspace or userspace",
        category: WarningCategory.Remind,
        template: "uw-draftfirst",
        levels: [0],
    },
    editsummary: {
        name: "Not using edit comment",
        category: WarningCategory.Remind,
        template: "uw-editsummary",
        levels: [0],
    },
    elinbody: {
        name: "Adding external links to the body of an article",
        category: WarningCategory.Remind,
        template: "uw-elinbody",
        levels: [0],
    },
    english: {
        name: "Not communicating in English",
        category: WarningCategory.Remind,
        template: "uw-english",
        levels: [0],
    },
    hasty: {
        name: "Hasty addition of speedy deletion tags",
        category: WarningCategory.Remind,
        template: "uw-hasty",
        levels: [0],
    },
    italicize: {
        name:
            "Italicize books, films, albums, magazines, TV series, etc within articles",
        category: WarningCategory.Remind,
        template: "uw-italicize",
        levels: [0],
    },
    lang: {
        name: "Unnecessarily changing between British and American English",
        category: WarningCategory.Remind,
        template: "uw-lang",
        levels: [0],
    },
    linking: {
        name: "Excessive addition of redlinks or repeated blue links",
        category: WarningCategory.Remind,
        template: "uw-linking",
        levels: [0],
    },
    minor: {
        name: "Incorrect use of minor edits check box",
        category: WarningCategory.Remind,
        template: "uw-minor",
        levels: [0],
    },
    notenglish: {
        name: "Creating non-English articles",
        category: WarningCategory.Remind,
        template: "uw-notenglish",
        levels: [0],
    },
    notvote: {
        name: "We use consensus, not voting",
        category: WarningCategory.Remind,
        template: "uw-notvote",
        levels: [0],
    },
    plagiarism: {
        name: "Copying from public domain sources without attribution",
        category: WarningCategory.Remind,
        template: "uw-plagiarism",
        levels: [0],
    },
    preview: {
        name: "Use preview button to avoid mistakes",
        category: WarningCategory.Remind,
        template: "uw-preview",
        levels: [0],
    },
    redlink: {
        name: "Indiscriminate removal of redlinks",
        category: WarningCategory.Remind,
        template: "uw-redlink",
        levels: [0],
    },
    selfrevert: {
        name: "Reverting self tests",
        category: WarningCategory.Remind,
        template: "uw-selfrevert",
        levels: [0],
    },
    socialnetwork: {
        name: "Wikipedia is not a social network",
        category: WarningCategory.Remind,
        template: "uw-socialnetwork",
        levels: [0],
    },
    sofixit: {
        name: "Be bold and fix things yourself",
        category: WarningCategory.Remind,
        template: "uw-sofixit",
        levels: [0],
    },
    spoiler: {
        name:
            "Adding spoiler alerts or removing spoilers from appropriate sections",
        category: WarningCategory.Remind,
        template: "uw-spoiler",
        levels: [0],
    },
    talkinarticle: {
        name: "Talk in article",
        category: WarningCategory.Remind,
        template: "uw-talkinarticle",
        levels: [0],
    },
    tilde: {
        name: "Not signing posts",
        category: WarningCategory.Remind,
        template: "uw-tilde",
        levels: [0],
    },
    toppost: {
        name: "Posting at the top of talk pages",
        category: WarningCategory.Remind,
        template: "uw-toppost",
        levels: [0],
    },
    userspaceDraftFinish: {
        name: "Stale userspace draft",
        category: WarningCategory.Remind,
        template: "uw-userspace draft finish",
        levels: [0],
    },
    vgscope: {
        name: "Adding video game walkthroughs, cheats or instructions",
        category: WarningCategory.Remind,
        template: "uw-vgscope",
        levels: [0],
    },
    warn: {
        name: "Place user warning templates when reverting vandalism",
        category: WarningCategory.Remind,
        template: "uw-warn",
        levels: [0],
    },
    wrongsummary: {
        name: "Using inaccurate or inappropriate edit summaries",
        category: WarningCategory.Remind,
        template: "uw-wrongsummary",
        levels: [0],
    },
    _3rr: {
        name: "Potential three-revert rule violation; see also uw-ew",
        category: WarningCategory.Policy,
        template: "uw-3rr",
        levels: [6],
    },
    affiliate: {
        name: "Affiliate marketing",
        category: WarningCategory.Policy,
        template: "uw-affiliate",
        levels: [6],
    },
    agfsock: {
        name: "Use of multiple accounts (assuming good faith)",
        category: WarningCategory.Policy,
        template: "uw-agf-sock",
        levels: [6],
    },
    attack: {
        name: "Creating attack pages",
        category: WarningCategory.Policy,
        template: "uw-attack",
        levels: [6],
    },
    botun: {
        name: "Bot username",
        category: WarningCategory.Policy,
        template: "uw-botun",
        levels: [6],
        note:
            "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins.",
    },
    canvass: {
        name: "Canvassing",
        category: WarningCategory.Policy,
        template: "uw-canvass",
        levels: [6],
    },
    copyright: {
        name: "Copyright violation",
        category: WarningCategory.Policy,
        template: "uw-copyright",
        levels: [6],
    },
    copyrightlink: {
        name: "Linking to copyrighted works violation",
        category: WarningCategory.Policy,
        template: "uw-copyright-link",
        levels: [6],
    },
    copyrightnew: {
        name: "Copyright violation (with explanation for new users)",
        category: WarningCategory.Policy,
        template: "uw-copyright-new",
        levels: [6],
    },
    copyrightremove: {
        name: "Removing {{copyvio}} template from articles",
        category: WarningCategory.Policy,
        template: "uw-copyright-remove",
        levels: [6],
    },
    efsummary: {
        name: "Edit comment triggering the edit filter",
        category: WarningCategory.Policy,
        template: "uw-efsummary",
        levels: [6],
    },
    ew: {
        name: "Edit warring (stronger wording)",
        category: WarningCategory.Policy,
        template: "uw-ew",
        levels: [6],
    },
    ewsoft: {
        name: "Edit warring (softer wording for newcomers)",
        category: WarningCategory.Policy,
        template: "uw-ewsoft",
        levels: [6],
    },
    hijacking: {
        name: "Hijacking articles",
        category: WarningCategory.Policy,
        template: "uw-hijacking",
        levels: [6],
    },
    hoax: {
        name: "Creating hoaxes",
        category: WarningCategory.Policy,
        template: "uw-hoax",
        levels: [6],
    },
    legal: {
        name: "Making legal threats",
        category: WarningCategory.Policy,
        template: "uw-legal",
        levels: [6],
    },
    login: {
        name: "Editing while logged out",
        category: WarningCategory.Policy,
        template: "uw-login",
        levels: [6],
    },
    multipleIPs: {
        name: "Usage of multiple IPs",
        category: WarningCategory.Policy,
        template: "uw-multipleIPs",
        levels: [6],
    },
    pinfo: {
        name: "Personal info",
        category: WarningCategory.Policy,
        template: "uw-pinfo",
        levels: [6],
    },
    salt: {
        name: "Recreating salted articles under a different title",
        category: WarningCategory.Policy,
        template: "uw-salt",
        levels: [6],
    },
    socksuspect: {
        name: "Sockpuppetry",
        category: WarningCategory.Policy,
        template: "uw-socksuspect",
        levels: [6],
    },
    upv: {
        name: "Userpage vandalism",
        category: WarningCategory.Policy,
        template: "uw-upv",
        levels: [6],
    },
    username: {
        name: "Username is against policy",
        category: WarningCategory.Policy,
        template: "uw-username",
        levels: [6],
        note:
            "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins.",
    },
    coiusername: {
        name: "Username is against policy, and conflict of interest",
        category: WarningCategory.Policy,
        template: "uw-coi-username",
        levels: [6],
        note:
            "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins.",
    },
    userpage: {
        name: "Userpage or subpage is against policy",
        category: WarningCategory.Policy,
        template: "uw-userpage",
        levels: [6],
        note:
            "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins.",
    },
};
export type Warnings = Readonly<typeof Warnings>;
