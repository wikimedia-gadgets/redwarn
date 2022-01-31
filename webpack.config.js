"use strict";
/* eslint-disable */

// Constants

/**
 * Whether or not the bundle should be split into the made code file (`redwarn.js`)
 * and into seperate dependency files for caching.
 */
const RW_WEBPACK_CHUNKED = process.env.NODE_ENV === "production" ?
    ((process.env.RW_WEBPACK_CHUNKED || "true") === "true") : false;
const RW_WEBPACK_ANALYZE = process.env.RW_WEBPACK_ANALYZE === "true" || false;

// Dependencies
const fs = require("fs");
const path = require("path");
const {
    ProgressPlugin
} = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// noinspection NpmUsedModulesInstalled
const TerserPlugin = require("terser-webpack-plugin");

const plugins = [
    new ProgressPlugin({
        activeModules: true,
        entries: true,
        modules: true,
        dependencies: true
    })
];

const optimization = {
    minimize: false
};

let devtool = "source-map";
if (process.env.NODE_ENV === "production") {
    const WrapperPlugin = require("wrapper-webpack-plugin");
    plugins.push(new WrapperPlugin({
        header: fs.readFileSync(path.resolve(__dirname, "meta", "header.js"), "utf8"),
        footer: fs.readFileSync(path.resolve(__dirname, "meta", "footer.js"), "utf8"),
        test: "redwarn.js"
    }));

    optimization.minimize = true;
    optimization.minimizer = [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()];
    devtool = "";
}

if (RW_WEBPACK_CHUNKED) {
    optimization.removeEmptyChunks = true;
    optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
            default: false,
            languages: {
                test: /[\\/]src[\\/]localization[\\/]lang[\\/]/,
                priority: 0,
                filename: `lang/redwarn.lang.[name].js`,
                name(module) {
                    return (module.context.match(/[\\/]src[\\/]localization[\\/]lang[\\/](.+?)([\\/]|$)/)[1]);
                }
            },
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                priority: 0,
                filename: `deps/redwarn.dep.[name].js`,
                name(module) {
                    let packageName =
                        (module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1])
                            .replace("@", "");

                    // Smash together i18n modules
                    if (packageName.startsWith("i18next"))
                        packageName = "i18next";

                    // Smash together Material widgets
                    else if (packageName.startsWith("material"))
                        packageName = "material";

                    // Smash together TypeScript modules
                    else if ([
                        "tslib", "babel", "tsx-dom"
                    ].includes(packageName) || /.+-loader/g.test(packageName))
                        packageName = "tsmodules";

                    else
                        packageName = "otherdeps"

                    return packageName;
                }
            }
        }
    };
}

if (RW_WEBPACK_ANALYZE)
    plugins.push(new (require("webpack-bundle-analyzer")["BundleAnalyzerPlugin"])());

// noinspection WebpackConfigHighlighting
module.exports = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    ...(devtool ? { devtool } : void 0),
    entry: {
        redwarn: "./src/RedWarn.ts"
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".json"],
        alias: {
            rww: path.resolve(__dirname, "src")
        }
    },
    devServer: {
        compress: false,
        port: 45991,
        /* Wikipedia will block the request due to CORS. Just refresh like a normal person. */
        client: false,
        hot: false,
        liveReload: false
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.(txt|svg)$/,
                use: ["text-loader"],
                exclude: [
                    path.resolve(__dirname, "build")
                ]
            },
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
                exclude: [
                    path.resolve(__dirname, "build"),
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, "tests")
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: [
                    path.resolve(__dirname, "build"),
                    path.resolve(__dirname, "tests"),
                    path.resolve(__dirname, "old")
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: [
                    path.resolve(__dirname, "build")
                ]
            }
        ]
    },
    optimization,
    //stats: "verbose",
    stats: { orphanModules: true }
};
