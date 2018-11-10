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

const libraryName = "c13u";
const outputFile = `${libraryName}.js`;

module.exports = {
    mode: "production",
    entry: {
        CardTemplateController: "./public/static/CardTemplateController.js"
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ],
    output: {
        path: path.resolve(__dirname, "public", "dist"),
        filename: "[name].js"
        // library: libraryName,
        // libraryTarget: "umd",
        // umdNamedDefine: true
    },
    optimization: {
        // https://webpack.js.org/guides/code-splitting/
        splitChunks: {
            chunks: "all"
        }
    },
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