import buildinfo from "!webpack-plugin-buildinfo?gitHash&gitHashShort&time&platform&arch!";

export const RW_BUILDINFO = buildinfo;

// ! following needs to be updated manually, otherwise the whole package.json will be included in compile
export const RW_VERSION = "0.2.0";
export const RW_VERSION_TAG = `0.2.0-dev+${RW_BUILDINFO.gitHashShort}`;
export const RW_VERSION_SUMMARY = "nothing yet";

export const RW_CONFIG_VERSION = 1;

// Since MediaWiki will convert some of these templates, we have to store these
// as Base64 encoded strings.
export const RW_SIG = atob("fn5+fg==");
export const RW_WELCOME = atob("e3tzdWJzdDpXZWxjb21lfX0=");
export const RW_WELCOME_IP = atob("e3tzdWJzdDp3ZWxjb21lLWFub259fQ==");
export const RW_SHARED_IP_ADVICE = atob(
    "XG46e3tzdWJzdDpTaGFyZWQgSVAgYWR2aWNlfX0="
);
export const RW_NOWIKI_OPEN = atob("PG5vd2lraT4=");
export const RW_NOWIKI_CLOSE = atob("PC9ub3dpa2k+");

export const RW_LINK = "[[w:en:WP:RW|RedWarn]]";
export const RW_WIKIS_TAGGABLE = ["enwiki"];
export const RW_WIKIS_SPEEDUP = ["enwiki"];
