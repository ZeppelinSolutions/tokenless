const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'app.js',
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
    }/*, {
      test: /\.sol/,
      use: `truffle-solidity-loader?migrations_directory=${path.resolve(__dirname, '../migrations')}`
    }*/]
  },
  devServer: {
    contentBase: path.join(__dirname, "/dist"),
    compress: true,
    port: 3000,
    host: "0.0.0.0",
    historyApiFallback: {
      index: '/index.html'
    }
  },
  devtool: 'inline-source-map',
  watchOptions: {
    poll: 1000
  },
  plugins: [
    // TODO: Use HtmlWebpackPlugin to generate the html from a template
    new CopyWebpackPlugin([
      { from: './public/index.html', to: "index.html" }
    ])
  ]
};

module.exports = config;
