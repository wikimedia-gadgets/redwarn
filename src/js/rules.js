// Data processed from Twinkle Source at https://github.com/azatoth/twinkle
var rules = [
    {
        "name": "Vandalism",
        "catagory": "Common warnings",
        "template": "uw-vandalism",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Disruptive editing",
        "catagory": "Common warnings",
        "template": "uw-disruptive",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Editing tests",
        "catagory": "Common warnings",
        "template": "uw-test",
        "warningLevels": [
            1,
            2,
            3
        ]
    },
    {
        "name": "Removal of content, blanking",
        "catagory": "Common warnings",
        "template": "uw-delete",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Generic warning (for template series missing level 4)",
        "catagory": "Common warnings",
        "template": "uw-generic",
        "warningLevels": [
            4
        ]
    },
    {
        "name": "Adding unreferenced defamatory information about living persons",
        "catagory": "Article Conduct Warnings",
        "template": "uw-biog",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Addition of defamatory content",
        "catagory": "Article Conduct Warnings",
        "template": "uw-defamatory",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Introducing deliberate factual errors",
        "catagory": "Article Conduct Warnings",
        "template": "uw-error",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Frequent or mass changes to genres without consensus or reference",
        "catagory": "Article Conduct Warnings",
        "template": "uw-genre",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Image-related vandalism",
        "catagory": "Article Conduct Warnings",
        "template": "uw-image",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Using improper humor",
        "catagory": "Article Conduct Warnings",
        "template": "uw-joke",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Adding original research, including unpublished syntheses of sources",
        "catagory": "Article Conduct Warnings",
        "template": "uw-nor",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Censorship of material",
        "catagory": "Article Conduct Warnings",
        "template": "uw-notcensored",
        "warningLevels": [
            1,
            2,
            3
        ]
    },
    {
        "name": "Ownership of articles",
        "catagory": "Article Conduct Warnings",
        "template": "uw-own",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Removal of maintenance templates",
        "catagory": "Article Conduct Warnings",
        "template": "uw-tdel",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Addition of unsourced or improperly cited material",
        "catagory": "Article Conduct Warnings",
        "template": "uw-unsourced",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Using Wikipedia for advertising or promotion",
        "catagory": "Promotions and spam",
        "template": "uw-advert",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Not adhering to neutral point of view",
        "catagory": "Promotions and spam",
        "template": "uw-npov",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Paid editing without disclosure under the Wikimedia Terms of Use",
        "catagory": "Promotions and spam",
        "template": "uw-paid",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Adding spam links",
        "catagory": "Promotions and spam",
        "template": "uw-spam",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Not assuming good faith",
        "catagory": "Behavior towards other editors",
        "template": "uw-agf",
        "warningLevels": [
            1,
            2,
            3
        ]
    },
    {
        "name": "Harassment of other users",
        "catagory": "Behavior towards other editors",
        "template": "uw-harass",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Personal attack directed at a specific editor",
        "catagory": "Behavior towards other editors",
        "template": "uw-npa",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Improper use of warning or blocking template",
        "catagory": "Behavior towards other editors",
        "template": "uw-tempabuse",
        "warningLevels": [
            1,
            2
        ]
    },
    {
        "name": "Removing {{afd}} templates",
        "catagory": "Removal of deletion tags",
        "template": "uw-afd",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Removing {{blp prod}} templates",
        "catagory": "Removal of deletion tags",
        "template": "uw-blpprod",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Removing file deletion tags",
        "catagory": "Removal of deletion tags",
        "template": "uw-idt",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Removing speedy deletion tags",
        "catagory": "Removal of deletion tags",
        "template": "uw-speedy",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Triggering the edit filter",
        "catagory": "Other",
        "template": "uw-attempt",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Using talk page as forum",
        "catagory": "Other",
        "template": "uw-chat",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Creating inappropriate pages",
        "catagory": "Other",
        "template": "uw-create",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Manual of style",
        "catagory": "Other",
        "template": "uw-mos",
        "warningLevels": [
            1,
            2,
            3,
            4
        ]
    },
    {
        "name": "Page moves against naming conventions or consensus",
        "catagory": "Other",
        "template": "uw-move",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Refactoring others' talk page comments",
        "catagory": "Other",
        "template": "uw-tpv",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Uploading unencyclopedic images",
        "catagory": "Other",
        "template": "uw-upload",
        "warningLevels": [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        "name": "Bad AIV report",
        "catagory": "Reminders",
        "template": "uw-aiv",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Creating autobiographies",
        "catagory": "Reminders",
        "template": "uw-autobiography",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding incorrect categories",
        "catagory": "Reminders",
        "template": "uw-badcat",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding inappropriate entries to lists",
        "catagory": "Reminders",
        "template": "uw-badlistentry",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Being harsh to newcomers",
        "catagory": "Reminders",
        "template": "uw-bite",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Conflict of interest",
        "catagory": "Reminders",
        "template": "uw-coi",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Introducing controversial material",
        "catagory": "Reminders",
        "template": "uw-controversial",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Copying text to another page",
        "catagory": "Reminders",
        "template": "uw-copying",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding speculative or unconfirmed information",
        "catagory": "Reminders",
        "template": "uw-crystal",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Cut and paste moves",
        "catagory": "Reminders",
        "template": "uw-c&pmove",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Incorrect edit to a disambiguation page",
        "catagory": "Reminders",
        "template": "uw-dab",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Unnecessarily changing date formats",
        "catagory": "Reminders",
        "template": "uw-date",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Removing proper sources containing dead links",
        "catagory": "Reminders",
        "template": "uw-deadlink",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "User should draft in userspace without the risk of speedy deletion",
        "catagory": "Reminders",
        "template": "uw-draftfirst",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Not using edit summary",
        "catagory": "Reminders",
        "template": "uw-editsummary",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding external links to the body of an article",
        "catagory": "Reminders",
        "template": "uw-elinbody",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Not communicating in English",
        "catagory": "Reminders",
        "template": "uw-english",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Hasty addition of speedy deletion tags",
        "catagory": "Reminders",
        "template": "uw-hasty",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Italicize books, films, albums, magazines, TV series, etc within articles",
        "catagory": "Reminders",
        "template": "uw-italicize",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Unnecessarily changing between British and American English",
        "catagory": "Reminders",
        "template": "uw-lang",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Excessive addition of redlinks or repeated blue links",
        "catagory": "Reminders",
        "template": "uw-linking",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Incorrect use of minor edits check box",
        "catagory": "Reminders",
        "template": "uw-minor",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Creating non-English articles",
        "catagory": "Reminders",
        "template": "uw-notenglish",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "We use consensus, not voting",
        "catagory": "Reminders",
        "template": "uw-notvote",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Copying from public domain sources without attribution",
        "catagory": "Reminders",
        "template": "uw-plagiarism",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Use preview button to avoid mistakes",
        "catagory": "Reminders",
        "template": "uw-preview",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Indiscriminate removal of redlinks",
        "catagory": "Reminders",
        "template": "uw-redlink",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Reverting self tests",
        "catagory": "Reminders",
        "template": "uw-selfrevert",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Wikipedia is not a social network",
        "catagory": "Reminders",
        "template": "uw-socialnetwork",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Be bold and fix things yourself",
        "catagory": "Reminders",
        "template": "uw-sofixit",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding spoiler alerts or removing spoilers from appropriate sections",
        "catagory": "Reminders",
        "template": "uw-spoiler",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Talk in article",
        "catagory": "Reminders",
        "template": "uw-talkinarticle",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Not signing posts",
        "catagory": "Reminders",
        "template": "uw-tilde",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Posting at the top of talk pages",
        "catagory": "Reminders",
        "template": "uw-toppost",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Stale userspace draft",
        "catagory": "Reminders",
        "template": "uw-userspace draft finish",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Adding video game walkthroughs, cheats or instructions",
        "catagory": "Reminders",
        "template": "uw-vgscope",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Place user warning templates when reverting vandalism",
        "catagory": "Reminders",
        "template": "uw-warn",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Using inaccurate or inappropriate edit summaries",
        "catagory": "Reminders",
        "template": "uw-wrongsummary",
        "warningLevels": [
            0
        ]
    },
    {
        "name": "Potential three-revert rule violation; see also uw-ew",
        "catagory": "Policy Violation Warnings",
        "template": "uw-3rr",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Affiliate marketing",
        "catagory": "Policy Violation Warnings",
        "template": "uw-affiliate",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Use of multiple accounts (assuming good faith)",
        "catagory": "Policy Violation Warnings",
        "template": "uw-agf-sock",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Creating attack pages",
        "catagory": "Policy Violation Warnings",
        "template": "uw-attack",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Bot username",
        "catagory": "Policy Violation Warnings",
        "template": "uw-botun",
        "warningLevels": [
            6
        ],
        "note" : "Username notices should not be added for blatent violations. In these cases, click the gavel to report the username to the admins."
    },
    {
        "name": "Canvassing",
        "catagory": "Policy Violation Warnings",
        "template": "uw-canvass",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Copyright violation",
        "catagory": "Policy Violation Warnings",
        "template": "uw-copyright",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Linking to copyrighted works violation",
        "catagory": "Policy Violation Warnings",
        "template": "uw-copyright-link",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Copyright violation (with explanation for new users)",
        "catagory": "Policy Violation Warnings",
        "template": "uw-copyright-new",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Removing {{copyvio}} template from articles",
        "catagory": "Policy Violation Warnings",
        "template": "uw-copyright-remove",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Edit summary triggering the edit filter",
        "catagory": "Policy Violation Warnings",
        "template": "uw-efsummary",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Edit warring (stronger wording)",
        "catagory": "Policy Violation Warnings",
        "template": "uw-ew",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Edit warring (softer wording for newcomers)",
        "catagory": "Policy Violation Warnings",
        "template": "uw-ewsoft",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Hijacking articles",
        "catagory": "Policy Violation Warnings",
        "template": "uw-hijacking",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Creating hoaxes",
        "catagory": "Policy Violation Warnings",
        "template": "uw-hoax",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Making legal threats",
        "catagory": "Policy Violation Warnings",
        "template": "uw-legal",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Editing while logged out",
        "catagory": "Policy Violation Warnings",
        "template": "uw-login",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Usage of multiple IPs",
        "catagory": "Policy Violation Warnings",
        "template": "uw-multipleIPs",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Personal info",
        "catagory": "Policy Violation Warnings",
        "template": "uw-pinfo",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Recreating salted articles under a different title",
        "catagory": "Policy Violation Warnings",
        "template": "uw-salt",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Sockpuppetry",
        "catagory": "Policy Violation Warnings",
        "template": "uw-socksuspect",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Userpage vandalism",
        "catagory": "Policy Violation Warnings",
        "template": "uw-upv",
        "warningLevels": [
            6
        ]
    },
    {
        "name": "Username is against policy",
        "catagory": "Policy Violation Warnings",
        "template": "uw-username",
        "warningLevels": [
            6
        ],
        "note" : "Username notices should not be added for blatent violations. In these cases, click the gavel to report the username to the admins."
    },
    {
        "name": "Username is against policy, and conflict of interest",
        "catagory": "Policy Violation Warnings",
        "template": "uw-coi-username",
        "warningLevels": [
            6
        ],
        "note" : "Username notices should not be added for blatent violations. In these cases, click the gavel to report the username to the admins."
    },
    {
        "name": "Userpage or subpage is against policy",
        "catagory": "Policy Violation Warnings",
        "template": "uw-userpage",
        "warningLevels": [
            6
        ],
        "note" : "Username notices should not be added for blatent violations. In these cases, click the gavel to report the username to the admins."
    }
];