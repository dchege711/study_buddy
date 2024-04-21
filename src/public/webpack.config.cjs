const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const baseConfig = require('../../tools/webpack.esloader.config.cjs');

module.exports = (env, args) => {
    args.context = __dirname;

    const serverDistPath = path.resolve(__dirname, '..', '..', 'dist', 'public');
    const copyWebpackPlugin = new CopyWebpackPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, 'css'),
                to: path.resolve(serverDistPath, 'css')
            },
            {
                from: path.resolve(__dirname, 'images'),
                to: path.resolve(serverDistPath, 'images')
            },
            {
                from: path.resolve(__dirname, 'src', 'lib'),
                to: path.resolve(__dirname, 'src', 'lib')
            },
        ]
    });

    return merge(
        baseConfig(env, args),
        {
            devtool: 'source-map',
            entry: {
                'search-bar': './src/components/search-bar/search-bar.ts',
            },
            plugins: [
                copyWebpackPlugin
            ]
        }
    )
}