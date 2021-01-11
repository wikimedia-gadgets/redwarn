import { version } from "../../package.json";
export { default as RW_BUILDINFO } from "!webpack-plugin-buildinfo?gitHash&time!";

export const RW_VERSION = version;
export const RW_VERSION_TAG = "17dev";
export const RW_VERSION_SUMMARY = "nothing yet";

// Since MediaWiki will convert some of these templates, we have to store these
// as Base64 encoded strings.
export const RW_SIG = atob("fn5+fg==");
export const RW_WELCOME = atob("e3tzdWJzdDpXZWxjb21lfX0=");
export const RW_WELCOME_IP = atob("e3tzdWJzdDp3ZWxjb21lLWFub259fQ==");
export const RW_SHARED_IP_ADVICE = atob(
    "XG46e3tzdWJzdDpTaGFyZWQgSVAgYWR2aWNlfX0="
);
export const RW_NOWIKI = atob("PG5vd2lraT4=");
export const RW_NOWIKI_END = atob("PC9ub3dpa2k+");

export const RW_LINK = "[[w:en:WP:RW|RedWarn]]";
export const RW_WIKIS_TAGGABLE = ["enwiki"];
