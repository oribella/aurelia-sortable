import {transient} from "aurelia-dependency-injection";

@transient()
export class Drag {
  startLeft = 0;
  startTop = 0;
  rect = { left: 0, top: 0, width: 0, height: 0 };
  offsetX = 0;
  offsetY = 0;

  pin() {
    this.item.sortingClass = this.sortingClass;
    this.clone = this.element.cloneNode(true);
    this.clone.style.position = "absolute";
    this.clone.style.width = this.rect.width + "px";
    this.clone.style.height = this.rect.height + "px";
    this.clone.style.pointerEvents = "none";
    this.clone.style.margin = 0;
    this.clone.style.zIndex = this.dragZIndex;
    document.body.appendChild(this.clone);
  }
  unpin() {
    this.item.sortingClass = "";
    document.body.removeChild(this.clone);
    this.clone = null;
  }
  getCenterX() {
    return this.rect.left + this.rect.width / 2;
  }
  getCenterY() {
    return this.rect.top + this.rect.height / 2;
  }
  start(element, item, x, y, viewportScroll, scrollLeft, scrollTop, dragZIndex, axis, sortingClass, minPosX, maxPosX, minPosY, maxPosY) {
    this.element = element;
    this.item = item;
    this.sortingClass = sortingClass;
    this.dragZIndex = dragZIndex;
    const rect = (this.rect = element.getBoundingClientRect());

    this.startLeft = rect.left;
    this.startTop = rect.top;

    this.offsetX = this.startLeft - x;
    this.offsetY = this.startTop - y;

    this.pin();

    this.update(x, y, viewportScroll, scrollLeft, scrollTop, axis, minPosX, maxPosX, minPosY, maxPosY);
  }
  update(x, y, viewportScroll, scrollLeft, scrollTop, axis, minPosX, maxPosX, minPosY, maxPosY) {
    x += this.offsetX;
    y += this.offsetY;
    if (viewportScroll) {
      x += scrollLeft;
      y += scrollTop;
    }

    if (x < minPosX) {
      x = minPosX;
    }
    if (x > maxPosX - this.rect.width) {
      x = maxPosX - this.rect.width;
    }

    if (y < minPosY) {
      y = minPosY;
    }
    if (y > maxPosY - this.rect.height) {
      y = maxPosY - this.rect.height;
    }

    switch (axis) {
    case "x":
      y = this.startTop;
      break;
    case "y":
      x = this.startLeft;
      break;
    }

    this.clone.style.left = x + "px";
    this.clone.style.top = y + "px";
  }
  end() {
    if (this.element === null) {
      return;
    }
    this.unpin();
    this.element = null;
    this.item = null;
  }
}
