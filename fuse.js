const { FuseBox, EnvPlugin, PostCSS, CSSPlugin, HTMLPlugin, TypeScriptHelpers, SourceMapPlainJsPlugin } = require('fsbx');

let fuse = FuseBox.init({
  homeDir: "./src",
  outFile: "./demo/dist/bundle.js",
  cache: true,
  log: true,
  debug: false,
  sourceMap: {
    bundleReference: './bundle.js.map',
    outFile: './demo/dist/bundle.js.map',
  },
  plugins: [
    EnvPlugin({ FUSEBOX_AURELIA_LOADER_LOGGING: true, FUSEBOX_AURELIA_LOADER_HMR: true }),
    [PostCSS([require('postcss-cssnext')({})]), CSSPlugin()],
    HTMLPlugin({ useDefault: true }),
    TypeScriptHelpers(),
    SourceMapPlainJsPlugin()
  ]
});

let appModules = '**/*.{ts,html,css}';

let vendorModules = [
  'aurelia-hot-module-reload',
  'aurelia-bootstrapper',
  'aurelia-pal-browser',
  'aurelia-framework',
  'aurelia-logging-console',
  'aurelia-templating-binding',
  'aurelia-history-browser',
  'aurelia-templating-resources',
  'aurelia-templating-router',
];

fuse.devServer(`
  > demo/main.ts
  + ${appModules}
  + ${vendorModules.join(' + ')}`,
  {
    root: './demo',
    port: 8080
  });
