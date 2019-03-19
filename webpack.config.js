const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (env) {
  const isDev = env.dev;
  const isProd = env.prod;

  const baseConfig = {
    context: path.resolve(__dirname, 'src'),
    entry: {
      app: './js/app.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].bundle.js',
    },
    module:  {
      rules: [
        {
          test: /\.scss$/,
          include: /src/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function() {
                  return [
                    require('autoprefixer')
                  ]
                }
              }
            },
            'sass-loader',
          ]
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/index.html'),
        hash: true,
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      })
    ]
  }

  // dev environment
  if (isDev) {
    return merge(baseConfig, {
      mode: 'development',
      devtool: 'cheap-module-eval-source-map',
      devServer: {
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase: true,
        stats: 'errors-only',
        port: 8000,
      },
      module: {
        rules: [
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
              {
                loader: 'file-loader',
                options: {
                  outputPath: 'images',
                  name: '[name].[hash].[ext]'
                }
              },
              {
                loader: 'image-webpack-loader',
              }
            ]
          },
        ]
      }
    })
  }

  if (isProd) {
    return merge(baseConfig, {
      mode: 'production',
      output: {
        publicPath: '/dist/'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            include: /src/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    debug: true,
                    targets: {
                      browsers: ['defaults']
                    }
                  }]
                ],
                plugins: ['@babel/plugin-transform-runtime']
              }
            }
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
              {
                loader: 'file-loader',
                options: {
                  outputPath: 'images',
                  name: '[name].[ext]'
                }
              },
              {
                loader: 'image-webpack-loader',
              }
            ]
          },
        ]
      },
      optimization: {
        minimizer: [
          new OptimizeCSSAssetsPlugin(),
          new UglifyJsPlugin()
        ]
      },
    })
  }
}