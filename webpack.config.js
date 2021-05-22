/* eslint-disable */
const fs = require("fs");
const path = require("path");
const {
    ProgressPlugin
} = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const plugins = [new ProgressPlugin({
    activeModules: true,
    entries: true,
    modules: true,
    dependencies: true
})];
const optimization = { minimize: false };
let devtool = "source-map";
if (process.env.NODE_ENV === "production") {
    const WrapperPlugin = require('wrapper-webpack-plugin');
    plugins.push(new WrapperPlugin({
        header: fs.readFileSync(path.resolve(__dirname, "meta", "header.js"), "utf8"),
        footer: fs.readFileSync(path.resolve(__dirname, "meta", "footer.js"), "utf8"),
    }));
    optimization.minimize = true;
    optimization.minimizer = [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()];
    devtool = "";
}
module.exports = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    ...(devtool ? { devtool } : void 0),
    entry: ["./src/RedWarnLite.ts"],
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "redwarn.js"
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
        hot: false,
        inline: false,
        liveReload: false,
        injectClient: false
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.(txt|svg)$/,
                use: ["text-loader"]
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
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    optimization,
    stats: "verbose"
};
