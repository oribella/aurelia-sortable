"use strict";

System.register([], function (_export) {
  return {
    setters: [],
    execute: function () {
      function configure(config) {
        config.globalResources("./sortable");
      }

      _export("configure", configure);
    }
  };
});