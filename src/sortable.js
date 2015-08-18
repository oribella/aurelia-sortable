import {customAttribute, bindable} from "aurelia-templating";
import {inject, transient} from "aurelia-dependency-injection";
import {oribella, matchesSelector} from "oribella-default-gestures";

@customAttribute("sortable")
@inject(Element)
@transient()
export class Sortable {

  @bindable scroll = null;
  @bindable scrollSpeed = 10;
  @bindable scrollSensitivity = 10;
  @bindable items = [];
  @bindable placeholder = { placeholderClass: "placeholder", style: {} };
  @bindable axis = "";
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

  constructor(element) {
    this.element = element;
    this.selector = "[sortable-item]";
    this.fromIx = -1;
    this.toIx = -1;
    this.dragX = 0;
    this.dragY = 0;
    this.isAutoScrollingX = false;
    this.isAutoScrollingY = false;
  }
  bindScroll(scroll, fn) {
    scroll.addEventListener("scroll", fn, false);
    return () => {
      scroll.removeEventListener("scroll", fn, false);
    };
  }
  activate() {
    this.removeListener = oribella.on(this.element, "swipe", this);
    if(typeof this.scroll === "string") {
      this.scroll = this.closest(this.element, this.scroll, document);
    }
    if(!(this.scroll instanceof Element)) {
      this.scroll = this.element;
    }
  }
  deactivate() {
    this.removeListener();
  }
  attached() {
    this.activate();
  }
  detached() {
    if(typeof this.removeListener === "function") {
      this.removeListener();
    }
  }
  dragStyle() {
    var style = {};
    style.position = this.dragElement.style.position;
    style.left = this.dragElement.style.left;
    style.top = this.dragElement.style.top;
    style.width = this.dragElement.style.width;
    style.height = this.dragElement.style.height;
    style.pointerEvents = this.dragElement.style.pointerEvents;
    style.zIndex = this.dragElement.style.zIndex;

    this.dragElement.style.position = "absolute";
    this.dragElement.style.width = this.dragRect.width + "px";
    this.dragElement.style.height = this.dragRect.height + "px";
    this.dragElement.style.pointerEvents = "none";
    this.dragElement.style.zIndex = this.dragZIndex;

    return () => {
      Object.keys( style ).forEach( key => {
        this.dragElement.style[key] = style[key];
      } );
    };
  }
  dragStart(element) {
    this.removeScroll = this.bindScroll(this.scroll, this.onScroll.bind(this));
    this.dragElement = element;
    this.scrollRect = this.scroll.getBoundingClientRect();
    this.scrollWidth = this.scroll.scrollWidth;
    this.scrollHeight = this.scroll.scrollHeight;
    this.dragRect = element.getBoundingClientRect();
    this.offsetParentRect = element.offsetParent.getBoundingClientRect();

    this.dragX = this.dragRect.left - this.offsetParentRect.left;
    this.dragY = this.dragRect.top - this.offsetParentRect.top;

    this.updateDragWhenScrolling = this.scroll.contains(element.offsetParent);
    if (element.offsetParent === this.scroll) {
      this.dragX += this.scroll.scrollLeft;
      this.dragY += this.scroll.scrollTop;
    }

    this.removeDragStyle = this.dragStyle();

    if(!this.placeholder.style) {
      this.placeholder.style = {};
    }
    this.placeholder.style.width = this.dragRect.width + "px";
    this.placeholder.style.height = this.dragRect.height + "px";

    this.moveTo(element, 0, 0);
  }
  dragEnd() {
    this.stopAutoScroll();
    if (this.dragElement) {
      if(typeof this.removeDragStyle === "function") {
        this.removeDragStyle();
      }
      this.dragElement = null;
    }
    if(typeof this.removeScroll === "function") {
      this.removeScroll();
    }
  }
  onScroll() {
    var display = this.hide(this.dragElement);
    this.tryMove(this.x, this.y);
    this.show(this.dragElement, display);
  }
  getScrollDX(x) {
    if (x >= this.scrollRect.right - this.scrollSensitivity) {
      return 1;
    } else if (x <= this.scrollRect.left + this.scrollSensitivity) {
      return -1;
    } else {
      return 0;
    }
  }
  getScrollDY(y) {
    if (y >= this.scrollRect.bottom - this.scrollSensitivity) {
      return 1;
    } else if (y <= this.scrollRect.top + this.scrollSensitivity) {
      return -1;
    } else {
      return 0;
    }
  }
  canAutoScrollX(x) {
    return this.getScrollDX(x) !== 0;
  }
  canAutoScrollY(y) {
    return this.getScrollDY(y) !== 0;
  }
  autoScrollX(x, y) {
    var dx = this.getScrollDX(x);
    var ticks;
    if (dx > 0) { //down
      ticks = Math.ceil((this.scrollWidth - this.scrollRect.width - this.scroll.scrollLeft) / this.scrollSpeed);
    } else if (dx < 0) { //up
      ticks = this.scroll.scrollLeft / this.scrollSpeed;
    } else {
      return null;
    }
    var autoScroll = function loop() {
      if (ticks <= 0) {
        this.isAutoScrollingX = false;
        return;
      }

      this.scroll.scrollLeft += dx * this.scrollSpeed;
      if(this.updateDragWhenScrolling) {
        this.moveTo(this.dragElement, dx * this.scrollSpeed, 0);
      }

      this.tryMove(x, y);

      --ticks;
      if (ticks <= 0) {
        this.isAutoScrollingX = false;
        return;
      }

      requestAnimationFrame(autoScroll);

    }.bind(this);

    if (ticks > 0) {
      this.isAutoScrollingX = true;
      autoScroll();
    }

    return function () {
      ticks = 0;
    };
  }
  autoScrollY(x, y) {
    var dy = this.getScrollDY(y);
    var ticks;
    if (dy > 0) { //down
      ticks = Math.ceil((this.scrollHeight - this.scrollRect.height - this.scroll.scrollTop) / this.scrollSpeed);
    } else if (dy < 0) { //up
      ticks = this.scroll.scrollTop / this.scrollSpeed;
    } else {
      return null;
    }
    var autoScroll = function loop() {
      if (ticks <= 0) {
        this.isAutoScrollingY = false;
        return;
      }

      this.scroll.scrollTop += dy * this.scrollSpeed;
      if(this.updateDragWhenScrolling) {
        this.moveTo(this.dragElement, 0, dy * this.scrollSpeed);
      }

      this.tryMove(x, y);

      --ticks;
      if (ticks <= 0) {
        this.isAutoScrollingY = false;
        return;
      }

      requestAnimationFrame(autoScroll);

    }.bind(this);

    if (ticks > 0) {
      this.isAutoScrollingY = true;
      autoScroll();
    }

    return function () {
      ticks = 0;
    };
  }
  autoScroll(x, y) {
    var canAutoScrollX = false;
    var canAutoScrollY = false;

    switch (this.axis) {
    case "x":
      canAutoScrollX = this.canAutoScrollX(x);
      break;
    case "y":
      canAutoScrollY = this.canAutoScrollY(y);
      break;
    default:
      canAutoScrollX = this.canAutoScrollX(x);
      canAutoScrollY = this.canAutoScrollY(y);
      break;
    }

    if (!this.isAutoScrollingX && canAutoScrollX) {
      this.stopAutoScrollX = this.autoScrollX(x, y);
    } else if (this.isAutoScrollingX && !canAutoScrollX) {
      if (this.stopAutoScrollX) {
        this.stopAutoScrollX();
      }
    }

    if (!this.isAutoScrollingY && canAutoScrollY) {
      this.stopAutoScrollY = this.autoScrollY(x, y);
    } else if (this.isAutoScrollingY && !canAutoScrollY) {
      if (this.stopAutoScrollY) {
        this.stopAutoScrollY();
      }
    }
  }
  moveTo(element, dx, dy) {
    this.dragX += dx;
    this.dragY += dy;
    element.style.left = this.dragX + "px";
    element.style.top = this.dragY + "px";
  }
  hide(element) {
    var display = element.style.display;
    element.style.display = "none";
    return display;
  }
  show(element, display) {
    element.style.display = display;
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
  closest(element, selector, rootElement = this.element) {
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
  tryMove(x, y) {
    var element = document.elementFromPoint(x, y);
    if (!element) {
      return;
    }
    element = this.closest(element, this.selector);
    if (element) {
      if(!this.allowMove({ item: element.sortableItem.item })) {
        return;
      }
      var ix = element.sortableItem.ctx.$index;
      this.movePlaceholder(ix);
    }
  }
  down(e, data, element) {
    if(this.allowDrag({ event: e, item: element.sortableItem.item })) {
      e.preventDefault();
      return undefined;
    }
    return false;
  }
  start(e, data, element) {
    this.dragStart(element);
    this.x = data.pagePoints[0].x;
    this.y = data.pagePoints[0].y;
    var item = element.sortableItem;
    this.fromIx = item.ctx.$index;
    this.toIx = -1;
    this.addPlaceholder(this.fromIx);
  }
  update(e, data, element) {
    var p = data.pagePoints[0];
    var x = p.x;
    var y = p.y;
    var delta = data.swipe.getDelta();
    var dx = delta[0];
    var dy = delta[1];

    this.x = p.x;
    this.y = p.y;

    switch (this.axis) {
    case "x":
      y = this.dragRect.top + this.dragRect.height / 2;
      dy = 0;
      break;
    case "y":
      x = this.dragRect.left + this.dragRect.width / 2;
      dx = 0;
      break;
    default:
      break;
    }

    this.moveTo(element, dx, dy);
    var display = this.hide(element);
    this.tryMove(x, y);
    this.show(element, display);

    this.autoScroll(x, y);
  }
  end(e, data, element) {
    this.stop(e, data, element);
  }
  cancel(/*e, data, element*/) {
    this.dragEnd();
    this.removePlaceholder();
  }
  stopAutoScroll() {
    if (this.stopAutoScrollX) {
      this.stopAutoScrollX();
    }
    if (this.stopAutoScrollY) {
      this.stopAutoScrollY();
    }
  }
  stop(/*e, data, element*/) {
    this.toIx = this.items.indexOf(this.placeholder);
    if (this.toIx < 0) {
      return; //cancelled
    }
    this.move(this.toIx < this.fromIx ? this.fromIx + 1 : this.fromIx, this.toIx);
    this.dragEnd();
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
