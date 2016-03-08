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
  @bindable moved = () => {};
  @bindable dragZIndex = 1;
  @bindable disallowedDragTagNames = ["INPUT", "SELECT", "TEXTAREA"];
  @bindable allowDrag = args => {
    if (this.disallowedDragTagNames.indexOf(args.event.target.tagName) !== -1) {
      return false;
    }
    if (args.event.target.isContentEditable) {
      return false;
    }
    return true;
  };
  @bindable allowMove = () => { return true; };

  selector = "[sortable-item]";
  fromIx = -1;
  toIx = -1;
  x = 0;
  y = 0;
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
    let scroll = this.scroll;
    if (typeof scroll === "string") {
      if (scroll === "document") {
        this.scroll = document.scrollingElement || document.documentElement || document.body;
        this.removeScroll = this.bindScroll(document, this.onScroll.bind(this));
        return;
      } else {
        scroll = this.closest(this.element, scroll);
      }
    }
    this.scroll = scroll;
    if (!(this.scroll instanceof DOM.Element)) {
      this.scroll = this.element;
    }
    this.removeScroll = this.bindScroll(this.scroll, this.onScroll.bind(this));
  }
  deactivate() {
    if (typeof this.removeListener === "function") {
      this.removeListener();
    }
    if (typeof this.removeScroll === "function") {
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
    if (!this.drag.element) {
      return;
    }
    const scrollLeft = this.scroll.scrollLeft;
    const scrollTop = this.scroll.scrollTop;
    this.drag.update(this.x, this.y, scrollLeft, scrollTop, this.axis, this.dragBoundingRect);
    const { x, y } = this.getPoint(this.x, this.y);
    this.tryMove(x, y, scrollLeft, scrollTop);
  }
  getScrollFrames(maxPos, scrollPos) {
    return Math.max(0, Math.ceil(Math.abs(maxPos - scrollPos) / this.scrollSpeed));
  }
  getScrollDirectionX(x, { left, right }) {
    let dir = 0;
    switch (this.axis) {
      default:
      case "x":
      if (x >= right - this.scrollSensitivity) {
        dir = 1;
      } else if (x <= left + this.scrollSensitivity) {
        dir = -1;
      }
      break;
    }
    return dir;
  }
  getScrollDirectionY(y, { top, bottom }) {
    let dir = 0;
    switch (this.axis) {
      default:
      case "y":
      if (y >= bottom - this.scrollSensitivity) {
        dir = 1;
      } else if (y <= top + this.scrollSensitivity) {
        dir = -1;
      }
      break;
    }
    return dir;
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
    if (fromIx !== -1 && toIx !== -1 && fromIx !== toIx) {
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
    if (!element) {
      return null;
    }
    element = this.closest(element, this.selector, this.element);
    if (!element) {
      return null;
    }
    return element;
  }
  canThrottle(x, y, offsetX, offsetY) {
    return this.lastElementFromPointRect &&
      this.pointInside(x + offsetX, y + offsetY, this.lastElementFromPointRect);
  }
  tryMove(x, y, offsetX, offsetY) {
    if (this.canThrottle(x, y, offsetX, offsetY)) {
      return;
    }
    const element = this.elementFromPoint(x, y);
    if (!element) {
      return;
    }
    const model = this.getItemViewModel(element);
    this.lastElementFromPointRect = element.getBoundingClientRect();
    if (!this.allowMove({ item: model.item })) {
      return;
    }
    this.movePlaceholder(model.ctx.$index);
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
      x: pageX,
      y: pageY
    };
  }
  down(e, data, element) {
    if (this.allowDrag({ event: e, item: this.getItemViewModel(element).item })) {
      e.preventDefault();
      return undefined;
    }
    return false;
  }
  start(e, data, element) {
    const windowHeight = innerHeight;
    const windowWidth = innerWidth;
    const scrollLeft = this.scroll.scrollLeft;
    const scrollTop = this.scroll.scrollTop;

    this.x = data.pointers[0].client.x;
    this.y = data.pointers[0].client.y;
    this.sortableRect = this.element.getBoundingClientRect();
    this.scrollRect = this.scroll.getBoundingClientRect();
    this.scrollWidth = this.scroll.scrollWidth;
    this.scrollHeight = this.scroll.scrollHeight;

    this.boundingRect = {
      left: Math.max(0, this.sortableRect.left),
      top: Math.max(0, this.sortableRect.top),
      bottom: Math.min(windowHeight, this.sortableRect.bottom),
      right: Math.min(windowWidth, this.sortableRect.right)
    };

    this.scrollContainsOffsetParent = this.scroll.contains(element.offsetParent);
    this.sortableContainsScroll = this.element.contains(this.scroll);
    this.dragBoundingRect = this.sortableContainsScroll ? {
      left: 0,
      top: 0,
      bottom: this.scrollHeight,
      right: this.scrollWidth
    } : this.sortableRect;

    if (this.sortableContainsScroll) {
      this.scrollMaxPosX = this.scrollWidth - this.scrollRect.width;
      this.scrollMaxPosY = this.scrollHeight - this.scrollRect.height;
    } else {
      this.scrollMaxPosX = this.sortableRect.right - windowWidth + scrollLeft;
      this.scrollMaxPosY = this.sortableRect.bottom - windowHeight + scrollTop;
    }

    this.drag.start(element, this.x, this.y, this.scrollContainsOffsetParent, this.sortableContainsScroll, scrollLeft, scrollTop, this.dragZIndex, this.axis, this.dragBoundingRect);
    this.autoScroll.start(this.scrollSpeed);
    const viewModel = this.getItemViewModel(element);
    this.fromIx = viewModel.ctx.$index;
    this.toIx = -1;
    this.addPlaceholder(this.fromIx, viewModel.item);
    this.lastElementFromPointRect = this.drag.rect;
  }
  update(e, data) {
    const p = data.pointers[0].client;
    this.x = p.x;
    this.y = p.y;
    const scrollLeft = this.scroll.scrollLeft;
    const scrollTop = this.scroll.scrollTop;

    this.drag.update(this.x, this.y, scrollLeft, scrollTop, this.axis, this.dragBoundingRect);
    const { x, y } = this.getPoint(p.x, p.y);
    const scrollX = this.autoScroll.active ? scrollLeft : 0;
    const scrollY = this.autoScroll.active ? scrollTop : 0;
    this.tryUpdate(x, y, scrollX, scrollY);

    const dirX = this.getScrollDirectionX(x, this.boundingRect);
    const dirY = this.getScrollDirectionY(y, this.boundingRect);
    let frameCntX = this.getScrollFrames(dirX === -1 ? 0 : this.scrollMaxPosX, scrollLeft);
    let frameCntY = this.getScrollFrames(dirY === -1 ? 0 : this.scrollMaxPosY, scrollTop);
    if ((dirX === 1 && scrollLeft >= this.scrollMaxPosX) ||
      (dirX === -1 && scrollLeft === 0)) {
      frameCntX = 0;
    }
    if ((dirY === 1 && scrollTop >= this.scrollMaxPosY) ||
      (dirY === -1 && scrollTop === 0)) {
      frameCntY = 0;
    }
    this.autoScroll.update(this.scroll, dirX, dirY, frameCntX, frameCntY);
  }
  end() {
    this.toIx = this.items.indexOf(this[PLACEHOLDER]);
    if (this.toIx === -1) {
      return; //cancelled
    }
    this.move(this.toIx < this.fromIx ? this.fromIx + 1 : this.fromIx, this.toIx);
    this.stop();

    if (this.fromIx < this.toIx) {
      --this.toIx;
    }
    if (this.fromIx !== this.toIx) {
      this.moved( { fromIx: this.fromIx, toIx: this.toIx } );
    }
  }
  cancel() {
    this.stop();
  }
  stop() {
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
