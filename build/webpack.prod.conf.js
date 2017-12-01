const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssnano = require('cssnano');
const util = require('./util');
const baseConf = require('./webpack.base.conf');

const config = merge(baseConf, {
  entry: [util.resolve('src/index.jsx')],
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
                  cssnano({
                    preset: [
                      'advanced',
                      {
                        "autoprefixer": {add: true},
                        "discardComments": {"removeAll": true}
                      }
                    ]
                  })
                ];
              }
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      })
    }]
  },
  devtool: '#source-map',
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedChunksPlugin(function (chunk) {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.mapModules(function (m) {
        path.relative(m.context, m.request)
      }).join("_");
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    new ExtractTextPlugin('css/[name]-[contenthash].css'),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: util.resolve(__dirname, 'src/static'),
        to: util.resolve(__dirname, 'dist/static'),
        ignore: ['.*']
      }
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: util.resolve("src/index.html"),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    })
  ]
});
module.exports = config;