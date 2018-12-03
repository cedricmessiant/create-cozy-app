'use strict'

const fs = require('fs-extra')
const paths = require('../utils/paths')
const webpack = require('webpack')
const CTS = require('../utils/constants.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const { production, isDebugMode } = require('./webpack.vars')
const manifest = fs.readJsonSync(paths.appManifest())

const appName = manifest.name_prefix
  ? `${manifest.name_prefix} ${manifest.name}`
  : manifest.name

module.exports = {
  entry: {
    app: [
      // polyfills, avaid to import it in the application
      require.resolve('babel-polyfill'),
      // Exposed variables in global scope (needed for cozy-bar)
      process.env[CTS.USE_PREACT]
        ? paths.csPreactExposer()
        : paths.csReactExposer(),
      // since the file extension depends on the framework here
      // we get it from a function call
      paths.appMobileIndex()
    ]
  },
  output: {
    path: paths.appMobileWWW(),
    pathinfo: isDebugMode
  },
  plugins: [
    new webpack.DefinePlugin({
      __ALLOW_HTTP__: !production,
      __TARGET__: JSON.stringify('mobile'),
      __APP_VERSION__: JSON.stringify(manifest.version)
    }),
    new webpack.ProvidePlugin({
      'cozy.client': production
        ? 'cozy-client-js/dist/cozy-client.min.js'
        : 'cozy-client-js/dist/cozy-client.js',
      'cozy.bar': production
        ? 'cozy-bar/dist/cozy-bar.mobile.min.js'
        : 'cozy-bar/dist/cozy-bar.mobile.js'
    }),
    new HtmlWebpackPlugin({
      template: paths.appMobileHtmlTemplate(),
      title: appName,
      excludeChunks: ['intents'],
      inject: 'head',
      minify: {
        collapseWhitespace: true
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    })
  ]
}
