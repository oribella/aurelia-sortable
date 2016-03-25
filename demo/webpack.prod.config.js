var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var AureliaWebpackPlugin = require("aurelia-webpack-plugin");
var pkg = require("../package.json");

var root = path.resolve( __dirname, "../" );
var outputFileTemplateSuffix = "-" + pkg.version;

module.exports = {
  entry: {
    main: [
      path.resolve( root, "demo", "src", "main" )
    ]
  },
  output: {
    path: path.resolve( __dirname, "dist" ),
    filename: "[name]" + outputFileTemplateSuffix + ".js",
    chunkFilename: "[id]" + outputFileTemplateSuffix + ".js"
  },
  resolve: {
    alias: {
      "oribella-aurelia-sortable": path.resolve( root, "src" )
    },
    extensions: ["", ".js"]
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
    }),
    new HtmlWebpackPlugin({
      title: "Oribella Aurelia sortable - " + pkg.version,
      template: "index.prod.html",
      filename: "index.html"
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
