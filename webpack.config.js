var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("mini-css-extract-plugin");
var VueLoaderPlugin = require('vue-loader/lib/plugin')
var SaveHashes = require('assets-webpack-plugin');
var isProd = (process.env.NODE_ENV === 'production');

var config = {
  entry: {
      app:  [
              path.join(__dirname, 'public/js/app.js'),
            ]
  },
  output: {
    path: path.join(__dirname, 'public/dist/'),
    publicPath: '/dist/',
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: isProd ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js',
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          { loader: 'vue-loader' }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ExtractTextPlugin.loader, 'css-loader']
      },
    ]
  },
  devtool: 'eval-source-map',
  plugins: [
    new SaveHashes({path: path.join(__dirname, 'config')}),
    new VueLoaderPlugin(),
    new ExtractTextPlugin({publicPath: '/dist/', filename: '[name].[hash].css', allChunks: true}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}

module.exports = config