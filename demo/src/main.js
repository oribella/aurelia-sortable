export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .feature("oribella-aurelia-sortable")
    .feature("features/document-scroll");

  aurelia.start().then(a => a.setRoot());
}
