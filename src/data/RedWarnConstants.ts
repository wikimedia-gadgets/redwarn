import buildinfo from "!webpack-plugin-buildinfo?gitHash&gitHashShort&time&platform&arch!";

export const RW_BUILDINFO = buildinfo;

// ! following needs to be updated manually, otherwise the whole package.json will be included in compile
export const RW_VERSION = "0.2.0";
export const RW_VERSION_TAG = `0.2.0-dev+${RW_BUILDINFO.gitHashShort}`;
export const RW_VERSION_SUMMARY = "nothing yet";

export const RW_CONFIG_VERSION = 1;

export const RW_SIGNATURE = "~~~~";
export const RW_WELCOME = "{{subst:Welcome}}";
export const RW_WELCOME_ANON = "{{subst:welcome-anon}}";
export const RW_SHARED_IP_ADVICE = "{{subst:Shared IP advice}}";

/* Do not decode! The source code must NEVER have closing or opening nowiki tags! */
export const RW_NOWIKI_OPEN = atob("PG5vd2lraT4=");
export const RW_NOWIKI_CLOSE = atob("PC9ub3dpa2k+");

export const RW_LINK = "[[w:en:WP:RW|RedWarn]]";
export const RW_WIKIS_TAGGABLE = ["enwiki"];
export const RW_WIKIS_SPEEDUP = ["enwiki"];
