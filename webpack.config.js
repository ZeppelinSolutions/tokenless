const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  entry: path.join(__dirname, 'app/javascripts/app.js'),
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'app.bundle.js',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: 'babel-loader'
    }, {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    }, {
      test: /\.json$/,
      use: 'json-loader'
    }]
  },
  devServer: {
    contentBase: path.join(__dirname, "/dist"),
    compress: true,
    port: 3000,
    host: "0.0.0.0",
  },
  watchOptions: {
    poll: 1000
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" }
    ])
  ]
};

module.exports = config;
