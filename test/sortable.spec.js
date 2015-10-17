import {Loader as loader} from "jspm";
let System = loader();

describe("Sortable", () => {
  let Sortable;
  let sortable;
  let templatingEngine;

  before(() => {
    return System.import("aurelia-pal").then(pal => {
      pal.initializePAL((platform, feature, dom) => {
        dom.Element = {};
        dom.createMutationObserver = function() { return { observe(){} }; };
        dom.createElement = function() {
          return {
            firstChild: {
              firstElementChild: {}
            }
          };
        };
        dom.createTextNode = function() {};
      });
      return System.import("aurelia-templating").then(tmpl => {
        templatingEngine = tmpl.templatingEngine;
        templatingEngine.initialize();
        return System.import("./src/sortable").then(mod => {
          console.log("sortable");
          Sortable = mod.Sortable;
        });
      });
    });
  });

  beforeEach(() => {
    sortable = templatingEngine.createModelForUnitTest(Sortable);
  });

  it("should set default scroll speed", () => {
    expect(sortable.scrollSpeed).to.equal(10);
  });

  it("should set default scroll sensitivity", () => {
    expect(sortable.scrollSensitivity).to.equal(10);
  });

  it("should set default items", () => {
    expect(sortable.items).to.have.length(0);
  });

  it("should set default placeholder", () => {
    expect(sortable.placeholder).to.deep.equal({ placeholderClass: "placeholder", style: {} });
  });

  it("should set default axis", () => {
    expect(sortable.axis).to.have.length(0);
  });

  it("should have a default moved function", () => {
    expect(sortable.moved).to.be.a("function");
  });

  it("should have a default allowDrag function", () => {
    expect(sortable.allowDrag).to.be.a("function");
  });

  it("should have a default allowMove function", () => {
    expect(sortable.allowMove).to.be.a("function");
  });

});
