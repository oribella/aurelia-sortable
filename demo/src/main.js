import {bootstrap} from "aurelia-bootstrapper-webpack";
import "../../node_modules/font-awesome/css/font-awesome.css";
import "../index.css";

bootstrap( aurelia => {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .feature("features/document-scroll")
    .feature("features/parent-scroll")
    .feature("features/sortable-scroll")
    .feature("features/mdl")
    .plugin("oribella-aurelia-sortable");

  aurelia.start().then(a => a.setRoot("app", document.body));
} );
