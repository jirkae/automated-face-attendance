'use strict'
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  
  entry: {
    index: ['babel-polyfill', './src/app.js']
  },
  devServer: {
    hot: true,
    watchOptions: {
      poll: true
    }
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      { from: 'weights', to: 'weights' },
      { from: 'mock', to: 'mock' }
    ])
  ]
}