'use strict'

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'production')
    ? require('./webpack.prod.conf')
    : require('./webpack.dev.conf')

const proxyTable = require('./proxy.config');

const port = process.env.PORT || '3000'

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000,
    target: 'localhost:3000'
})

app.use(hotMiddleware)

// proxy api requests
// Object.keys(proxyTable).forEach(function (context) {
//     let options = proxyTable[context]
//     if (typeof options === 'string') {
//         options = { target: options }
//     }
//     app.use(proxyMiddleware(options.filter || context, options))
// })

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join('/', 'src/static')
app.use(staticPath, express.static('./static'))

const portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    portfinder.getPort((err, port) => {
        process.env.PORT = port
        const uri = 'http://localhost:' + port
        console.log('> Listening at ' + uri + '\n')
        opn(uri)
        app.listen(port)
    })
})

