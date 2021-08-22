// Do not import any other file except the build information.
import buildinfo from "!webpack-plugin-buildinfo?gitHash&gitHashShort&time&platform&arch!./buildinfo.js";

export const RW_BUILDINFO = buildinfo;

// These need to be updated manually.
export const RW_VERSION = "0.2.0";
export const RW_VERSION_PUBLIC = "17";
export const RW_VERSION_TAG = `${RW_VERSION_PUBLIC}${
    process.env.NODE_ENV === "development"
        ? `dev (${RW_BUILDINFO.gitHashShort})`
        : ""
}`;

// TODO: not have this here
export const RW_VERSION_SUMMARY = "nothing yet";

export const RW_CONFIG_VERSION = 1;
export const RW_DATABASE_NAME = "redwarnLiteDB";
export const RW_DATABASE_VERSION = 1;

export const RW_LOG_SIGNATURE = `RedWarn ${RW_VERSION_TAG}`;

export const RW_SIGNATURE = "~~~~";

export const RW_WIKI_CONFIGURATION = "Project:RedWarn/configuration.json";
export const RW_WIKI_CONFIGURATION_VERSION = 1;

export const RW_NOWIKI_OPEN = atob("PG5vd2lraT4=");
export const RW_NOWIKI_CLOSE = atob("PC9ub3dpa2k+");

export const RW_LINK = "[[w:en:WP:RW|RedWarn]]";
export const RW_WIKIS_TAGGABLE = ["enwiki"];
export const RW_WIKIS_SPEEDUP = ["enwiki"];

// TODO: Global configuration file on Meta instead of Wikipedia
export const RW_FALLBACK_WIKI = {
    indexPath: "https://en.wikipedia.org/w/index.php",
    apiPath: "https://en.wikipedia.org/w/api.php",
    configuration: RW_WIKI_CONFIGURATION
};

export const RW_FALLBACK_CONFIG =
    "https://redwarn-web.wmcloud.org/static/default-config.json";
