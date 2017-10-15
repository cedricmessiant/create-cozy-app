'use strict'

const merge = require('webpack-merge')
const path = require('path')

/* PATHS, PROPS AND UTILS */

// since it's running from the app
const appConfigs = require(path.join(process.cwd(), 'app.config.js')).configs

module.exports = merge.apply(null, appConfigs)
