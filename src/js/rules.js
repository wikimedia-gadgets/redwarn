// Data originally processed from Twinkle Source at https://github.com/azatoth/twinkle
rw.rules = {
    vandalism: {
        "name": "Vandalism",
        "category": "Common warnings",
        "template": "uw-vandalism",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    disruptive: { // note: currently on WP:TFD for merge with vandal
        "name": "Disruptive editing",
        "category": "Common warnings",
        "template": "uw-disruptive",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    test: {
        "name": "Editing tests",
        "category": "Common warnings",
        "template": "uw-test",
        "warningLevels": [
            1,
            2,
            3
        ]
    },
    delete: {
        "name": "Removal of content, blanking",
        "category": "Common warnings",
        "template": "uw-delete",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    generic: {
        "name": "Generic warning (for template series missing level 4)",
        "category": "Common warnings",
        "template": "uw-generic",
        "warningLevels": [
            4
        ]
    },
    biog: {
        "name": "Adding unreferenced information about living persons",
        "category": "Article Conduct Warnings",
        "template": "uw-biog",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    defamatory: {
        "name": "Addition of defamatory content",
        "category": "Article Conduct Warnings",
        "template": "uw-defamatory",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    error: {
        "name": "Introducing deliberate factual errors",
        "category": "Article Conduct Warnings",
        "template": "uw-error",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    genre: {
        "name": "Frequent or mass changes to genres without consensus or reference",
        "category": "Article Conduct Warnings",
        "template": "uw-genre",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    image: {
        "name": "Image-related vandalism",
        "category": "Article Conduct Warnings",
        "template": "uw-image",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    joke: {
        "name": "Using improper humor",
        "category": "Article Conduct Warnings",
        "template": "uw-joke",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    nor: {
        "name": "Adding original research, including unpublished syntheses of sources",
        "category": "Article Conduct Warnings",
        "template": "uw-nor",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    notcensored: {
        "name": "Censorship of material",
        "category": "Article Conduct Warnings",
        "template": "uw-notcensored",
        "warningLevels": [
            1,
            2,
            3
        ]
    },
    own: {
        "name": "Ownership of articles",
        "category": "Article Conduct Warnings",
        "template": "uw-own",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    tdel: {
        "name": "Removal of maintenance templates",
        "category": "Article Conduct Warnings",
        "template": "uw-tdel",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    unsourced: {
        "name": "Addition of unsourced or improperly cited material",
        "category": "Article Conduct Warnings",
        "template": "uw-unsourced",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    redirect: {
        "name": "Creating inappropriate redirects",
        "category": "Article Conduct Warnings",
        "template": "uw-redirect",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    advert: {
        "name": "Using Wikipedia for advertising or promotion",
        "category": "Promotions and spam",
        "template": "uw-advert",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    npov: {
        "name": "Not adhering to neutral point of view",
        "category": "Promotions and spam",
        "template": "uw-npov",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    paid: {
        "name": "Paid editing without disclosure under the Wikimedia Terms of Use",
        "category": "Promotions and spam",
        "template": "uw-paid",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    spam: {
        "name": "Adding spam links",
        "category": "Promotions and spam",
        "template": "uw-spam",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    agf: {
        "name": "Not assuming good faith",
        "category": "Behavior towards other editors",
        "template": "uw-agf",
        "warningLevels": [
            1,
            2,
            3
        ]
    },
    harass: {
        "name": "Harassment of other users",
        "category": "Behavior towards other editors",
        "template": "uw-harass",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    npa: {
        "name": "Personal attack directed at a specific editor",
        "category": "Behavior towards other editors",
        "template": "uw-npa",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    tempabuse: {
        "name": "Improper use of warning or blocking template",
        "category": "Behavior towards other editors",
        "template": "uw-tempabuse",
        "warningLevels": [
            1,
            2
        ]
    },
    afd: {
        "name": "Removing {{afd}} templates",
        "category": "Removal of deletion tags",
        "template": "uw-afd",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    blpprod: {
        "name": "Removing {{blp prod}} templates",
        "category": "Removal of deletion tags",
        "template": "uw-blpprod",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    idt: {
        "name": "Removing file deletion tags",
        "category": "Removal of deletion tags",
        "template": "uw-idt",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    speedy: {
        "name": "Removing speedy deletion tags",
        "category": "Removal of deletion tags",
        "template": "uw-speedy",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    attempt: {
        "name": "Triggering the edit filter",
        "category": "Other",
        "template": "uw-attempt",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    chat: {
        "name": "Using talk page as forum",
        "category": "Other",
        "template": "uw-chat",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    create: {
        "name": "Creating inappropriate pages",
        "category": "Other",
        "template": "uw-create",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    mos: {
        "name": "Manual of style",
        "category": "Other",
        "template": "uw-mos",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    move: {
        "name": "Page moves against naming conventions or consensus",
        "category": "Other",
        "template": "uw-move",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    tpv: {
        "name": "Refactoring others' talk page comments",
        "category": "Other",
        "template": "uw-tpv",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    upload: {
        "name": "Uploading unencyclopedic images",
        "category": "Other",
        "template": "uw-upload",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    aiv: {
        "name": "Bad AIV report",
        "category": "Reminders",
        "template": "uw-aiv",
        "warningLevels": [
            0
        ]
    },
    autobiography: {
        "name": "Creating autobiographies",
        "category": "Reminders",
        "template": "uw-autobiography",
        "warningLevels": [
            0
        ]
    },
    badcat: {
        "name": "Adding incorrect categories",
        "category": "Reminders",
        "template": "uw-badcat",
        "warningLevels": [
            0
        ]
    },
    badlistentry: {
        "name": "Adding non-notable entries to lists",
        "category": "Reminders",
        "template": "uw-badlistentry",
        "warningLevels": [
            0
        ]
    },
    bite: {
        "name": "Being harsh to newcomers",
        "category": "Reminders",
        "template": "uw-bite",
        "warningLevels": [
            0
        ]
    },
    coi: {
        "name": "Conflict of interest",
        "category": "Reminders",
        "template": "uw-coi",
        "warningLevels": [
            0
        ]
    },
    controversial: {
        "name": "Introducing controversial material",
        "category": "Reminders",
        "template": "uw-controversial",
        "warningLevels": [
            0
        ]
    },
    copying: {
        "name": "Copying text to another page",
        "category": "Reminders",
        "template": "uw-copying",
        "warningLevels": [
            0
        ]
    },
    crystal: {
        "name": "Adding speculative or unconfirmed information",
        "category": "Reminders",
        "template": "uw-crystal",
        "warningLevels": [
            0
        ]
    },
    cpmove: {
        "name": "Cut and paste moves",
        "category": "Reminders",
        "template": "uw-c&pmove",
        "warningLevels": [
            0
        ]
    },
    dab: {
        "name": "Incorrect edit to a disambiguation page",
        "category": "Reminders",
        "template": "uw-dab",
        "warningLevels": [
            0
        ]
    },
    date: {
        "name": "Unnecessarily changing date formats",
        "category": "Reminders",
        "template": "uw-date",
        "warningLevels": [
            0
        ]
    },
    deadlink: {
        "name": "Removing proper sources containing dead links",
        "category": "Reminders",
        "template": "uw-deadlink",
        "warningLevels": [
            0
        ]
    },
    draftfirst: {
        "name": "User should draft in draftspace or userspace",
        "category": "Reminders",
        "template": "uw-draftfirst",
        "warningLevels": [
            0
        ]
    },
    editsummary: {
        "name": "Not using edit summary",
        "category": "Reminders",
        "template": "uw-editsummary",
        "warningLevels": [
            0
        ]
    },
    elinbody: {
        "name": "Adding external links to the body of an article",
        "category": "Reminders",
        "template": "uw-elinbody",
        "warningLevels": [
            0
        ]
    },
    english: {
        "name": "Not communicating in English",
        "category": "Reminders",
        "template": "uw-english",
        "warningLevels": [
            0
        ]
    },
    hasty: {
        "name": "Hasty addition of speedy deletion tags",
        "category": "Reminders",
        "template": "uw-hasty",
        "warningLevels": [
            0
        ]
    },
    italicize: {
        "name": "Italicize books, films, albums, magazines, TV series, etc. within articles",
        "category": "Reminders",
        "template": "uw-italicize",
        "warningLevels": [
            0
        ]
    },
    lang: {
        "name": "Unnecessarily changing between different varieties of English",
        "category": "Reminders",
        "template": "uw-lang",
        "warningLevels": [
            0
        ]
    },
    linking: {
        "name": "Excessive addition of redlinks or repeated blue links",
        "category": "Reminders",
        "template": "uw-linking",
        "warningLevels": [
            0
        ]
    },
    minor: {
        "name": "Incorrect use of minor edits check box",
        "category": "Reminders",
        "template": "uw-minor",
        "warningLevels": [
            0
        ]
    },
    notenglish: {
        "name": "Creating non-English articles",
        "category": "Reminders",
        "template": "uw-notenglish",
        "warningLevels": [
            0
        ]
    },
    notvote: {
        "name": "We use consensus, not voting",
        "category": "Reminders",
        "template": "uw-notvote",
        "warningLevels": [
            0
        ]
    },
    plagiarism: {
        "name": "Copying from public domain sources without attribution",
        "category": "Reminders",
        "template": "uw-plagiarism",
        "warningLevels": [
            0
        ]
    },
    preview: {
        "name": "Use preview button to avoid mistakes",
        "category": "Reminders",
        "template": "uw-preview",
        "warningLevels": [
            0
        ]
    },
    redlink: {
        "name": "Indiscriminate removal of redlinks",
        "category": "Reminders",
        "template": "uw-redlink",
        "warningLevels": [
            0
        ]
    },
    selfrevert: {
        "name": "Reverting self tests",
        "category": "Reminders",
        "template": "uw-selfrevert",
        "warningLevels": [
            0
        ]
    },
    socialnetwork: {
        "name": "Wikipedia is not a social network",
        "category": "Reminders",
        "template": "uw-socialnetwork",
        "warningLevels": [
            0
        ]
    },
    sofixit: {
        "name": "Be bold and fix things yourself",
        "category": "Reminders",
        "template": "uw-sofixit",
        "warningLevels": [
            0
        ]
    },
    spoiler: {
        "name": "Adding spoiler alerts or removing spoilers from appropriate sections",
        "category": "Reminders",
        "template": "uw-spoiler",
        "warningLevels": [
            0
        ]
    },
    talkinarticle: {
        "name": "Talk in article",
        "category": "Reminders",
        "template": "uw-talkinarticle",
        "warningLevels": [
            0
        ]
    },
    tilde: {
        "name": "Not signing posts",
        "category": "Reminders",
        "template": "uw-tilde",
        "warningLevels": [
            0
        ]
    },
    toppost: {
        "name": "Posting at the top of talk pages",
        "category": "Reminders",
        "template": "uw-toppost",
        "warningLevels": [
            0
        ]
    },
    userspaceDraftFinish: {
        "name": "Stale userspace draft",
        "category": "Reminders",
        "template": "uw-userspace draft finish",
        "warningLevels": [
            0
        ]
    },
    vgscope: {
        "name": "Adding video game walkthroughs, cheats or instructions",
        "category": "Reminders",
        "template": "uw-vgscope",
        "warningLevels": [
            0
        ]
    },
    warn: {
        "name": "Place user warning templates when reverting vandalism",
        "category": "Reminders",
        "template": "uw-warn",
        "warningLevels": [
            0
        ]
    },
    wrongsummary: {
        "name": "Using inaccurate or inappropriate edit summaries",
        "category": "Reminders",
        "template": "uw-wrongsummary",
        "warningLevels": [
            0
        ]
    },
    _3rr: { // need underscore since javascript can't start with number
        "name": "Potential three-revert rule violation; see also uw-ew",
        "category": "Policy Violation Warnings",
        "template": "uw-3rr",
        "warningLevels": [
            6
        ]
    },
    affiliate: {
        "name": "Affiliate marketing",
        "category": "Policy Violation Warnings",
        "template": "uw-affiliate",
        "warningLevels": [
            6
        ]
    },
    agfSock: {
        "name": "Use of multiple accounts (assuming good faith)",
        "category": "Policy Violation Warnings",
        "template": "uw-agf-sock",
        "warningLevels": [
            6
        ]
    },
    attack: {
        "name": "Creating attack pages",
        "category": "Policy Violation Warnings",
        "template": "uw-attack",
        "warningLevels": [
            6
        ]
    },
    botun: {
        "name": "Bot username",
        "category": "Policy Violation Warnings",
        "template": "uw-botun",
        "warningLevels": [
            6
        ],
        "note": "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
    },
    canvass: {
        "name": "Canvassing",
        "category": "Policy Violation Warnings",
        "template": "uw-canvass",
        "warningLevels": [
            6
        ]
    },
    copyright: {
        "name": "Copyright violation",
        "category": "Policy Violation Warnings",
        "template": "uw-copyright",
        "warningLevels": [
            6
        ]
    },
    copyrightLink: {
        "name": "Linking to copyrighted works violation",
        "category": "Policy Violation Warnings",
        "template": "uw-copyright-link",
        "warningLevels": [
            6
        ]
    },
    copyrightNew: {
        "name": "Copyright violation (with explanation for new users)",
        "category": "Policy Violation Warnings",
        "template": "uw-copyright-new",
        "warningLevels": [
            6
        ]
    },
    copyrightRemove: {
        "name": "Removing {{copyvio}} template from articles",
        "category": "Policy Violation Warnings",
        "template": "uw-copyright-remove",
        "warningLevels": [
            6
        ]
    },
    efsummary: {
        "name": "Edit summary triggering the edit filter",
        "category": "Policy Violation Warnings",
        "template": "uw-efsummary",
        "warningLevels": [
            6
        ]
    },
    ew: {
        "name": "Edit warring (stronger wording)",
        "category": "Policy Violation Warnings",
        "template": "uw-ew",
        "warningLevels": [
            6
        ]
    },
    ewsoft: {
        "name": "Edit warring (softer wording for newcomers)",
        "category": "Policy Violation Warnings",
        "template": "uw-ewsoft",
        "warningLevels": [
            6
        ]
    },
    hijacking: {
        "name": "Hijacking articles",
        "category": "Policy Violation Warnings",
        "template": "uw-hijacking",
        "warningLevels": [
            6
        ]
    },
    hoax: {
        "name": "Creating hoaxes",
        "category": "Policy Violation Warnings",
        "template": "uw-hoax",
        "warningLevels": [
            6
        ]
    },
    legal: {
        "name": "Making legal threats",
        "category": "Policy Violation Warnings",
        "template": "uw-legal",
        "warningLevels": [
            6
        ]
    },
    login: {
        "name": "Editing while logged out",
        "category": "Policy Violation Warnings",
        "template": "uw-login",
        "warningLevels": [
            6
        ]
    },
    multipleIPs: {
        "name": "Usage of multiple IPs",
        "category": "Policy Violation Warnings",
        "template": "uw-multipleIPs",
        "warningLevels": [
            6
        ]
    },
    pinfo: {
        "name": "Personal info",
        "category": "Policy Violation Warnings",
        "template": "uw-pinfo",
        "warningLevels": [
            6
        ]
    },
    salt: {
        "name": "Recreating salted articles under a different title",
        "category": "Policy Violation Warnings",
        "template": "uw-salt",
        "warningLevels": [
            6
        ]
    },
    socksuspect: {
        "name": "Sockpuppetry",
        "category": "Policy Violation Warnings",
        "template": "uw-socksuspect",
        "warningLevels": [
            6
        ]
    },
    upv: {
        "name": "Userpage vandalism",
        "category": "Policy Violation Warnings",
        "template": "uw-upv",
        "warningLevels": [
            6
        ]
    },
    username: {
        "name": "Username is against policy",
        "category": "Policy Violation Warnings",
        "template": "uw-username",
        "warningLevels": [
            6
        ],
        "note": "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
    },
    coiUsername: {
        "name": "Username is against policy, and conflict of interest",
        "category": "Policy Violation Warnings",
        "template": "uw-coi-username",
        "warningLevels": [
            6
        ],
        "note": "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
    },
    userpage: {
        "name": "Userpage or subpage is against policy",
        "category": "Policy Violation Warnings",
        "template": "uw-userpage",
        "warningLevels": [
            6
        ],
        "note": "Username notices should not be added for blatant violations. In these cases, click the gavel to report the username to the admins."
    }
};
