import {DOM} from "aurelia-pal";
import {customAttribute, bindable} from "aurelia-templating";
import {inject, transient} from "aurelia-dependency-injection";
import {oribella, matchesSelector} from "oribella-default-gestures";
import {Drag} from "./drag";
import {AutoScroll} from "./auto-scroll";

@customAttribute("sortable")
@inject(DOM.Element, Drag, AutoScroll)
@transient()
export class Sortable {

  @bindable scroll = null;
  @bindable scrollSpeed = 10;
  @bindable scrollSensitivity = 10;
  @bindable items = [];
  @bindable placeholder = { placeholderClass: "placeholder", style: {} };
  @bindable axis = "";
  @bindable boundingRect = null; //{ left, top, right, bottom }
  @bindable moved = () => {};
  @bindable dragZIndex = 1;
  @bindable disallowedDragTagNames = ["INPUT", "SELECT", "TEXTAREA"];
  @bindable allowDrag = args => {
    if(this.disallowedDragTagNames.indexOf(args.event.target.tagName) !== -1) {
      return false;
    }
    if(args.event.target.isContentEditable) {
      return false;
    }
    return true;
  };
  @bindable allowMove = () => { return true; };

  selector = "[sortable-item]";
  fromIx = -1;
  toIx = -1;
  pageX = 0;
  pageY = 0;
  scrollRect = { left: 0, top: 0, width: 0, height: 0 };

  constructor(element, drag, autoScroll) {
    this.element = element;
    this.drag = drag;
    this.autoScroll = autoScroll;
  }
  activate() {
    this.removeListener = oribella.on(this.element, "swipe", this);
    if(typeof this.scroll === "string") {
      this.scroll = this.closest(this.element, this.scroll);
    }
    if(!(this.scroll instanceof DOM.Element)) {
      this.scroll = this.element;
    }
    this.removeScroll = this.bindScroll(this.scroll, this.onScroll.bind(this));
  }
  deactivate() {
    if(typeof this.removeListener === "function") {
      this.removeListener();
    }
    if(typeof this.removeScroll === "function") {
      this.removeScroll();
    }
  }
  attached() {
    this.activate();
  }
  detached() {
    this.deactivate();
  }
  bindScroll(scroll, fn) {
    scroll.addEventListener("scroll", fn, false);
    return () => {
      scroll.removeEventListener("scroll", fn, false);
    };
  }
  onScroll() {
    if(!this.drag.element) {
      return;
    }
    this.drag.update(this.pageX, this.pageY, this.scroll, this.axis);
    let { x, y } = this.getCoordinate(this.pageX, this.pageY);
    this.tryMove(x, y);
  }
  hide(element) {
    let display = element.style.display;
    element.style.display = "none";
    return () => {
      element.style.display = display;
    };
  }
  closest(element, selector, rootElement = document) {
    var valid = false;
    while (!valid && element !== null && element !== rootElement &&
      element !== document) {
      valid = matchesSelector(element, selector);
      if (valid) {
        break;
      }
      element = element.parentNode;
    }
    return valid ? element : null;
  }
  getItemModel(element) {
    return element.au["sortable-item"].model;
  }
  addPlaceholder(toIx) {
    this.items.splice(toIx, 0, this.placeholder);
  }
  removePlaceholder() {
    var ix = this.items.indexOf(this.placeholder);
    if (ix !== -1) {
      this.items.splice(ix, 1);
    }
  }
  movePlaceholder(toIx) {
    var fromIx = this.items.indexOf(this.placeholder);
    this.move(fromIx, toIx);
  }
  move(fromIx, toIx) {
    if(fromIx !== -1 && toIx !== -1 && fromIx !== toIx) {
      this.items.splice(toIx, 0, this.items.splice(fromIx, 1)[0]);
    }
  }
  tryUpdate(pageX, pageY) {
    let showFn = this.hide(this.drag.element);
    this.tryMove(pageX, pageY);
    showFn();
  }
  tryMove(x, y, doc = document) {
    let element = doc.elementFromPoint(x, y);
    if(!element) {
      return;
    }
    element = this.closest(element, this.selector, this.element);
    if(element) {
      let model = this.getItemModel(element);
      if(!this.allowMove({ item: model.item })) {
        return;
      }
      var ix = model.ctx.$index;
      this.movePlaceholder(ix);
    }
  }
  getCoordinate(pageX, pageY) {
    switch (this.axis) {
    case "x":
      pageY = this.drag.getCenterY();
      break;
    case "y":
      pageX = this.drag.getCenterX();
      break;
    default:
      break;
    }
    return {
      x: Math.max(this.boundingRect.left, Math.min(this.boundingRect.right, pageX)),
      y: Math.max(this.boundingRect.top, Math.min(this.boundingRect.bottom, pageY))
    };
  }
  down(e, data, element) {
    if(this.allowDrag({ event: e, item: this.getItemModel(element).item })) {
      e.preventDefault();
      return undefined;
    }
    return false;
  }
  start(e, data, element) {
    this.pageX = data.pagePoints[0].x;
    this.pageY = data.pagePoints[0].y;
    this.scrollRect = this.scroll.getBoundingClientRect();
    this.boundingRect = this.boundingRect || { left: this.scrollRect.left + 5, top: this.scrollRect.top + 5, right: this.scrollRect.right - 5, bottom: this.scrollRect.bottom - 5 };
    this.drag.start(element, this.pageX, this.pageY, this.scroll, this.dragZIndex, this.placeholder, this.axis);
    this.autoScroll.start(this.axis, this.scrollSpeed, this.scrollSensitivity);
    this.fromIx = this.getItemModel(element).ctx.$index;
    this.toIx = -1;
    this.addPlaceholder(this.fromIx);
  }
  update(e, data) {
    let p = data.pagePoints[0];
    let pageX = (this.pageX = p.x);
    let pageY = (this.pageY = p.y);

    this.drag.update(pageX, pageY, this.scroll, this.axis);
    let { x, y } = this.getCoordinate(pageX, pageY);
    this.tryUpdate(x, y);
    this.autoScroll.update(this.scroll, x, y, this.scrollRect);
  }
  end() {
    this.stop();
  }
  cancel() {
    this.drag.end();
    this.autoScroll.stop();
    this.removePlaceholder();
  }
  stop() {
    this.toIx = this.items.indexOf(this.placeholder);
    if (this.toIx < 0) {
      return; //cancelled
    }
    this.move(this.toIx < this.fromIx ? this.fromIx + 1 : this.fromIx, this.toIx);
    this.drag.end();
    this.autoScroll.stop();
    this.removePlaceholder();

    if (this.fromIx < this.toIx) {
      --this.toIx;
    }
    if (this.fromIx !== this.toIx) {
      this.moved( { fromIx: this.fromIx, toIx: this.toIx } );
    }
  }
}

@customAttribute("sortable-item")
export class SortableItem {

  @bindable item = null;

  bind(ctx) {
    this.ctx = ctx; //Need a reference to the item's $index
  }
}
