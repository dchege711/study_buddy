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

module.exports = {
    mode: "production",
    entry: {
        CardTemplateUtilities: path.resolve(__dirname, "public", "src", "CardTemplateUtilities.js"),
        CardsManager: path.resolve(__dirname, "public", "src", "CardsManager.js"),
        AppUtilities: path.resolve(__dirname, "public", "src", "AppUtilities.js"),
        TagsBarUtilities: path.resolve(__dirname, "public", "src", "TagsBarUtilities.js"),
        // AutoComplete: path.resolve(__dirname, "public", "src", "AutoComplete.js")
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            failOnError: true,
            cwd: process.cwd(),
            onStart({ compilation }) {
                console.log('circular-dependency-plugin: looking for webpack modules cycles...');
            }
          })
    ],
    output: {
        path: path.resolve(__dirname, "public", "dist"),
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
    module: {
        rules: [
            {
              test: /(\.jsx|\.js)$/,
              loader: 'babel-loader',
              exclude: /(node_modules|bower_components)/,
            },
        ]
    }
};
