export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .feature("oribella-aurelia-sortable")
    .feature("features/parent-scroll")
    .feature("features/document-scroll")
    .feature("features/sortable-scroll");

  aurelia.start().then(a => a.setRoot());
}
