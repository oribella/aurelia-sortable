"use strict";

define(["exports"], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  function configure(config) {
    config.globalResources("./sortable");
  }
});