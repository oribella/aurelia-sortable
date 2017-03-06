import { FuseBox, /*EnvPlugin,*/ PostCSS, RawPlugin, HTMLPlugin, TypeScriptHelpers, SourceMapPlainJsPlugin } from 'fsbx';

const fuse = FuseBox.init({
  homeDir: './src',
  outFile: './demo/dist/bundle.js',
  cache: true,
  log: true,
  debug: false,
  sourcemaps: true,
  plugins: [
    // EnvPlugin({ FB_AU_LOG: true, FB_AU_HMR: true } as any),
    ['.css', PostCSS([require('postcss-cssnext')({})]), RawPlugin(['.css'])],
    TypeScriptHelpers(),
    SourceMapPlainJsPlugin(),
    HTMLPlugin({ useDefault: true })
  ]
});

const appModules = '**/*.{ts,html,css}';

const vendorModules = [
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
