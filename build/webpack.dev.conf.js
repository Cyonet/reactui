const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const baseConf = require('./webpack.base.conf');
const CSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const cssnano = require('cssnano');
const util = require('./util');
// const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(baseConf, {
  module: {
    rules: [{
      test: /\.(less|css)$/,
      exclude: /node_modules/,
      include: [util.resolve('src'), util.resolve('test')],
      use: ExtractTextPlugin.extract({
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => {
                return [
                  cssnano()
                ];
              }
            }
          },
          'less-loader'
        ]
      })
    }]
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin({filename: '[name].[contenthash:8].css', allChunks: true}),
    new CSSplitWebpackPlugin({size: 4000}),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: util.resolve("src/index.html"),
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
});