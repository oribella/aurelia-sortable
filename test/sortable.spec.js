import {Container} from "aurelia-dependency-injection";
import {TemplatingEngine} from "aurelia-templating";
import {DOM} from "aurelia-pal";
import {Sortable, SortableItem, PLACEHOLDER} from "../src/sortable";
import {Drag} from "../src/drag";
import {AutoScroll} from "../src/auto-scroll";
import {oribella} from "oribella-default-gestures";

describe("Sortable", () => {
  let sandbox;
  let element;
  let sortable;
  let container;
  let templatingEngine;

  beforeEach(() => {
    container = new Container();
    element = DOM.createElement("div");
    container.registerInstance(DOM.Element, element);
    templatingEngine = container.get(TemplatingEngine);
    sortable = templatingEngine.createViewModelForUnitTest(Sortable);
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe( "Constructor", () => {

    it("should set element", () => {
      expect(sortable.element).to.be.an.instanceOf(DOM.Element);
    });

    it("should set drag", () => {
      expect(sortable.drag).to.be.an.instanceof(Drag);
    });

    it("should set autoScroll", () => {
      expect(sortable.autoScroll).to.be.an.instanceof(AutoScroll);
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

    it("should set placeholderClass", () => {
      expect(sortable.placeholderClass).to.equal("placeholder");
    });

    it("should set axis", () => {
      expect(sortable.axis).to.have.length(0);
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

  describe("`activate`", () => {
    let removeGestureFn = () => {};
    let removeScrollFn = () => {};
    let on;
    let bindScroll;
    let closest;
    let mockScroll = {};

    beforeEach(() => {
      on = sandbox.stub(oribella, "on").returns(removeGestureFn);
      bindScroll = sandbox.stub(sortable, "bindScroll").returns(removeScrollFn);
      closest = sandbox.stub(sortable, "closest").returns(mockScroll);
    });

    it("should add a oribella swipe listener", () => {
      sortable.activate();
      expect(on).to.have.been.calledWith(element, "swipe", sortable);
      expect(sortable.removeListener).to.equal(removeGestureFn);
    });

    it("should find closest scroll if a selector was bound", () => {
      sortable.scroll = "foo";
      sortable.activate();
      expect(closest).to.have.been.calledWith(element, "foo");
    });

    it("should default scroll to injected element", () => {
      sortable.activate();
      expect(sortable.scroll).to.equal(element);
    });

    it("should add a scroll listener", () => {
      sortable.activate();
      expect(bindScroll).to.have.been.calledWith(element, sinon.match.func);
      expect(sortable.removeScroll).to.equal(removeScrollFn);
    });

  });

  describe("`deactivate`", () => {

    it("should remove oribella swipe listener", () => {
      let removeListener = sandbox.stub();
      sortable.removeListener = removeListener;
      sortable.deactivate();
      expect(removeListener).to.have.been.calledWithExactly();
    });

    it("should not throw if typeof removeListener isn't a function", () => {
      sortable.removeListener = null;
      expect(sortable.deactivate.bind(sortable)).not.to.throw();
    });

    it("should remove scroll listener", () => {
      let removeScroll = sandbox.stub();
      sortable.removeScroll = removeScroll;
      sortable.deactivate();
      expect(removeScroll).to.have.been.calledWithExactly();
    });

    it("should not throw if typeof removeScroll isn't a function", () => {
      sortable.removeScroll = null;
      expect(sortable.deactivate.bind(sortable)).not.to.throw();
    });

  });

  describe("`attached`", () => {

    it("should call activate", () => {
      let activate = sandbox.stub(sortable, "activate");
      sortable.attached();
      expect(activate).to.have.been.calledWithExactly();
    });

  });

  describe("detached", () => {

    it("should call deactivate", () => {
      let deactivate = sandbox.stub(sortable, "deactivate");
      sortable.detached();
      expect(deactivate).to.have.been.calledWithExactly();
    });

  });

  describe("`bindScroll`", () => {
    let onScroll;

    beforeEach(() => {
      sandbox.stub(element, "addEventListener");
      sandbox.stub(element, "removeEventListener");
      onScroll = sandbox.stub();
    });

    it("should add scroll listener", () => {
      sortable.bindScroll(element, onScroll);
      expect(element.addEventListener).to.have.been.calledWithExactly("scroll", onScroll, false);
    });

    it("should remove scroll listener", () => {
      let removeScroll = sortable.bindScroll(element, onScroll);
      removeScroll();
      expect(element.removeEventListener).to.have.been.calledWithExactly("scroll", onScroll, false);
    });

  });

  describe("`onScroll`", () => {
    let dragUpdate;
    let getPoint;
    let tryMove;

    beforeEach(() => {
      sortable.drag.element = {};
      sortable.scroll = { scrollLeft: 0, scrollTop: 0 };
      sortable.x = 100;
      sortable.y = 200;
      sortable.axis = "foo";
      sortable.dragBoundingRect = { left: 0, top: 0, right: 100, bottom: 200 };
      dragUpdate = sandbox.stub(sortable.drag, "update");
      getPoint = sandbox.stub(sortable, "getPoint").returns({ x: 0, y: 0 });
      tryMove = sandbox.stub(sortable, "tryMove");
    });

    it("should do a quick return if not dragging", () => {
      sortable.drag.element = null;
      sortable.onScroll();
      expect(dragUpdate).to.have.callCount(0);
      expect(getPoint).to.have.callCount(0);
      expect(tryMove).to.have.callCount(0);
    });

    it("should call `drag.update`", () => {
      sortable.onScroll();
      expect(dragUpdate).to.have.been.calledWithExactly(100, 200, 0, 0, "foo", { left: 0, top: 0, right: 100, bottom: 200 });
    });

    it("should call `getPoint`", () => {
      sortable.onScroll();
      expect(getPoint).to.have.been.calledWithExactly(100, 200);
    });

    it("should call `tryMove`", () => {
      getPoint.returns({ x: 300, y: 400 });
      sortable.onScroll();
      expect(tryMove).to.have.been.calledWithExactly(300, 400, 0, 0);
    });

  });

  describe("`hide`", () => {

    it("should set display none", () => {
      let mockElement = { style: { display: "block" } };
      sortable.hide(mockElement);
      expect(mockElement.style.display).to.equal("none");
    });

    it("should reset display", () => {
      let mockElement = { style: { display: "block" } };
      let showFn = sortable.hide(mockElement);
      showFn();
      expect(mockElement.style.display).to.equal("block");
    });

  });

  describe("`getItemViewModel`", () => {

    it("should get item model", () => {
      let viewModel = {};
      let mockElement = { au: { "sortable-item": { viewModel: viewModel } } };
      expect(sortable.getItemViewModel(mockElement)).to.equal(viewModel);
    });

  });

  describe("placeholder", () => {
    let splice;
    let indexOf;
    let move;

    beforeEach(() => {
      splice = sandbox.stub(sortable.items, "splice");
      indexOf = sandbox.stub(sortable.items, "indexOf");
      move = sandbox.stub(sortable, "move");
    });

    it("should add a placeholder", () => {
      sortable.addPlaceholder(13, {});
      expect(splice).to.have.been.calledWithExactly(13, 0, sortable[PLACEHOLDER]);
    });

    it("should remove placeholder", () => {
      indexOf.returns(5);
      sortable.removePlaceholder();
      expect(splice).to.have.been.calledWithExactly(5, 1);
    });

    it("should move placeholder", () => {
      indexOf.returns(5);
      sortable.movePlaceholder(8);
      expect(move).to.have.been.calledWithExactly(5, 8);
    });

  });

  describe("`move`", () => {
    let splice;

    beforeEach(() => {
      splice = sandbox.stub(sortable.items, "splice", () => { return [5]; });
    });

    it("should move an item", () => {
      sortable.move(2, 7);
      expect(splice.getCall(0)).to.have.been.calledWithExactly(2, 1);
      expect(splice.getCall(1)).to.have.been.calledWithExactly(7, 0, 5);
    });

  });

  describe("`tryUpdate`", () => {
    let hide;
    let tryMove;
    let showFn;
    let mockElement = {};

    beforeEach(() => {
      showFn = sandbox.spy();
      hide = sandbox.stub(sortable, "hide", () => { return showFn; });
      tryMove = sandbox.stub(sortable, "tryMove");
    });

    it("should hide drag element", () => {
      sortable.drag.element = mockElement;
      sortable.tryUpdate();
      expect(hide).to.have.been.calledWithExactly(mockElement);
    });

    it("should show the drag element", () => {
      sortable.drag.element = mockElement;
      sortable.tryUpdate();
      expect(showFn).to.have.callCount(1);
    });

    it("should call `tryMove`", () => {
      sortable.tryUpdate(100, 200, 20, 30);
      expect(tryMove).to.have.been.calledWithExactly(100, 200, 20, 30);
    });

  });

  describe("`tryMove`", () => {
    let mockElement = {};
    let mockElementFromPoint = {};
    let mockSelector = "foo";
    let elementFromPoint;
    let closest;
    let getItemViewModel;
    let movePlaceholder;
    let allowMove;

    beforeEach(() => {
      mockElementFromPoint.getBoundingClientRect = sandbox.stub();
      allowMove = sandbox.stub().returns(true);
      sortable = Object.create(sortable, {
        "allowMove": {
          value: allowMove
        }
      });

      elementFromPoint = sandbox.stub(document, "elementFromPoint");
      closest = sandbox.stub(sortable, "closest");
      getItemViewModel = sandbox.stub(sortable, "getItemViewModel");
      movePlaceholder = sandbox.stub(sortable, "movePlaceholder");
    });

    it("should call `elementFromPoint`", () => {
      sortable.tryMove(100, 200);
      expect(elementFromPoint).to.have.been.calledWithExactly(100, 200);
    });

    it("should do a quick return if `elementFromPoint` returns falsy", () => {
      elementFromPoint.returns(null);
      sortable.tryMove(100, 200);
      expect(elementFromPoint).to.have.callCount(1);
      expect(closest).to.have.callCount(0);
      expect(getItemViewModel).to.have.callCount(0);
      expect(movePlaceholder).to.have.callCount(0);
    });

    it("should call `closest`", () => {
      elementFromPoint.returns(mockElementFromPoint);
      sortable.element = mockElement;
      sortable.selector = mockSelector;
      sortable.tryMove(100, 200);
      expect(closest).to.have.been.calledWithExactly(mockElementFromPoint, mockSelector, mockElement);
    });

    it("should do a quick return if `closest` returns falsy", () => {
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(null);
      sortable.tryMove(100, 200);
      expect(elementFromPoint).to.have.callCount(1);
      expect(closest).to.have.callCount(1);
      expect(getItemViewModel).to.have.callCount(0);
      expect(movePlaceholder).to.have.callCount(0);
    });

    it("should call `getItemViewModel`", () => {
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(mockElementFromPoint);
      getItemViewModel.returns({ item: {}, ctx: {} });
      sortable.tryMove(100, 200);
      expect(getItemViewModel).to.have.been.calledWithExactly(mockElementFromPoint);
    });

    it("should call `allowMove`", () => {
      let item = {};
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(mockElementFromPoint);
      getItemViewModel.returns({ item: item, ctx: {} });
      sortable.tryMove(100, 200);
      expect(allowMove).to.have.been.calledWithExactly({ item: item });
    });

    it("should call `movePlaceholder` if `allowMove` is truthy", () => {
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(mockElementFromPoint);
      getItemViewModel.returns({ item: {}, ctx: { $index: 13 } });
      sortable.tryMove(100, 200);
      expect(movePlaceholder).to.have.been.calledWithExactly(13);
    });

    it("should not call `movePlaceholder` if `allowMove` is falsy", () => {
      allowMove.returns(false);
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(mockElementFromPoint);
      getItemViewModel.returns({ item: {}, ctx: { $index: 13 } });
      sortable.tryMove(100, 200);
      expect(movePlaceholder).to.have.callCount(0);
    });

  });

  describe("`getPoint`", () => {
    let boundingRect = { left: 5, top: 10, right: 75, bottom: 100 };
    let dragCenterX;
    let dragCenterY;

    beforeEach(() => {
      sortable = Object.create(sortable, {
        "axis": {
          value: "",
          writable: true
        },
        "boundingRect": {
          value: boundingRect,
          writable: true
        }
      });
      dragCenterX = sandbox.stub(sortable.drag, "getCenterX");
      dragCenterY = sandbox.stub(sortable.drag, "getCenterY");
    });

    it("should call `drag.getCenterX`", () => {
      sortable.axis = "y";
      sortable.getPoint();
      expect(dragCenterX).to.have.been.calledWithExactly();
    });

    it("should call `drag.getCenterY`", () => {
      sortable.axis = "x";
      sortable.getPoint();
      expect(dragCenterY).to.have.been.calledWithExactly();
    });

  });

  describe("`down`", () => {
    let allowDrag;
    let getItemViewModel;
    let event = {};
    let item = {};

    beforeEach(() => {
      allowDrag = sandbox.stub().returns(true);
      sortable = Object.create(sortable, {
        "allowDrag": {
          value: allowDrag,
          writable: true
        }
      });
      getItemViewModel = sandbox.stub(sortable, "getItemViewModel");
      getItemViewModel.returns({ item: item });
      event.preventDefault = sandbox.spy();
    });

    it("should call `allowDrag`", () => {
      getItemViewModel.returns({ item: item });
      expect(sortable.down(event, null, null)).to.be.an("undefined");
      expect(allowDrag).to.have.been.calledWithExactly({ event: event, item: item});
    });

    it("should call `preventDefault` if `allowDrag` is truthy", () => {
      sortable.down(event, null, null);
      expect(event.preventDefault).to.have.been.calledWithExactly();
    });

    it("should return falsy if `allowDrag` is falsy", () => {
      allowDrag.returns(false);
      expect(sortable.down()).to.equal(false);
    });

  });

  describe("`start`", () => {
    let x;
    let y;
    //let element;
    let scroll;
    //let boundingRect;
    let placeholder;
    let scrollSpeed;
    let scrollSensitivity;
    let getItemViewModel;
    let addPlaceholder;
    let item = {};
    let ctx = {};
    let dragStart;
    let autoScrollStart;

    beforeEach(() => {
      x = 10;
      y = 20;
      //boundingRect = { left: 10, top: 20, right: 30, bottom: 40 };
      element = { getBoundingClientRect: sandbox.stub().returns({}), contains: sandbox.stub().returns(false) };
      scroll = { scrollLeft: 0, scrollTop: 0, getBoundingClientRect: sandbox.stub().returns({}), contains: sandbox.stub().returns(false) };
      placeholder = {};
      scrollSpeed = 99;
      scrollSensitivity = 66;
      sortable = Object.create(sortable, {
        "element": {
          value: element,
          writable: true
        },
        "scroll": {
          value: scroll,
          writable: true
        },
        "axis": {
          value: "foo",
          writable: true
        },
        "dragZIndex": {
          value: -1,
          writable: true
        },
        "placeholder": {
          value: placeholder,
          writable: true
        },
        "scrollSpeed": {
          value: scrollSpeed,
          writable: true
        },
        "scrollSensitivity": {
          value: scrollSensitivity,
          writable: true
        }
      });
      getItemViewModel = sandbox.stub(sortable, "getItemViewModel");
      getItemViewModel.returns({ item: item, ctx: ctx });
      dragStart = sandbox.stub(sortable.drag, "start");
      autoScrollStart = sandbox.stub(sortable.autoScroll, "start");
      addPlaceholder = sandbox.stub(sortable, "addPlaceholder");
    });

    it("should set `x`", () => {
      sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, {});
      expect(sortable.x).to.equal(x);
    });

    it("should set `y`", () => {
      sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, {});
      expect(sortable.y).to.equal(y);
    });

    it("should set `scrollRect`", () => {
      scroll.getBoundingClientRect.returns( { left: 5, top: 6, bottom: 7, right: 8, width: 9, height: 10 });
      sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, {});
      expect(sortable.scrollRect).to.deep.equal({ left: 5, top: 6, bottom: 7, right: 8, width: 9, height: 10 });
    });

    describe("`boundingRect`", () => {

      // it("should set `boundingRect`", () => {
      //   sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, {});
      //   expect(sortable.boundingRect).to.equal(boundingRect);
      // });

      // it("should set default `boundingRect`", () => {
      //   sortable.boundingRect = null;
      //   sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, {});
      //   expect(sortable.boundingRect).to.deep.equal({
      //     left: sortable.scrollRect.left + 5,
      //     top: sortable.scrollRect.top + 5,
      //     right: sortable.scrollRect.right - 5,
      //     bottom: sortable.scrollRect.bottom - 5
      //   });
      // });

    });

    it("should call `drag.start`", () => {
      sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, element);
      expect(dragStart).to.have.been.calledWithExactly(element, 10, 20, false, false, scroll.scrollLeft, scroll.scrollTop, -1, "foo", sinon.match.object);
    });

    it("should call `autoScroll.start`", () => {
      sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, {});
      expect(autoScrollStart).to.have.been.calledWithExactly(scrollSpeed);
    });

    it("should set `fromIx`", () => {
      getItemViewModel.returns( { ctx: { $index: 13 } });
      sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, {});
      expect(sortable.fromIx).to.equal(13);
    });

    it("should set `toIx`", () => {
      sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, {});
      expect(sortable.toIx).to.equal(-1);
    });

    it("should call `addPlaceholder`", () => {
      getItemViewModel.returns( { ctx: { $index: 13 }, item: { foo: {} }});
      sortable.start({}, { pointers: [{ client: { x: x, y: y }}] }, {});
      expect(addPlaceholder).to.have.been.calledWithExactly(13, { foo: {} });
    });

  });

  describe("`update`", () => {
    let x;
    let y;
    let scroll;
    let scrollRect;
    let axis;
    let boundingRect;
    let dragBoundingRect;
    let dragUpdate;
    let getPoint;
    let tryUpdate;
    let autoScrollUpdate;

    beforeEach(() => {
      x = 10;
      y = 20;
      scroll = { scrollLeft: 0, scrollTop: 0 };
      scrollRect = {};
      axis = "foo";
      boundingRect = { left: 0, top: 100, bottom: 150, right: 75 };
      dragBoundingRect = { left: 0, top: 100, bottom: 200, right: 300 };
      dragUpdate = sandbox.stub(sortable.drag, "update");
      getPoint = sandbox.stub(sortable, "getPoint").returns( { x: x, y: y });
      tryUpdate = sandbox.stub(sortable, "tryUpdate");
      autoScrollUpdate = sandbox.stub(sortable.autoScroll, "update");
      sortable = Object.create(sortable, {
        "scroll": {
          value: scroll,
          writable: true
        },
        "scrollRect": {
          value: scrollRect,
          writable: true
        },
        "axis": {
          value: axis,
          writable: true
        },
        "boundingRect": {
          value: boundingRect,
          writable: true
        },
        "dragBoundingRect": {
          value: dragBoundingRect,
          writable: true
        }
      });
    });

    it("should set `x`", () => {
      sortable.update({}, { pointers: [{ client: { x: x, y: y }}] });
      expect(sortable.x).to.equal(10);
    });

    it("should set `y`", () => {
      sortable.update({}, { pointers: [{ client: { x: x, y: y }}] });
      expect(sortable.y).to.equal(20);
    });

    it("should call `drag.update`", () => {
      sortable.update({}, { pointers: [{ client: { x: x, y: y }}] });
      expect(dragUpdate).to.have.been.calledWithExactly(x, y, scroll.scrollLeft, scroll.scrollTop, axis, sinon.match.object);
    });

    it("should call `getPoint`", () => {
      sortable.update({}, { pointers: [{ client: { x: x, y: y }}] });
      expect(getPoint).to.have.been.calledWithExactly(x, y);
    });

    it("should call `tryUpdate`", () => {
      x = 3;
      y = 6;
      getPoint.returns( { x: x, y: y });
      sortable.update({}, { pointers: [{ client: { x: x, y: y }}] });
      expect(tryUpdate).to.have.been.calledWithExactly(x, y, scroll.scrollLeft, scroll.scrollTop);
    });

    it.skip("should call `autoScroll.update`", () => {
      x = 12;
      y = 24;
      sortable.scrollWidth = 0;
      sortable.scrollHeight = 0;
      getPoint.returns( { x: x, y: y });
      sortable.update({}, { pointers: [{ client: { x: x, y: y }}] });
      expect(autoScrollUpdate).to.have.been.calledWithExactly(scroll, x, y, 0, 0, scrollRect);
    });

  });

  describe("`end`", () => {
    let indexOf;
    let move;
    let dragEnd;
    let autoScrollEnd;
    let removePlaceholder;
    let moved;
    let fromIx;
    let toIx;

    beforeEach(() => {
      indexOf = sandbox.stub(sortable.items, "indexOf");
      move = sandbox.stub(sortable, "move");
      dragEnd = sandbox.stub(sortable.drag, "end");
      autoScrollEnd = sandbox.stub(sortable.autoScroll, "end");
      removePlaceholder = sandbox.stub(sortable, "removePlaceholder");
      moved = sandbox.stub();
      sortable = Object.create(sortable, {
        "moved": {
          value: moved,
          writable: true
        }
      });
    });

    it("should do a quick return if `placeholder` can't be found", () => {
      indexOf.returns(-1);
      sortable.end();
      expect(move).to.have.callCount(0);
      expect(dragEnd).to.have.callCount(0);
      expect(autoScrollEnd).to.have.callCount(0);
      expect(removePlaceholder).to.have.callCount(0);
      expect(moved).to.have.callCount(0);
    });

    describe("`toIx`", () => {

      it("should set `toIx` to indexOf `placeholder` if `fromIx` is greater than `toIx`", () => {
        fromIx = 2;
        sortable.fromIx = fromIx;
        toIx = 1;
        indexOf.returns(toIx);
        sortable.end();
        expect(sortable.toIx).to.equal(toIx);
      });

      it("should set `toIx` to indexOf `placeholder` - 1 if `fromIx` is less than `toIx`", () => {
        fromIx = 4;
        sortable.fromIx = fromIx;
        toIx = 6;
        indexOf.returns(toIx);
        sortable.end();
        expect(sortable.toIx).to.equal(toIx - 1);
      });

    });

    describe("`move`", () => {

      it("should call `move` with `fromIx` + 1 if `toIx` less than `fromIx`", () => {
        fromIx = 2;
        sortable.fromIx = fromIx;
        toIx = 1;
        indexOf.returns(toIx);
        sortable.end();
        expect(move).to.have.been.calledWithExactly(fromIx + 1, toIx);
      });

      it("should call `move` with `fromIx` if `toIx` greater than `fromIx`", () => {
        fromIx = 2;
        sortable.fromIx = fromIx;
        toIx = 3;
        indexOf.returns(toIx);
        sortable.end();
        expect(move).to.have.been.calledWithExactly(fromIx, toIx);
      });

    });

    it("should call `drag.end`", () => {
      sortable.end();
      expect(dragEnd).to.have.been.calledWithExactly();
    });

    it("should call `autoScroll.end`", () => {
      sortable.end();
      expect(autoScrollEnd).to.have.been.calledWithExactly();
    });

    it("should call `removePlaceholder`", () => {
      sortable.end();
      expect(removePlaceholder).to.have.been.calledWithExactly();
    });

    it("should call `moved`", () => {
      fromIx = 2;
      sortable.fromIx = fromIx;
      toIx = 1;
      indexOf.returns(toIx);
      sortable.end();
      expect(moved).to.have.been.calledWithExactly( {
        fromIx: fromIx,
        toIx: toIx
      });

    });
  });

  describe("`cancel`", () => {
    let dragEnd;
    let autoScrollEnd;
    let removePlaceholder;

    beforeEach(() => {
      dragEnd = sandbox.stub(sortable.drag, "end");
      autoScrollEnd = sandbox.stub(sortable.autoScroll, "end");
      removePlaceholder = sandbox.stub(sortable, "removePlaceholder");
    });

    it("should call `drag.end`", () => {
      sortable.cancel();
      expect(dragEnd).to.have.been.calledWithExactly();
    });

    it("should call `autoScroll.end`", () => {
      sortable.cancel();
      expect(autoScrollEnd).to.have.been.calledWithExactly();
    });

    it("should call `removePlaceholder`", () => {
      sortable.cancel();
      expect(removePlaceholder).to.have.been.calledWithExactly();
    });

  });

  describe("SortableItem", () => {
    let sortableItem;

    beforeEach(() => {
      sortableItem = templatingEngine.createViewModelForUnitTest(SortableItem);
    });

    it("should set `ctx`", () => {
      let overrideCtx = {};
      sortableItem.bind({}, overrideCtx);
      expect(sortableItem.ctx).to.equal(overrideCtx);
    });

  });

});
