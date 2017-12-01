const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const util = require('./util');

const rules = {
  entry: {
    main: util.resolve('src/index.jsx')
  },
  output: {
    path: util.resolve("dist"),
    filename: "[name].[hash:8].js",
    chunkFilename: "[name].[chunkhash:8].js"
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, "src")],
    extensions: ['.js', '.jsx', '.json', '.less']
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        include: [util.resolve('src'), util.resolve('test')]
      },
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [util.resolve('src'), util.resolve('test')]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options:
            {
              minimize: false
            }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:8].[ext]'
        }
      }
    ]
  }
}

module.exports = rules;
