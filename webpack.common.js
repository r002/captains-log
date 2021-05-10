const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.tsx',
    wattpad: './src/wattpad.tsx'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home',
      filename: 'index.html',
      template: './public/index.html',
      favicon: './public/favicon.ico',
      chunks: ['app']
    }),
    new HtmlWebpackPlugin({
      title: 'Wattpad POC',
      filename: 'wattpad.html',
      template: './public/wattpad.html',
      favicon: './public/favicon.ico',
      chunks: ['wattpad']
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, 'src')
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
  // output: {
  //   filename: '[name].bundle.js',
  //   path: path.resolve(__dirname, 'dist'),
  //   chunkFilename: '[id].[chunkhash].js',
  //   clean: true
  // }
}
