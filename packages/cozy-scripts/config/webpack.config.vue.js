'use strict'

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CTS = require('../utils/constants.js')

process.env[CTS.USE_VUE] = true

module.exports = {
  resolve: {
    extensions: ['.vue']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: require.resolve('vue-loader')
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
}
