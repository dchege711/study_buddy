const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = () => {
    // Copy over the EJS templates to the dist folder.
    const copyWebpackPlugin = new CopyWebpackPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, 'src', 'views'),
                to: path.resolve(__dirname, 'dist', 'views')
            }
        ]
    });

    return {
        entry: {},
        plugins: [copyWebpackPlugin]
    }
}
