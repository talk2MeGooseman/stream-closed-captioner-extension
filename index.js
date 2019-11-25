/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-global-assign */
/* eslint-disable no-restricted-syntax */
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entryPoints = {
  VideoComponent: {
    path: './src/VideoComponent.js',
    outputHtml: 'video_component.html',
    build: true,
  },
  VideoOverlay: {
    path: './src/VideoOverlay.js',
    outputHtml: 'video_overlay.html',
    build: true,
  },
  Panel: {
    path: './src/Panel.js',
    outputHtml: 'panel.html',
    build: true,
  },
  Config: {
    path: './src/Config.js',
    outputHtml: 'config.html',
    build: true,
  },
  LiveConfig: {
    path: './src/LiveConfig.js',
    outputHtml: 'live_config.html',
    build: true,
  },
  Mobile: {
    path: './src/Mobile.js',
    outputHtml: 'mobile.html',
    build: true,
  },
};

const entry = {};
const output = [];
for (name in entryPoints) {
  if (entryPoints[name].build) {
    entry[name] = entryPoints[name].path;
    output.push(new HtmlWebpackPlugin({
      inject: true,
      chunks: name,
      template: './template.html',
      filename: entryPoints[name].outputHtml,
    }));
  }
}
