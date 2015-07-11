var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");

var expect = chai.expect;
chai.use(sinonChai);

global.sinon = sinon;
global.expect = expect;

global.document = {
  createElement: function() {
    return {
      firstChild: {
        firstElementChild: {}
      }
    };
  }
};

global.window = {};
global.self = global.document;
global.System = {};
global.Element = function Element() {};
Element.prototype = {};
global.HTMLElement = function HTMLElement() {};
HTMLElement.prototype = {};
