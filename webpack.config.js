const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');



module.exports = {
    ...defaultConfig,
    entry: {
        ...defaultConfig.entry,
        'index': './src/index.js',
        'filter-script': './src/js/filter-script.js',
    },
    output: {
        ...defaultConfig.output,
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
    },

}