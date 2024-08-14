const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');

console.log(process.env.NODE_ENV);

module.exports = {
  entry: {
      'filter-script': './src/js/filter-script.js', // The path to your JS file
  },
  output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'build'), // The output directory
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                  loader: 'babel-loader',
                  options: {
                      presets: ['@babel/preset-env'],
                  },
              },
          },
      ],
  },
  mode: 'development', // or 'production' depending on your build mode
};