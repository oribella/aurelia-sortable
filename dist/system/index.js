System.register([], function (_export) {
  "use strict";

  _export("configure", configure);

  function configure(aurelia) {
    aurelia.globalizeResources("./sortable");
  }

  return {
    setters: [],
    execute: function () {}
  };
});