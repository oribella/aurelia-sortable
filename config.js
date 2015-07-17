System.config({
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "dist/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
    "aurelia-templating": "github:aurelia/templating@0.13.11",
    "babel": "npm:babel-core@5.6.17",
    "babel-runtime": "npm:babel-runtime@5.6.17",
    "core-js": "npm:core-js@0.9.18",
    "oribella/default-gestures": "github:oribella/default-gestures@master",
    "github:aurelia/binding@0.8.2": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.6.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/dependency-injection@0.9.0": {
      "aurelia-logging": "github:aurelia/logging@0.6.1",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/loader@0.8.2": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0",
      "aurelia-path": "github:aurelia/path@0.8.0",
      "core-js": "npm:core-js@0.9.18",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.6.3"
    },
    "github:aurelia/metadata@0.7.0": {
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/templating@0.13.11": {
      "aurelia-binding": "github:aurelia/binding@0.8.2",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.9.0",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-loader": "github:aurelia/loader@0.8.2",
      "aurelia-logging": "github:aurelia/logging@0.6.1",
      "aurelia-metadata": "github:aurelia/metadata@0.7.0",
      "aurelia-path": "github:aurelia/path@0.8.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.6.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:oribella/default-gestures@master": {
      "oribella-doubletap": "github:oribella/doubletap@master",
      "oribella-framework": "github:oribella/framework@master",
      "oribella-longtap": "github:oribella/longtap@master",
      "oribella-longtap-swipe": "github:oribella/longtap-swipe@master",
      "oribella-pinch": "github:oribella/pinch@master",
      "oribella-rotate": "github:oribella/rotate@master",
      "oribella-swipe": "github:oribella/swipe@master",
      "oribella-tap": "github:oribella/tap@master"
    },
    "github:oribella/doubletap@master": {
      "oribella-framework": "github:oribella/framework@master"
    },
    "github:oribella/longtap-swipe@master": {
      "oribella-framework": "github:oribella/framework@master"
    },
    "github:oribella/longtap@master": {
      "oribella-framework": "github:oribella/framework@master"
    },
    "github:oribella/pinch@master": {
      "oribella-framework": "github:oribella/framework@master"
    },
    "github:oribella/rotate@master": {
      "oribella-framework": "github:oribella/framework@master"
    },
    "github:oribella/swipe@master": {
      "oribella-framework": "github:oribella/framework@master"
    },
    "github:oribella/tap@master": {
      "oribella-framework": "github:oribella/framework@master"
    },
    "npm:babel-runtime@5.6.17": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

