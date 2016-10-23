var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _dec4, _class4, _desc2, _value2, _class5, _descriptor13;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { DOM } from "aurelia-pal";
import { customAttribute, bindable } from "aurelia-templating";
import { inject, transient } from "aurelia-dependency-injection";
import { oribella, matchesSelector, STRATEGY_FLAG } from "oribella-default-gestures";
import { Drag } from "./drag";
import { AutoScroll } from "./auto-scroll";

const SORTABLE_ITEM = "oa-sortable-item";

export let Sortable = (_dec = customAttribute("oa-sortable"), _dec2 = inject(DOM.Element, Drag, AutoScroll), _dec3 = transient(), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = class Sortable {

  constructor(element, drag, autoScroll) {
    _initDefineProp(this, "scroll", _descriptor, this);

    _initDefineProp(this, "scrollSpeed", _descriptor2, this);

    _initDefineProp(this, "scrollSensitivity", _descriptor3, this);

    _initDefineProp(this, "items", _descriptor4, this);

    _initDefineProp(this, "sortingClass", _descriptor5, this);

    _initDefineProp(this, "draggingClass", _descriptor6, this);

    _initDefineProp(this, "axis", _descriptor7, this);

    _initDefineProp(this, "moved", _descriptor8, this);

    _initDefineProp(this, "dragZIndex", _descriptor9, this);

    _initDefineProp(this, "disallowedDragTagNames", _descriptor10, this);

    _initDefineProp(this, "allowDrag", _descriptor11, this);

    _initDefineProp(this, "allowMove", _descriptor12, this);

    this.selector = "[" + SORTABLE_ITEM + "]";
    this.fromIx = -1;
    this.toIx = -1;
    this.x = 0;
    this.y = 0;
    this.lastElementFromPointRect = null;

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
        this.viewportScroll = true;
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
    const { scrollLeft, scrollTop } = this.scroll;
    this.drag.update(this.x, this.y, this.viewportScroll, scrollLeft, scrollTop, this.axis, this.dragMinPosX, this.dragMaxPosX, this.dragMinPosY, this.dragMaxPosY);
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
    while (!valid && element !== null && element !== rootElement && element !== document) {
      valid = matchesSelector(element, selector);
      if (valid) {
        break;
      }
      element = element.parentNode;
    }
    return valid ? element : null;
  }
  getItemViewModel(element) {
    return element.au[SORTABLE_ITEM].viewModel;
  }
  moveSortingItem(toIx) {
    const fromIx = this.items.indexOf(this.drag.item);
    this.toIx = toIx;
    this.move(fromIx, toIx);
  }
  move(fromIx, toIx) {
    if (fromIx !== -1 && toIx !== -1 && fromIx !== toIx) {
      this.items.splice(toIx, 0, this.items.splice(fromIx, 1)[0]);
    }
  }
  tryUpdate(x, y, offsetX, offsetY) {
    const showFn = this.hide(this.drag.clone);
    this.tryMove(x, y, offsetX, offsetY);
    showFn();
  }
  pointInside(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
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
    return this.lastElementFromPointRect && this.pointInside(x + offsetX, y + offsetY, this.lastElementFromPointRect);
  }
  tryMove(x, y, offsetX, offsetY) {
    if (this.canThrottle(x, y, offsetX, offsetY)) {
      return;
    }
    const element = this.elementFromPoint(x, y);
    if (!element) {
      return;
    }
    const vm = this.getItemViewModel(element);
    this.lastElementFromPointRect = element.getBoundingClientRect();
    if (!this.allowMove({ item: vm.item })) {
      return;
    }
    this.moveSortingItem(vm.ctx.$index);
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
    const { scrollLeft, scrollTop } = this.scroll;

    this.windowHeight = innerHeight;
    this.windowWidth = innerWidth;
    this.x = data.pointers[0].client.x;
    this.y = data.pointers[0].client.y;
    this.sortableRect = this.element.getBoundingClientRect();

    this.scrollRect = this.scroll.getBoundingClientRect();
    this.scrollWidth = this.scroll.scrollWidth;
    this.scrollHeight = this.scroll.scrollHeight;

    this.boundingRect = {
      left: Math.max(0, this.sortableRect.left),
      top: Math.max(0, this.sortableRect.top),
      bottom: Math.min(this.windowHeight, this.sortableRect.bottom),
      right: Math.min(this.windowWidth, this.sortableRect.right)
    };

    this.sortableContainsScroll = this.element.contains(this.scroll);
    if (this.sortableContainsScroll) {
      this.scrollMaxPosX = this.scrollWidth - this.scrollRect.width;
      this.scrollMaxPosY = this.scrollHeight - this.scrollRect.height;
      this.dragMinPosX = this.sortableRect.left;
      this.dragMaxPosX = this.sortableRect.left + this.scrollWidth;
      this.dragMaxPosY = this.sortableRect.top + this.scrollHeight;
      this.dragMinPosY = this.sortableRect.top;
    } else {
      this.scrollMaxPosX = this.sortableRect.right - this.windowWidth + (this.viewportScroll ? scrollLeft : 0);
      this.scrollMaxPosY = this.sortableRect.bottom - this.windowHeight + (this.viewportScroll ? scrollTop : 0);
      this.dragMinPosX = this.sortableRect.left + scrollLeft;
      this.dragMaxPosX = this.scrollMaxPosX + this.windowWidth;
      this.dragMinPosY = this.sortableRect.top + scrollTop;
      this.dragMaxPosY = this.scrollMaxPosY + this.windowHeight;
    }

    this.sortingViewModel = this.getItemViewModel(element);
    this.fromIx = this.sortingViewModel.ctx.$index;
    this.toIx = -1;

    this.drag.start(element, this.sortingViewModel.item, this.x, this.y, this.viewportScroll, scrollLeft, scrollTop, this.dragZIndex, this.axis, this.sortingClass, this.dragMinPosX, this.dragMaxPosX, this.dragMinPosY, this.dragMaxPosY);
    this.autoScroll.start(this.scrollSpeed);
    this.lastElementFromPointRect = this.drag.rect;
  }
  update(e, data) {
    const p = data.pointers[0].client;
    const { scrollLeft, scrollTop } = this.scroll;
    this.x = p.x;
    this.y = p.y;
    this.drag.update(this.x, this.y, this.viewportScroll, scrollLeft, scrollTop, this.axis, this.dragMinPosX, this.dragMaxPosX, this.dragMinPosY, this.dragMaxPosY);
    const { x, y } = this.getPoint(p.x, p.y);
    const scrollX = this.autoScroll.active ? scrollLeft : 0;
    const scrollY = this.autoScroll.active ? scrollTop : 0;
    this.tryUpdate(x, y, scrollX, scrollY);

    const dirX = this.getScrollDirectionX(x, this.boundingRect);
    const dirY = this.getScrollDirectionY(y, this.boundingRect);
    let frameCntX = this.getScrollFrames(dirX === -1 ? 0 : this.scrollMaxPosX, scrollLeft);
    let frameCntY = this.getScrollFrames(dirY === -1 ? 0 : this.scrollMaxPosY, scrollTop);
    if (dirX === 1 && scrollLeft >= this.scrollMaxPosX || dirX === -1 && scrollLeft === 0) {
      frameCntX = 0;
    }
    if (dirY === 1 && scrollTop >= this.scrollMaxPosY || dirY === -1 && scrollTop === 0) {
      frameCntY = 0;
    }
    this.autoScroll.update(this.scroll, dirX, dirY, frameCntX, frameCntY);
  }
  end() {
    if (!this.drag.item) {
      return; //cancelled
    }
    this.stop();
    if (this.fromIx !== this.toIx) {
      this.moved({ fromIx: this.fromIx, toIx: this.toIx });
    }
  }
  cancel() {
    this.move(this.sortingViewModel.ctx.$index, this.fromIx);
    this.stop();
  }
  stop() {
    this.drag.end();
    this.autoScroll.end();
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "scroll", [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scrollSpeed", [bindable], {
  enumerable: true,
  initializer: function () {
    return 10;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scrollSensitivity", [bindable], {
  enumerable: true,
  initializer: function () {
    return 10;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "items", [bindable], {
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "sortingClass", [bindable], {
  enumerable: true,
  initializer: function () {
    return "oa-sorting";
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "draggingClass", [bindable], {
  enumerable: true,
  initializer: function () {
    return "oa-dragging";
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "axis", [bindable], {
  enumerable: true,
  initializer: function () {
    return "";
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "moved", [bindable], {
  enumerable: true,
  initializer: function () {
    return () => {};
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "dragZIndex", [bindable], {
  enumerable: true,
  initializer: function () {
    return 1;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "disallowedDragTagNames", [bindable], {
  enumerable: true,
  initializer: function () {
    return ["INPUT", "SELECT", "TEXTAREA"];
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "allowDrag", [bindable], {
  enumerable: true,
  initializer: function () {
    return args => {
      if (this.disallowedDragTagNames.indexOf(args.event.target.tagName) !== -1) {
        return false;
      }
      if (args.event.target.isContentEditable) {
        return false;
      }
      return true;
    };
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "allowMove", [bindable], {
  enumerable: true,
  initializer: function () {
    return () => {
      return true;
    };
  }
})), _class2)) || _class) || _class) || _class);

export let SortableItem = (_dec4 = customAttribute("oa-sortable-item"), _dec4(_class4 = (_class5 = class SortableItem {
  constructor() {
    _initDefineProp(this, "item", _descriptor13, this);
  }

  bind(ctx, overrideCtx) {
    this.ctx = overrideCtx; //Need a reference to the item's $index
  }
}, (_descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "item", [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
})), _class5)) || _class4);
//# sourceMappingURL=sortable.js.map