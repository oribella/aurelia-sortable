import {Loader as loader} from "jspm";
let System = loader();

describe("Sortable", () => {
  let Sortable;
  let sortable;
  let templatingEngine;
  let mockElement = {};

  before(() => {
    return System.import("aurelia-pal").then(pal => {
      pal.initializePAL((platform, feature, dom) => {
        dom.Element = mockElement;
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
          Sortable = mod.Sortable;
        });
      });
    });
  });

  beforeEach(() => {
    sortable = templatingEngine.createModelForUnitTest(Sortable);
  });

  describe( "Constructor", () => {

    it("should set element", () => {
      expect(sortable.element).to.be.equal(mockElement);
    });

    it("should set selector", () => {
      expect(sortable.selector).to.equal("[sortable-item]");
    });

    it("should set fromIx", () => {
      expect(sortable.fromIx).to.equal(-1);
    });

    it("should set toIx", () => {
      expect(sortable.toIx).to.equal(-1);
    });

  });

  describe( "Defaults", () =>{

    it("should set scroll speed", () => {
      expect(sortable.scrollSpeed).to.equal(10);
    });

    it("should set scroll sensitivity", () => {
      expect(sortable.scrollSensitivity).to.equal(10);
    });

    it("should set items", () => {
      expect(sortable.items).to.have.length(0);
    });

    it("should set placeholder", () => {
      expect(sortable.placeholder).to.deep.equal({ placeholderClass: "placeholder", style: {} });
    });

    it("should set axis", () => {
      expect(sortable.axis).to.have.length(0);
    });

    it("should have a bounding rect", () => {
      expect(sortable.boundingRect).to.be.a("null");
    })

    it("should have a moved function", () => {
      expect(sortable.moved).to.be.a("function");
    });

    it("should set dragZIndex", () => {
      expect(sortable.dragZIndex).to.equal(1);
    });

    it("should set disallowedDragTagNames", () => {
      expect(sortable.disallowedDragTagNames).to.deep.equal(["INPUT", "SELECT", "TEXTAREA"]);
    });

    it("should have a allowDrag function", () => {
      expect(sortable.allowDrag).to.be.a("function");
    });

    it("should have a allowMove function", () => {
      expect(sortable.allowMove).to.be.a("function");
    });

  });

});
