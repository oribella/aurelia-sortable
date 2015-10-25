import {Loader as loader} from "jspm";
let System = loader();

describe("Sortable", () => {
  let Sortable;
  let sortable;
  let templatingEngine;
  let MockElement = () => {};

  before(() => {
    return System.import("aurelia-pal").then(pal => {
      pal.initializePAL((platform, feature, dom) => {
        dom.Element = MockElement;
        dom.createMutationObserver = function() { return { observe(){} }; };
        dom.createElement = function() {
          return {
            firstChild: {
              firstElementChild: {}
            }
          };
        };
        dom.createTextNode = function() { return {}; };
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
      expect(sortable.element).to.be.an("object");
    });

    it("should set drag", () => {
      return System.import("./src/drag").then(mod => {
        expect(sortable.drag).to.be.an.instanceof(mod.Drag);
      });
    });

    it("should set autoScroll", () => {
      return System.import("./src/auto-scroll").then(mod => {
        expect(sortable.autoScroll).to.be.an.instanceof(mod.AutoScroll);
      });
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
    });

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

  describe("activate", () => {
    let sandbox;
    let oribella;
    let removeGestureFn = () => {};
    let removeScrollFn = () => {};
    let on;
    let bindScroll;
    let closest;
    let mockElement = {};
    let mockScroll = {};

    before(() => {
      return System.import("oribella-default-gestures").then(mod => {
        oribella = mod.oribella;
      });
    });

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      sortable.element = mockElement;
      on = sandbox.stub(oribella, "on").returns(removeGestureFn);
      bindScroll = sandbox.stub(sortable, "bindScroll").returns(removeScrollFn);
      closest = sandbox.stub(sortable, "closest").returns(mockScroll);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should add a oribella swipe listener", () => {
      sortable.activate();
      expect(on).to.have.been.calledWith({}, "swipe", sortable);
      expect(sortable.removeListener).to.equal(removeGestureFn);
    });

    it("should find closest scroll if a selector was bound", () => {
      sortable.scroll = "foo";
      sortable.activate();
      expect(closest).to.have.been.calledWith(mockElement, "foo");
    });

    it("should default scroll to injected element", () => {
      sortable.activate();
      expect(sortable.scroll).to.equal(mockElement);
    });

    it("should add a scroll listener", () => {
      sortable.activate();
      expect(bindScroll).to.have.been.calledWith(mockElement, sinon.match.func);
      expect(sortable.removeScroll).to.equal(removeScrollFn);
    });

  });

});
