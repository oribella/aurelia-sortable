import {transient} from "aurelia-dependency-injection";

@transient()
export class Drag {
  startLeft = 0;
  startTop = 0;
  rect = { left: 0, top: 0, width: 0, height: 0 };
  offsetX = 0;
  offsetY = 0;

  pin(element, rect, dragZIndex) {
    this.element = element;

    let style = {};
    style.position = element.style.position;
    style.left = element.style.left;
    style.top = element.style.top;
    style.width = element.style.width;
    style.height = element.style.height;
    style.pointerEvents = element.style.pointerEvents;
    style.zIndex = element.style.zIndex;

    element.style.position = "absolute";
    element.style.width = rect.width + "px";
    element.style.height = rect.height + "px";
    element.style.pointerEvents = "none";
    element.style.zIndex = dragZIndex;

    return () => {
      Object.keys( style ).forEach( key => {
        element.style[key] = style[key];
      } );
    };
  }
  getCenterX() {
    return this.rect.left + this.rect.width / 2;
  }
  getCenterY() {
    return this.rect.top + this.rect.height / 2;
  }
  start(element, pageX, pageY, scrollContainsOffsetParent, sortableContainsScroll, scrollLeft, scrollTop, dragZIndex, axis, sortableRect) {
    const rect = (this.rect = element.getBoundingClientRect());

    this.startParentLeft = 0;
    this.startParentTop = 0;
    if (scrollContainsOffsetParent) {
      this.startParentLeft = scrollLeft;
      this.startParentTop = scrollTop;
    }
    this.startLeft = rect.left;
    this.startTop = rect.top;
    if (sortableContainsScroll) {
      const offsetParentRect = element.offsetParent.getBoundingClientRect();
      this.startLeft -= offsetParentRect.left;
      this.startTop -= offsetParentRect.top;
    }
    this.offsetX = this.startParentLeft + this.startLeft - pageX - scrollLeft;
    this.offsetY = this.startParentTop + this.startTop - pageY - scrollTop;

    this.unpin = this.pin(element, rect, dragZIndex);

    this.update(pageX, pageY, scrollLeft, scrollTop, axis, sortableRect);
  }
  update(x, y, scrollLeft, scrollTop, axis, { left, top, bottom, right }) {
    x += this.offsetX + scrollLeft;
    y += this.offsetY + scrollTop;

    if (x < left) {
      x = left;
    }
    if (x > right - this.rect.width) {
      x = right - this.rect.width;
    }
    if (y < top) {
      y = top;
    }
    if (y > bottom - this.rect.height) {
      y = bottom - this.rect.height;
    }

    switch (axis) {
    case "x":
      y = this.startTop;
      break;
    case "y":
      x = this.startLeft;
      break;
    }

    this.element.style.left = x + "px";
    this.element.style.top = y + "px";
  }
  end() {
    if (this.element) {
      if (typeof this.unpin === "function") {
        this.unpin();
      }
      this.element = null;
    }
  }
}
