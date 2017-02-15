const path = require('path');
const { AureliaPlugin, ModuleDependenciesPlugin } = require('aurelia-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('styles/[name].css');
module.exports = {
  entry: { 'main': 'aurelia-bootstrapper' },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },

  resolve: {
    alias: {
      'oribella-aurelia-sortable$': __dirname + '/../src/oribella-aurelia-sortable.ts',
      'oribella-aurelia-sortable': __dirname + '/../src',
    },
    extensions: ['.ts', '.js'],
    modules: ['src', 'node_modules'].map(x => path.resolve(x))
  },

  module: {
    rules: [
      { test: /\.ts$/, use: [{ loader: 'awesome-typescript-loader' }] },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      { test: /\.html$/i, use: 'html-loader' },
      {
        test: /\.css$/i, loader: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        })
      }
    ]
  },

  plugins: [
    extractCSS,
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.map$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new AureliaPlugin(),
    new ModuleDependenciesPlugin({
      'aurelia-bootstrapper': [
        'aurelia-pal-browser',
        { name: 'aurelia-framework', exports: ['Aurelia'] }
      ],
      'aurelia-framework': [
        { name: 'aurelia-history-browser', exports: ['configure'] },
        { name: 'aurelia-logging-console', exports: ['configure', 'ConsoleAppender'] },
        { name: 'aurelia-templating-binding', exports: ['configure'] },
        { name: 'aurelia-templating-resources', exports: ['configure'] },
        { name: 'aurelia-templating-router', exports: ['configure'] },
        { name: 'aurelia-event-aggregator', exports: ['configure'] },
      ],
      'aurelia-templating-router': [
        './router-view',
        './route-href',
      ],
      'aurelia-templating-resources': [
        './compose',
        './if',
        './with',
        './repeat',
        './show',
        './hide',
        './replaceable',
        './sanitize-html',
        './focus',
        './binding-mode-behaviors',
        './throttle-binding-behavior',
        './debounce-binding-behavior',
        './signal-binding-behavior',
        './update-trigger-binding-behavior',
        './attr-binding-behavior',
      ]
    })
  ],
  devtool: 'source-map'
};
