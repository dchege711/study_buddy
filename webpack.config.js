"use strict";

/**
 * @description Build a bundle that can be used by the browser.
 * Run `$ npx webpack --config webpack.config.js`.
 * Alternatively, run `$ npm run build`
 *
 * Note to future me: Getting webpack started correctly is a pain in the butt
 * Resource 1: https://stackoverflow.com/questions/42719908/use-webpack-to-bundle-several-es6-classes-into-one-file-for-import-in-a-script-t?noredirect=1#comment72559889_42719908
 * Resource 2: https://github.com/albertbuchard/example-webpack-es6-class-bundle
 */

const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: "source-map",
    mode: "production",
    entry: {
        App: [
            path.resolve(__dirname, "src", "public", "src", "AccountPage"),
            path.resolve(__dirname, "src", "public", "src", "AppUtilities"),
            path.resolve(__dirname, "src", "public", "src", "AutoComplete"),
            path.resolve(__dirname, "src", "public", "src", "BrowseCardsPage"),
            path.resolve(__dirname, "src", "public", "src", "CardsManager"),
            path.resolve(__dirname, "src", "public", "src", "CardTemplateUtilities"),
            path.resolve(__dirname, "src", "public", "src", "HomePage"),
            path.resolve(__dirname, "src", "public", "src", "Latex"),
            path.resolve(__dirname, "src", "public", "src", "NavBar"),
            path.resolve(__dirname, "src", "public", "src", "PasswordResetPage"),
            path.resolve(__dirname, "src", "public", "src", "PasswordResetRequestPage"),
            path.resolve(__dirname, "src", "public", "src", "SearchBarDropDown"),
            path.resolve(__dirname, "src", "public", "src", "SendValidationURL"),
            path.resolve(__dirname, "src", "public", "src", "SyntaxHighlighting"),
            path.resolve(__dirname, "src", "public", "src", "TagsBarTemplate"),
            path.resolve(__dirname, "src", "public", "src", "TagsBarUtilities"),
            path.resolve(__dirname, "src", "public", "src", "WelcomePage"),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            failOnError: true,
            cwd: process.cwd(),
            onStart({ compilation }) {
                console.log('circular-dependency-plugin: looking for webpack modules cycles...');
            }
          }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "public", "css"),
                    to: path.resolve(__dirname, "dist", "public", "css")
                },
                {
                    from: path.resolve(__dirname, "src", "public", "images"),
                    to: path.resolve(__dirname, "dist", "public", "images")
                },
                {
                    from: path.resolve(__dirname, "src", "views"),
                    to: path.resolve(__dirname, "dist", "views")
                },
                {
                    from: path.resolve(__dirname, "src", "public", "src", "lib"),
                    to: path.resolve(__dirname, "dist", "public", "src", "lib")
                },
            ]
        }),
    ],
    output: {
        path: path.resolve(__dirname, "dist", "public", "src"),
        filename: "[name].bundle.min.js",
        // https://webpack.js.org/guides/author-libraries/#authoring-a-library
        library: "[name]",
        libraryTarget: "var"
    },
    // optimization: {
    //     // https://webpack.js.org/guides/code-splitting/
    //     splitChunks: {
    //         chunks: "all"
    //     }
    // },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", "ejs", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // { test: /\.js$/, loader: "source-map-loader" },
        ]
    }
};
