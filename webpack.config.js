const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

// Versioning
const packageVersion = JSON.stringify(require('./package.json').version).replace(/"/g, '');

const buildpath = path.resolve(process.cwd(), 'build');
const pluginVersion = (process.env.NODE_ENV == 'development') ? 'Development' + Math.floor(Math.random() * 100000000000) : packageVersion;


defaultConfig.plugins.push(new ReplaceInFileWebpackPlugin([
    {
        dir: 'build',
        files: ['meita-documents-and-media.php'],
        rules: [{
            search: /Version:           Development.*/gi, // See that the spaces between are exactly the same as in target file
            replace: function (match) {
                return 'Version:           ' + pluginVersion;
            }
        }]
    },
    { dir: 'build/blocks/show-bucket', files: ['block.json'], rules: [{ search: /"version": "development",/gi, replace: function (match) { return '"version": "' + pluginVersion + '",'; } }] },
    { dir: 'build/blocks/show-media', files: ['block.json'], rules: [{ search: /"version": "development",/gi, replace: function (match) { return '"version": "' + pluginVersion + '",'; } }] }
]));


module.exports = {
    ...defaultConfig,
    plugins: [
        ...defaultConfig.plugins,
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        //		new FixStyleOnlyEntriesPlugin(),
        new CopyPlugin({
            patterns: [
                { from: '**/*.php', to: buildpath, context: path.resolve(__dirname, 'src') },
                { from: 'admin/*.php', to: buildpath, context: path.resolve(__dirname, 'src') },
                { from: 'languages', to: buildpath + '/languages', context: path.resolve(__dirname, 'src') },
            ],
        }),

    ],

};
console.log('Webpack config', defaultConfig);
