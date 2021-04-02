const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  // mode: 'production'
  mode: 'development',
  devtool: 'inline-source-map'
})
