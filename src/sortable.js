import {DOM} from "aurelia-pal";
import {customAttribute, bindable} from "aurelia-templating";
import {inject, transient} from "aurelia-dependency-injection";
import {oribella, matchesSelector, STRATEGY_FLAG} from "oribella-default-gestures";
import {Drag} from "./drag";
import {AutoScroll} from "./auto-scroll";

export const PLACEHOLDER = "__placeholder__";

@customAttribute("sortable")
@inject(DOM.Element, Drag, AutoScroll)
@transient()
export class Sortable {

  @bindable scroll = null;
  @bindable scrollSpeed = 10;
  @bindable scrollSensitivity = 10;
  @bindable items = [];
  @bindable placeholderClass = "placeholder";
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
  lastElementFromPointRect = null;

  constructor(element, drag, autoScroll) {
    this.element = element;
    this.drag = drag;
    this.autoScroll = autoScroll;
    this.options = {
      strategy: STRATEGY_FLAG.REMOVE_IF_POINTERS_GT
    };
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
    const scrollLeft = this.scroll.scrollLeft;
    const scrollTop = this.scroll.scrollTop;
    this.drag.update(this.pageX, this.pageY, scrollLeft, scrollTop, this.axis);
    const { x, y } = this.getPoint(this.pageX, this.pageY);
    this.tryMove(x, y, scrollLeft, scrollTop);
  }
  hide(element) {
    const display = element.style.display;
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
  getItemViewModel(element) {
    return element.au["sortable-item"].viewModel;
  }
  addPlaceholder(toIx, item) {
    let placeholder = Object.create(item, { placeholderClass: { value: this.placeholderClass, writable: true }});

    if (!placeholder.style) {
      placeholder.style = {};
    }
    placeholder.style.width = this.drag.rect.width;
    placeholder.style.height = this.drag.rect.height;

    this[PLACEHOLDER] = placeholder;
    this.items.splice(toIx, 0, placeholder);
  }
  removePlaceholder() {
    const ix = this.items.indexOf(this[PLACEHOLDER]);
    if (ix !== -1) {
      this.items.splice(ix, 1);
    }
  }
  movePlaceholder(toIx) {
    const fromIx = this.items.indexOf(this[PLACEHOLDER]);
    this.move(fromIx, toIx);
  }
  move(fromIx, toIx) {
    if(fromIx !== -1 && toIx !== -1 && fromIx !== toIx) {
      this.items.splice(toIx, 0, this.items.splice(fromIx, 1)[0]);
    }
  }
  tryUpdate(pageX, pageY, offsetX, offsetY) {
    const showFn = this.hide(this.drag.element);
    this.tryMove(pageX, pageY, offsetX, offsetY);
    showFn();
  }
  pointInside(x, y, rect) {
    return x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom;
  }
  elementFromPoint(x, y) {
    let element = document.elementFromPoint(x, y);
    if(!element) {
      return null;
    }
    element = this.closest(element, this.selector, this.element);
    if(!element) {
      return null;
    }
    return element;
  }
  canThrottle(x, y, offsetX, offsetY) {
    return this.lastElementFromPointRect &&
      this.pointInside(x + offsetX, y + offsetY, this.lastElementFromPointRect);
  }
  tryMove(x, y, offsetX, offsetY) {
    if(this.canThrottle(x, y, offsetX, offsetY)) {
      return;
    }
    const element = this.elementFromPoint(x, y);
    if(!element) {
      return;
    }
    const model = this.getItemViewModel(element);
    this.lastElementFromPointRect = element.getBoundingClientRect();
    if(!this.allowMove({ item: model.item })) {
      return;
    }
    const ix = model.ctx.$index;
    this.movePlaceholder(ix);
  }
  getPoint(pageX, pageY) {
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
    if(this.allowDrag({ event: e, item: this.getItemViewModel(element).item })) {
      e.preventDefault();
      return undefined;
    }
    return false;
  }
  start(e, data, element) {
    this.pageX = data.pagePoints[0].x;
    this.pageY = data.pagePoints[0].y;
    this.scrollRect = this.scroll.getBoundingClientRect();
    this.scrollWidth = this.scroll.scrollWidth;
    this.scrollHeight = this.scroll.scrollHeight;
    this.boundingRect = this.boundingRect || { left: this.scrollRect.left + 5, top: this.scrollRect.top + 5, right: this.scrollRect.right - 5, bottom: this.scrollRect.bottom - 5 };
    this.drag.start(element, this.pageX, this.pageY, this.scroll.scrollLeft, this.scroll.scrollTop, this.dragZIndex);
    this.autoScroll.start(this.axis, this.scrollSpeed, this.scrollSensitivity);
    const viewModel = this.getItemViewModel(element);
    this.fromIx = viewModel.ctx.$index;
    this.toIx = -1;
    this.addPlaceholder(this.fromIx, viewModel.item);
    this.lastElementFromPointRect = this.drag.rect;
  }
  update(e, data) {
    const p = data.pagePoints[0];
    const pageX = (this.pageX = p.x);
    const pageY = (this.pageY = p.y);
    const scrollLeft = this.scroll.scrollLeft;
    const scrollTop = this.scroll.scrollTop;

    this.drag.update(pageX, pageY, scrollLeft, scrollTop, this.axis);
    const { x, y } = this.getPoint(pageX, pageY);
    const scrollX = this.autoScroll.active ? scrollLeft : 0;
    const scrollY = this.autoScroll.active ? scrollTop : 0;
    this.tryUpdate(x, y, scrollX, scrollY);
    this.autoScroll.update(this.scroll, x, y, this.scrollWidth, this.scrollHeight, this.scrollRect);
  }
  end() {
    this.toIx = this.items.indexOf(this[PLACEHOLDER]);
    if (this.toIx === -1) {
      return; //cancelled
    }
    this.move(this.toIx < this.fromIx ? this.fromIx + 1 : this.fromIx, this.toIx);
    this.drag.end();
    this.autoScroll.end();
    this.removePlaceholder();

    if (this.fromIx < this.toIx) {
      --this.toIx;
    }
    if (this.fromIx !== this.toIx) {
      this.moved( { fromIx: this.fromIx, toIx: this.toIx } );
    }
  }
  cancel() {
    this.drag.end();
    this.autoScroll.end();
    this.removePlaceholder();
  }
}

@customAttribute("sortable-item")
export class SortableItem {

  @bindable item = null;

  bind(ctx, overrideCtx) {
    this.ctx = overrideCtx; //Need a reference to the item's $index
  }
}
