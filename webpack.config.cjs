const { merge } = require('webpack-merge');
const path = require('path');

const baseConfig = require('./tools/webpack.esloader.config.cjs');

module.exports = (env, args) => {
    args.context = __dirname;

    return merge(
        baseConfig(env, args),
        {
            target: 'node',
            entry: {
                'server': path.resolve(__dirname, 'src', 'server.ts'),
            },
        }
    )
}
