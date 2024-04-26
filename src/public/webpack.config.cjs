const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const baseConfig = require('../../tools/webpack.esloader.config.cjs');

module.exports = (env, args) => {
    args.context = __dirname;

    // The static files are referenced by HTML files produced by the server.
    // Copy over the static files to the server dist folder.
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
                to: path.resolve(serverDistPath, 'src', 'lib')
            },
        ]
    });

    return merge(
        baseConfig(env, args),
        {
            devtool: 'source-map',
            output: {
                path: path.resolve(serverDistPath, 'src'),
                filename: '[name].js',
                clean: true,
            },
            entry: {
                'browse-page': './src/pages/browse-page.ts',
            },
            plugins: [
                copyWebpackPlugin
            ]
        }
    )
}
