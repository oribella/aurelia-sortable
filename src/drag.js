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
  start(element, pageX, pageY, { scrollLeft, scrollTop }, dragZIndex, placeholder) {
    let rect = (this.rect = element.getBoundingClientRect());
    let offsetParentRect = element.offsetParent.getBoundingClientRect();

    this.startLeft = rect.left - offsetParentRect.left;
    this.startTop = rect.top - offsetParentRect.top;

    this.offsetX = this.startLeft - pageX - scrollLeft;
    this.offsetY = this.startTop - pageY - scrollTop;

    this.unpin = this.pin(element, rect, dragZIndex);

    if(typeof placeholder.style !== "object") {
      placeholder.style = {};
    }
    placeholder.style.width = rect.width + "px";
    placeholder.style.height = rect.height + "px";

    this.update(pageX, pageY, { scrollLeft, scrollTop });
  }
  update(pageX, pageY, { scrollLeft, scrollTop }, axis) {
    let left = pageX + this.offsetX + scrollLeft;
    let top = pageY + this.offsetY + scrollTop;

    switch (axis) {
    case "x":
      top = this.startTop;
      break;
    case "y":
      left = this.startLeft;
      break;
    default:
      break;
    }

    this.element.style.left = left + "px";
    this.element.style.top = top + "px";
  }
  end() {
    if (this.element) {
      if(typeof this.unpin === "function") {
        this.unpin();
      }
      this.element = null;
    }
  }
}
