System.register([], function (_export) {
  _export("configure", configure);

  function configure(aurelia) {
    aurelia.globalizeResources("./sortable");
  }

  return {
    setters: [],
    execute: function () {
      "use strict";
    }
  };
});