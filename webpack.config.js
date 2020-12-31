/* eslint-disable */
const path = require("path");

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
        publicPath: 'build',
        compress: false,
        port: 45991,
        hot: false,
        inline: false
    },
    module: {
        rules: [
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
    }
};