"use strict";

// Constants

/**
 * Whether or not the bundle should be split into the made code file (`redwarn.js`)
 * and into seperate dependency files for caching. If you are developing, this must
 * be set to false or else you will be required to load all the required files
 * through your common.js file.
 * @type {boolean}
 */
const RW_WEBPACK_CHUNKED = process.env.NODE_ENV === "production" ?
    ((process.env.RW_WEBPACK_CHUNKED || "true") === "true") : false;
/**
 * Whether or not to perform dependency analysis after the bundle is created.
 * @type {boolean}
 */
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

/**
 * A full list of Webpack plugins to be loaded.
 * @type {*[]}
 */
const plugins = [
    new ProgressPlugin({
        activeModules: true,
        entries: true,
        modules: true,
        dependencies: true
    })
];

/**
 * Webpack's optimization settings.
 * @type {Record<string, unknown>}
 */
const optimization = {
    minimize: false
};

/**
 * The Webpack source map setting to use. Source maps are emitted (even for production
 * builds) so that users can inspect the code on their own or do their own debugging
 * on the built bundle.
 * @type {string}
 */
let devtool = "source-map";

if (process.env.NODE_ENV === "production") {
    const WrapperPlugin = require("wrapper-webpack-plugin");

    plugins.push(
        /**
         * Responsible for attaching the header and footer to the entrypoint.
         * @type {WrapperPlugin}
         */
        new WrapperPlugin({
            header: fs.readFileSync(path.resolve(__dirname, "meta", "header.js"), "utf8"),
            footer: fs.readFileSync(path.resolve(__dirname, "meta", "footer.js"), "utf8"),
            test: "redwarn.js"
        })
    );

    // Minimize the bundle size.
    optimization.minimize = true;
    // Set minimizer options.
    optimization.minimizer = [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()];
}

// Will run if this bundle is chunked.
if (RW_WEBPACK_CHUNKED) {
    // Expose entrypoints in JSON file for continuous deployment server.
    const AssetsPlugin = require("assets-webpack-plugin");
    plugins.push(new AssetsPlugin({
        entrypoints: true,
        useCompilerPath: true,
        filename: "entrypoints.json",
        removeFullPathAutoPrefix: true
    }));

    // optimization.runtimeChunk is no longer needed since we only have one entrypoint.
    // Removes empty chunks.
    optimization.removeEmptyChunks = true;
    // Splits chunks into digestible parts.
    optimization.splitChunks = {
        // Optimize all chunks, both initial and async.
        chunks: "all",
        // The maximum number of parallel requests for an entry point.
        // Set to infinity to maximize initial requests.
        maxInitialRequests: Infinity,
        // The minimum size of a chunk (locked at 0).
        minSize: 0,
        // Cache groups (also defines folder structure)
        cacheGroups: {
            // Disable default cache groups
            default: false,
            // Language definition cache group
            languages: {
                test: /[\\/]src[\\/]localization[\\/]lang[\\/]/,
                priority: 0,
                filename: `lang/redwarn.lang.[name].js`,
                name(module) {
                    // /src/localization/lang/en-US/ -> en-US
                    return (module.context.match(/[\\/]src[\\/]localization[\\/]lang[\\/](.+?)([\\/]|$)/)[1]);
                }
            },
            // Vendor (third-party) module cache group
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

// Show bundle analysis after building if analysis is enabled.
if (RW_WEBPACK_ANALYZE)
    plugins.push(new (require("webpack-bundle-analyzer")["BundleAnalyzerPlugin"])());

// noinspection WebpackConfigHighlighting
module.exports = {
    // Targeting web browsers
    target: "web",
    // Set to production mode if explicitly defined
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    // Enable devtools if set
    ...(devtool ? { devtool } : void 0),
    // Define entrypoints
    entry: {
        redwarn: "./src/RedWarn.ts"
    },
    // Define output information
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js",
        // Automatically determine publicPath
        publicPath: "auto"
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".json"],
        alias: {
            // Define rww/ in ES6 imports as RedWarn
            rww: path.resolve(__dirname, "src")
        }
    },
    // Development server options
    devServer: {
        // Do not compress data (forces developers to write optimized code)
        compress: false,
        port: 45991,
        /* Wikipedia will block the request due to CORS. Just refresh like a normal person. */
        client: false,
        hot: false,
        liveReload: false
    },
    // Add in plugins
    plugins,
    module: {
        rules: [
            // Load SVG and text files through the text loader
            {
                test: /\.(txt|svg)$/,
                use: ["text-loader"],
                exclude: [
                    path.resolve(__dirname, "build")
                ]
            },
            // Load TypeScript files through the TypeScript loader
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
                exclude: [
                    path.resolve(__dirname, "build"),
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, "tests")
                ]
            },
            // Load JavaScript files
            {
                test: /\.jsx?$/,
                exclude: [
                    path.resolve(__dirname, "build"),
                    path.resolve(__dirname, "tests"),
                    path.resolve(__dirname, "old")
                ]
            },
            // Load CSS files through the CSS and style loaders
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: [
                    path.resolve(__dirname, "build")
                ]
            }
        ]
    },
    // Define optimization settings
    optimization,
    //stats: "verbose",
    stats: { orphanModules: true }
};
