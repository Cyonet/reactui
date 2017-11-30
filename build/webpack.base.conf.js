const path = require('path');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function outputPath(output) {
    return resolve('dist/' + output);
}

module.exports = {
    entry: {
        main:resolve('src/index.js')
    },
    output: {
      path: resolve("dist"),
      filename: "[name].[hash:8].js",
      chunkFilename: "[name].[chunkhash:8].js"
    },
    resolve: {
       modules: ['node_modules', 'src'],
       extensions: ['.js', '.jsx', '.json', '.less']
  },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/,
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: [resolve('src'), resolve('test')],
                use: [{
                    loader: 'bundle-loader',
                    options: {
                        lazy: true
                    }
                }, {
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.(less|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use:[
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        cssnano({
                                            preset:[
                                                'advanced',
                                                {
                                                    "autoprefixer" : {add: true},
                                                    "discardComments" : {"removeAll": true}
                                                }
                                            ]
                                        })
                                    ];
                                }
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {strictMath: true}
                        }
                    ]
                })
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