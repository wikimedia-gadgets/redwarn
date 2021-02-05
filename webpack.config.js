/* eslint-disable */
const fs = require("fs");
const path = require("path");
const {
    ProgressPlugin
} = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');

const plugins = [new ProgressPlugin({
    activeModules: true,
    entries: true,
    modules: true,
    dependencies: true
})];
const optimization = { minimize: false }
if (process.env.NODE_ENV === "production") {
    const WrapperPlugin = require('wrapper-webpack-plugin');
    plugins.push(new WrapperPlugin({
        header: fs.readFileSync(path.resolve(__dirname, "meta", "header.js"), "utf8"),
        footer: fs.readFileSync(path.resolve(__dirname, "meta", "footer.js"), "utf8"),
    }));
    optimization.minimize = true;
    optimization.minimizer = [new TerserPlugin({ extractComments: false })];
}
module.exports = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devtool: 'source-map',
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
        hot: false,
        inline: false
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.txt$/,
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
    optimization
};