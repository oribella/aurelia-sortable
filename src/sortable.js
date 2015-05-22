import {customAttribute, inject, bindable} from "aurelia-framework";
import {matchesSelector} from "oribella-framework";

@customAttribute("sortable")
@inject(Element, "oribella")
@bindable({
  name: "scroll"
})
@bindable({
  name: "scrollSpeed",
  defaultValue: 10
})
@bindable({
  name: "scrollSensitivity",
  defaultValue: 10
})
@bindable("items")
@bindable({
  name: "placeholder",
  defaultValue: {
    placeholderClass: "placeholder"
  }
})
@bindable("axis")
@bindable({
  name: "moved",
  defaultValue: function() {}
})
export class Sortable {
  constructor(element, oribella) {
    this.element = element;
    this.oribella = oribella;
    this.selector = "[sortable-item]";
    this.fromIx = -1;
    this.toIx = -1;
    this.dragX = 0;
    this.dragY = 0;
    this.isAutoScrollingX = false;
    this.isAutoScrollingY = false;
  }
  bind() {
    this.remove = this.oribella.on(this.element, "swipe", this);
    if( !this.scroll ) {
      this.scroll = this.element;
    }
  }
  unbind() {
    this.remove();
  }
  dragStart(element) {
    this.dragElement = element;
    this.scrollRect = this.scroll.getBoundingClientRect();
    this.scrollWidth = this.scroll.scrollWidth;
    this.scrollHeight = this.scroll.scrollHeight;
    this.dragRect = element.getBoundingClientRect();
    this.offsetParentRect = element.offsetParent.getBoundingClientRect();

    this.dragX = this.dragRect.left - this.offsetParentRect.left;
    this.dragY = this.dragRect.top - this.offsetParentRect.top;

    if (this.scroll === element.offsetParent ||
      this.scroll.contains(element.offsetParent)) {
      this.dragX += this.scroll.scrollLeft;
      this.dragY += this.scroll.scrollTop;
    }

    element.style.position = "absolute";
    element.style.width = this.dragRect.width + "px";
    element.style.height = this.dragRect.height + "px";
    element.style.pointerEvents = "none";
    element.style.zIndex = 1;

    this.moveTo(element, 0, 0);
  }
  dragEnd() {
    if (this.dragElement) {
      this.dragElement.removeAttribute("style");
      this.dragElement = undefined;
    }
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
      return;
    }
    var autoScroll = function loop() {
      this.scroll.scrollLeft += dx * this.scrollSpeed;
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
      return;
    }
    var autoScroll = function loop() {
      this.scroll.scrollTop += dy * this.scrollSpeed;
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
    if( fromIx !== -1 && toIx !== -1 && fromIx !== toIx ) {
      this.items.splice(toIx, 0, this.items.splice(fromIx, 1)[0]);
    }
  }
  tryMove(x, y) {
    var element = document.elementFromPoint(x, y);
    if (!element) {
      return;
    }
    var valid = false;
    while (!valid && element !== this.element &&
      element !== document) {
      valid = matchesSelector(element, this.selector);
      if (valid) {
        break;
      }
      element = element.parentNode;
    }
    if (valid) {
      //console.log(element, element.sortableItem.ctx.$index);
      var ix = element.sortableItem.ctx.$index;
      this.movePlaceholder(ix);
    }
  }
  start(e, data, element) {
    this.dragStart(element);
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

    switch (this.axis) {
    case "x":
      y = this.dragY + this.dragRect.height / 2;
      dy = 0;
      break;
    case "y":
      x = this.dragX + this.dragRect.width / 2;
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
    this.stopAutoScroll();
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
  bind(ctx) {
    this.ctx = ctx; //Need a reference to the item's $index
    //console.log("bind sortable item", this.ctx.$index);
  }
  unbind(){
    //console.log("unbind sortable item", this.ctx.$index);
  }
}
