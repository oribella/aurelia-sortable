var path = require( "path" );
var AureliaWebpackPlugin = require( "aurelia-webpack-plugin" );
var root = path.resolve( __dirname, "../" );

module.exports = {
  devServer: {
    host: "localhost",
    port: 9000
  },
  entry: {
    main: [
      path.resolve( root, "demo", "src", "main" )
    ]
  },
  output: {
    path: path.resolve( __dirname, "dist" ),
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      "oribella-aurelia-sortable": path.resolve( root, "src" )
    }
  },
  modulesDirectories: ["node_modules", "src"],
  plugins: [
    new AureliaWebpackPlugin({
      includeSubModules: [
        { moduleId: "oribella-aurelia-sortable" }
      ],
      root: root,
      src: path.resolve( root, "demo", "src" ),
      contextMap: {
        "oribella-aurelia-sortable": path.resolve( root, "src", "index" )
      }
    })
  ],
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel", exclude: /node_modules/, query: { presets: ["es2015-loose", "stage-1"], plugins: ["transform-decorators-legacy"] } },
      { test: /\.css?$/, loader: "style!css" },
      { test: /\.html$/, loader: "raw" },
      { test: /\.(png|gif|jpg)$/, loader: "url-loader?limit=8192" },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff2" },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
};
