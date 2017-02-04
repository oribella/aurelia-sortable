module.exports = {
  entry: ['./src/oribella-aurelia-sortable', './src/sortable'],
  output: {
    library: 'oribella-aurelia-sortable',
    libraryTarget: 'amd',
    filename: './dist/oribella-aurelia-sortable.js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      { test: /\.ts$/, use: [{ loader: 'awesome-typescript-loader', query: { configFileName: './tsconfig.build.json' } }] },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  devtool: 'source-map'
};
