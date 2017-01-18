module.exports = {
  entry: './src/oribella-aurelia-sortable.ts',
  output: {
    library: 'oribella-aurelia-sortable',
    libraryTarget: 'amd',
    filename: './dist/oribella-aurelia-sortable.js'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      { test: /\.ts$/, use: [{ loader: 'awesome-typescript-loader' }] },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  devtool: 'source-map'
};
