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
        extensions: [".ts", ".tsx", ".js"]
    },
    devServer: {
        compress: false,
        port: 45991,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
};