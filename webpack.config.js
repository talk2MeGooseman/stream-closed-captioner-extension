/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-global-assign */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, 'dist/');

module.exports = (_env, argv) => {
  const entryPoints = {
    VideoComponent: {
      path: '@/views/VideoComponent.js',
      outputHtml: 'video_component.html',
      build: false,
    },
    VideoOverlay: {
      path: '@/views/VideoOverlay.js',
      outputHtml: 'video_overlay.html',
      build: true,
    },
    Panel: {
      path: '@/views/Panel.js',
      outputHtml: 'panel.html',
      build: false,
    },
    Config: {
      path: '@/views/Config.js',
      outputHtml: 'config.html',
      build: true,
    },
    LiveConfig: {
      path: '@/views/LiveConfig.js',
      outputHtml: 'live_config.html',
      build: true,
    },
    Mobile: {
      path: '@/views/Mobile.js',
      outputHtml: 'mobile.html',
      build: true,
    },
  };

  const entry = {};

  // edit webpack plugins here!
  const plugins = [new CleanWebpackPlugin(['dist']), new webpack.HotModuleReplacementPlugin()];

  for (name in entryPoints) {
    if (entryPoints[name].build) {
      entry[name] = entryPoints[name].path;
      if (argv.mode === 'production') {
        plugins.push(
          new HtmlWebpackPlugin({
            inject: true,
            chunks: [name],
            template: './template.html',
            filename: entryPoints[name].outputHtml,
          }),
        );
      }
    }
  }

  const config = {
    // entry points for webpack- remove if not used/needed
    entry,
    optimization: {
      minimize: false, // neccessary to pass Twitch's review process
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.mjs'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
    output: {
      filename: '[name].bundle.js',
      path: bundlePath,
    },
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 500,
    },
    plugins,
  };
  if (argv.mode === 'development') {
    config.devServer = {
      contentBase: path.join(__dirname, 'public'),
      host: argv.devrig ? 'localhost.rig.twitch.tv' : '0.0.0.0',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      disableHostCheck: true,
      port: 8080,
    };
    if (fs.existsSync(path.resolve(__dirname, 'conf/server.key'))) {
      config.devServer.https = {
        key: fs.readFileSync(path.resolve(__dirname, 'conf/server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'conf/server.crt')),
      };
    }
  }

  return config;
};
