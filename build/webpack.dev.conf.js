const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const baseConf = require('./webpack.base.conf');
const CSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(baseConf, {
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({filename: '[name].[contenthash:8].css', allChunks: true}),
        new CSSplitWebpackPlugin({size: 4000}),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve("src/index.html"),
            inject: true
        }),
        new FriendlyErrorsPlugin()
    ]
});