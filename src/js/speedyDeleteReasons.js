// Processed from Twinkle source. See User Guide for more info.
var speedyDeleteReasons = {
    
    "anything, under ": [
        {
            "title": "G1: Nonsense.",
            "helpText": "Pages consisting purely of incoherent text or gibberish with no meaningful content or history. This does not include poor writing, partisan screeds, obscene remarks, vandalism, fictional material, material not in English, poorly translated material, implausible theories, or hoaxes. In short, if you can understand it, G1 does not apply.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G2: Test page",
            "helpText": "A page created to test editing or other Wikipedia functions. Pages in the User namespace are not included, nor are valid but unused or duplicate templates (although criterion T3 may apply).",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G3: Pure vandalism",
            "helpText": "Plain pure vandalism (including redirects left behind from pagemove vandalism)",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G3: Blatant hoax",
            "helpText": "Blatant and obvious hoax, to the point of vandalism",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G4: Recreation of material deleted via a deletion discussion",
            "helpText": "A copy, by any title, of a page that was deleted via an XfD process or Deletion review, provided that the copy is substantially identical to the deleted version. This clause does not apply to content that has been \"userfied\", to content undeleted as a result of Deletion review, or if the prior deletions were proposed or speedy deletions, although in this last case, other speedy deletion criteria may still apply",
            "input": "Page where the deletion discussion took place: ",
            "inputMaxLength": 60,
            "inputTooltip": "Must start with \"Wikipedia:\""
        },
        {
            "title": "G5: Created by a banned or blocked user",
            "helpText": "Pages created by banned or blocked users in violation of their ban or block, and which have no substantial edits by others",
            "input": "Username of banned user (if available): ",
            "inputTooltip": "Should not start with \"User:\""
        },
        {
            "title": "G6: Move",
            "helpText": "Making way for an uncontroversial move like reversing a redirect"
        },
        {
            "title": "G6: Deletion discussion was closed as \"delete\"",
            "helpText": "A deletion discussion (at AfD, FfD, RfD, TfD, CfD, or MfD) was closed as \"delete\", but the page wasn't actually deleted.",
            "input": "Page where the deletion discussion was held: ",
            "inputMaxLength": 40,
            "inputTooltip": "Must start with \"Wikipedia:\""
        },
        {
            "title": "G6: Copy-and-paste page move",
            "helpText": "This only applies for a copy-and-paste page move of another page that needs to be temporarily deleted to make room for a clean page move.",
            "input": "Original page that was copy-pasted here: "
        },
        {
            "title": "G6: Housekeeping and non-controversial cleanup",
            "helpText": "Other routine maintenance tasks",
            "input": "Rationale: ",
            "inputMaxLength": 60
        },
        {
            "title": "G7: Author requests deletion, or author blanked",
            "helpText": "Any page for which deletion is requested by the original author in good faith, provided the page's only substantial content was added by its author. If the author blanks the page, this can also be taken as a deletion request.",
            "input": "Optional explanation: ",
            "inputMaxLength": 60,
            "inputTooltip": "Perhaps linking to where the author requested this deletion."
        },
        {
            "title": "G8: Pages dependent on a non-existent or deleted page",
            "helpText": "such as talk pages with no corresponding subject page; subpages with no parent page; file pages without a corresponding file; redirects to non-existent targets; or categories populated by deleted or retargeted templates. This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.",
            "input": "Optional explanation: ",
            "inputMaxLength": 60
        },
        {
            "title": "G8: Subpages with no parent page",
            "helpText": "This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G10: Attack page",
            "helpText": "Pages that serve no purpose but to disparage or threaten their subject or some other entity (e.g., \"John Q. Doe is an imbecile\"). This includes a biography of a living person that is negative in tone and unsourced, where there is no NPOV version in the history to revert to. Administrators deleting such pages should not quote the content of the page in the deletion summary!",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G10: Wholly negative, unsourced BLP",
            "helpText": "A biography of a living person that is entirely negative in tone and unsourced, where there is no neutral version in the history to revert to.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G11: Unambiguous advertising or promotion",
            "helpText": "Pages which exclusively promote a company, product, group, service, or person and which would need to be fundamentally rewritten in order to become encyclopedic. Note that an article about a company or a product which describes its subject from a neutral point of view does not qualify for this criterion; an article that is blatant advertising should have inappropriate content as well",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G12: Unambiguous copyright infringement",
            "helpText": "Either: (1) Material was copied from another website that does not have a license compatible with Wikipedia, or is photography from a stock photo seller (such as Getty Images or Corbis) or other commercial content provider; (2) There is no non-infringing content in the page history worth saving; or (3) The infringement was introduced at once by a single person rather than created organically on wiki and then copied by another website such as one of the many Wikipedia mirrors"
        },
        {
            "title": "G13: Page in draft namespace or userspace AfC submission, stale by over 6 months",
            "helpText": "Any rejected or unsubmitted AfC submission in userspace or any non-redirect page in draft namespace, that has not been edited for more than 6 months. Blank drafts in either namespace are also included.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G14: Unnecessary disambiguation page",
            "helpText": "This only applies for orphaned disambiguation pages which either: (1) disambiguate only one existing Wikipedia page and whose title ends in \"(disambiguation)\" (i.e., there is a primary topic); or (2) disambiguate no (zero) existing Wikipedia pages, regardless of its title. It also applies to orphan \"Foo (disambiguation)\" redirects that target pages that are not disambiguation or similar disambiguation-like pages (such as set index articles or lists)",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        }
    ],

    "a user page, under ": [
        {
            "title": "U1: User request",
            "helpText": "Personal subpages, upon request by their user. In some rare cases there may be administrative need to retain the page. Also, sometimes, main user pages may be deleted as well. See Wikipedia:User page for full instructions and guidelines",
            "input": "Explain why this user talk page should be deleted (required): ",
            "inputMaxLength": 60,
            "inputTooltip": "User talk pages are deleted only in highly exceptional circumstances. See WP:DELTALK."
        },
        {
            "title": "U2: Nonexistent user",
            "helpText": "User pages of users that do not exist (Check Special:Listusers)",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "U3: Non-free galleries",
            "helpText": "Galleries in the userspace which consist mostly of \"fair use\" or non-free files. Wikipedia's non-free content policy forbids users from displaying non-free files, even ones they have uploaded themselves, in userspace. It is acceptable to have free files, GFDL-files, Creative Commons and similar licenses along with public domain material, but not \"fair use\" files",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "U5: Blatant WP:NOTWEBHOST violations",
            "helpText": "Pages in userspace consisting of writings, information, discussions, and/or activities not closely related to Wikipedia's goals, where the owner has made few or no edits outside of userspace, with the exception of plausible drafts and pages adhering to WP:UPYES.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G11: Promotional user page under a promotional user name",
            "helpText": "A promotional user page, with a username that promotes or implies affiliation with the thing being promoted. Note that simply having a page on a company or product in one's userspace does not qualify it for deletion. If a user page is spammy but the username is not, then consider tagging with regular G11 instead.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G13: AfC draft submission or a blank draft, stale by over 6 months",
            "helpText": "Any rejected or unsubmitted AfC draft submission or a blank draft, that has not been edited in over 6 months (excluding bot edits).",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        }
    ],

    "an article, under ": [
        {
            "title": "A1: No context. Articles lacking sufficient context to identify the subject of the article.",
            "helpText": "Example: \"He is a funny man with a red car. He makes people laugh.\" This applies only to very short articles. Context is different from content, treated in A3, below.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A2: Foreign language articles that exist on another Wikimedia project",
            "helpText": "If the article in question does not exist on another project, the template {{notenglish}} should be used instead. All articles in a non-English language that do not meet this criteria (and do not meet any other criteria for speedy deletion) should be listed at Pages Needing Translation (PNT) for review and possible translation",
            "input": "Interwiki link to the article on the foreign-language wiki: ",
            "inputTooltip": "For example, fr:Bonjour"
        },
        {
            "title": "A3: No content whatsoever",
            "helpText": "Any article consisting only of links elsewhere (including hyperlinks, category tags and \"see also\" sections), a rephrasing of the title, and/or attempts to correspond with the person or group named by its title. This does not include disambiguation pages",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A5: Transwikied articles",
            "helpText": "Any article that has been discussed at Articles for Deletion (et al), where the outcome was to transwiki, and where the transwikification has been properly performed and the author information recorded. Alternately, any article that consists of only a dictionary definition, where the transwikification has been properly performed and the author information recorded",
            "input": "Link to where the page has been transwikied: ",
            "inputTooltip": "For example, https://en.wiktionary.org/wiki/hello or [[wikt:hello]]"
        },
        {
            "title": "A7: Unremarkable",
            "helpText": "An article about a real person, group of people, band, club, company, web content, individual animal, tour, or party that does not assert the importance or significance of its subject. If controversial, or if a previous AfD has resulted in the article being kept, the article should be nominated for AfD instead",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A7: Unremarkable person",
            "helpText": "An article about a real person that does not assert the importance or significance of its subject. If controversial, or if there has been a previous AfD that resulted in the article being kept, the article should be nominated for AfD instead",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A7: Unremarkable musician(s) or band",
            "helpText": "Article about a band, singer, musician, or musical ensemble that does not assert the importance or significance of the subject",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A7: Unremarkable club",
            "helpText": "Article about a club that does not assert the importance or significance of the subject",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A7: Unremarkable company or organization",
            "helpText": "Article about a company or organization that does not assert the importance or significance of the subject",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A7: Unremarkable website or web content",
            "helpText": "Article about a web site, blog, online forum, webcomic, podcast, or similar web content that does not assert the importance or significance of its subject",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A7: Unremarkable individual animal",
            "helpText": "Article about an individual animal (e.g. pet) that does not assert the importance or significance of its subject",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A7: Unremarkable organized event",
            "helpText": "Article about an organized event (tour, function, meeting, party, etc.) that does not assert the importance or significance of its subject",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A9: Unremarkable musical recording where artist's article doesn't exist",
            "helpText": "An article about a musical recording which does not indicate why its subject is important or significant, and where the artist's article has never existed or has been deleted",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "A10: Recently created article that duplicates an existing topic",
            "helpText": "A recently created article with no relevant page history that does not aim to expand upon, detail or improve information within any existing article(s) on the subject, and where the title is not a plausible redirect. This does not include content forks, split pages or any article that aims at expanding or detailing an existing one.",
            "input": "Article that is duplicated: "
        },
        {
            "title": "A11: Obviously made up by creator, and no claim of significance",
            "helpText": "An article which plainly indicates that the subject was invented/coined/discovered by the article's creator or someone they know personally, and does not credibly indicate why its subject is important or significant",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        }
    ],
    
    "a talk page, under ": [
        {
            "title": "G8: Talk pages with no corresponding subject page",
            "helpText": "This excludes any page that is useful to the project - in particular, user talk pages, talk page archives, and talk pages for files that exist on Wikimedia Commons.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        }
    ],
    "a file, under ": [
        {
            "title": "F1: Redundant file",
            "helpText": "Any file that is a redundant copy, in the same file format and same or lower resolution, of something else on Wikipedia. Likewise, other media that is a redundant copy, in the same format and of the same or lower quality. This does not apply to files duplicated on Wikimedia Commons, because of licence issues; these should be tagged with {{subst:ncd|Image:newname.ext}} or {{subst:ncd}} instead",
            "input": "File this is redundant to: ",
            "inputTooltip": "The \"File:\" prefix can be left off."
        },
        {
            "title": "F2: Corrupt, mising, or empty file",
            "helpText": "Before deleting this type of file, verify that the MediaWiki engine cannot read it by previewing a resized thumbnail of it. This also includes empty (i.e., no content) file description pages for Commons files",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "F2: Unneeded file description page for a file on Commons",
            "helpText": "An image, hosted on Commons, but with tags or information on its English Wikipedia description page that are no longer needed. (For example, a failed featured picture candidate.)",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "F3: Improper license",
            "helpText": "Files licensed as \"for non-commercial use only\", \"non-derivative use\" or \"used with permission\" that were uploaded on or after 2005-05-19, except where they have been shown to comply with the limited standards for the use of non-free content. This includes files licensed under a \"Non-commercial Creative Commons License\". Such files uploaded before 2005-05-19 may also be speedily deleted if they are not used in any articles",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "F4: Lack of licensing information",
            "helpText": "Files in category \"Files with unknown source\", \"Files with unknown copyright status\", or \"Files with no copyright tag\" that have been tagged with a template that places them in the category for more than seven days, regardless of when uploaded. Note, users sometimes specify their source in the upload summary, so be sure to check the circumstances of the file.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "F5: Unused non-free copyrighted file",
            "helpText": "Files that are not under a free license or in the public domain that are not used in any article, whose only use is in a deleted article, and that are very unlikely to be used on any other article. Reasonable exceptions may be made for files uploaded for an upcoming article.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "F6: Missing fair-use rationale",
            "helpText": "Any file without a fair use rationale may be deleted seven days after it is uploaded. Boilerplate fair use templates do not constitute a fair use rationale.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "F7: Clearly invalid fair-use tag",
            "helpText": "This is only for files with a clearly invalid fair-use tag, such as a {{Non-free logo}} tag on a photograph of a mascot.",
            "input": "Optional explanation: ",
            "inputMaxLength": 60
        },
        {
            "title": "F7: Fair-use media from a commercial image agency which is not the subject of sourced commentary",
            "helpText": "Non-free images or media from a commercial source (e.g., Associated Press, Getty), where the file itself is not the subject of sourced commentary, are considered an invalid claim of fair use and fail the strict requirements of WP:NFCC.",
            "input": "Optional explanation: ",
            "inputMaxLength": 60
        },
        {
            "title": "F8: File available as an identical or higher-resolution copy on Wikimedia Commons",
            "helpText": "Provided the following conditions are met: 1: The file format of both images is the same. 2: The file's license and source status is beyond reasonable doubt, and the license is undoubtedly accepted at Commons. 3: All information on the file description page is present on the Commons file description page. That includes the complete upload history with links to the uploader's local user pages. 4: The file is not protected, and the file description page does not contain a request not to move it to Commons. 5: If the file is available on Commons under a different name than locally, all local references to the file must be updated to point to the title used at Commons. 6: For {{c-uploaded}} files: They may be speedily deleted as soon as they are off the Main Page",
            "input": "Filename on Commons: ",
            "inputTooltip": "This can be left blank if the file has the same name on Commons as here. The \"File:\" prefix is optional."
        },
        {
            "title": "F9: Unambiguous copyright infringement",
            "helpText": "The file was copied from a website or other source that does not have a license compatible with Wikipedia, and the uploader neither claims fair use nor makes a credible assertion of permission of free use. Sources that do not have a license compatible with Wikipedia include stock photo libraries such as Getty Images or Corbis. Non-blatant copyright infringements should be discussed at Wikipedia:Files for deletion"
        },
        {
            "title": "F10: Useless non-media file",
            "helpText": "Files uploaded that are neither image, sound, nor video files (e.g. .doc, .pdf, or .xls files) which are not used in any article and have no foreseeable encyclopedic use",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "F11: No evidence of permission",
            "helpText": "If an uploader has specified a license and has named a third party as the source/copyright holder without providing evidence that this third party has in fact agreed, the item may be deleted seven days after notification of the uploader",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G8: File description page with no corresponding file",
            "helpText": "This is only for use when the file doesn't exist at all. Corrupt files, and local description pages for files on Commons, should use F2; implausible redirects should use R3; and broken Commons redirects should use R4.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        }
    ],
    
    "a category, under ": [
        {
            "title": "C1: Empty categories",
            "helpText": "Categories that have been unpopulated for at least seven days. This does not apply to categories being discussed at WP:CFD, disambiguation categories, and certain other exceptions. If the category isn't relatively new, it possibly contained articles earlier, and deeper investigation is needed",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G8: Categories populated by a deleted or retargeted template",
            "helpText": "This is for situations where a category is effectively empty, because the template(s) that formerly placed pages in that category are now deleted. This excludes categories that are still in use.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G8: Redirects to non-existent targets",
            "helpText": "This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        }
    ],
    
    "a template, under ": [
        {
            "title": "T2: Templates that are blatant misrepresentations of established policy",
            "helpText": "This includes \"speedy deletion\" templates for issues that are not speedy deletion criteria and disclaimer templates intended to be used in articles",
            "input": "Optional explanation: ",
            "inputMaxLength": 60
        },
        {
            "title": "T3: Duplicate templates or hardcoded instances",
            "helpText": "Templates that are either substantial duplications of another template or hardcoded instances of another template where the same functionality could be provided by that other template",
            "input": "Template this is redundant to: ",
            "inputTooltip": "The \"Template:\" prefix is not needed."
        }
    ],
    "a portal, under ": [
        {
            "title": "P1: Portal that would be subject to speedy deletion if it were an article",
            "helpText": "You must specify a single article criterion that applies in this case (A1, A3, A7, or A10).",
            "input": "Article criterion that would apply: "
        },
        {
            "title": "P2: Underpopulated portal (fewer than three non-stub articles)",
            "helpText": "Any Portal based on a topic for which there is not a non-stub header article, and at least three non-stub articles detailing subject matter that would be appropriate to discuss under the title of that Portal",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        }
    ],

    "a redirect, under ": [
        {
            "title": "R2: Redirect from mainspace to any other namespace.",
            "helpText": "Excluding the Category:, Template:, Wikipedia:, Help: and Portal: namespaces. This does not include the pseudo-namespace shortcuts. If this was the result of a page move, consider waiting a day or two before deleting the redirect",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "R3: Recently created redirect from an implausible typo or misnomer",
            "helpText": "However, redirects from common misspellings or misnomers are generally useful, as are redirects in other languages",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "R4: File namespace redirect with a name that matches a Commons page",
            "helpText": "The redirect should have no incoming links (unless the links are cleary intended for the file or redirect at Commons).",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G6: Redirect to malplaced disambiguation page",
            "helpText": "This only applies for redirects to disambiguation pages ending in (disambiguation) where a primary topic does not exist.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        },
        {
            "title": "G8: Redirects to non-existent targets",
            "helpText": "This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.",
            "input": "",
            "inputMaxLength": 0,
            "inputTooltip": ""
        }
    ],
    "write a ": [
        {
            "title": "custom reason",
            "helpText": "At least one of the other deletion criteria must still apply to the page, and you must make mention of this in your rationale. This is not a \"catch-all\" for when you can't find any criteria that fit.",
            "input": "Rationale: ",
            "inputMaxLength": 60
        }
    ]
};