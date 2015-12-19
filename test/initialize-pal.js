import {initializePAL} from "aurelia-pal";
global.document = {
  elementFromPoint: () => {}
};
global.MockElement = function() {
  this.firstChild = {
    firstElementChild: {}
  };
  this.addEventListener = () => {};
  this.removeEventListener = () => {};
};
initializePAL((platform, feature, dom) => {
  dom.Element = global.MockElement;
  dom.createMutationObserver = function() { return { observe(){} }; };
  dom.createElement = function() {
    return new global.MockElement();
  };
  dom.createTextNode = function() { return {}; };
});
