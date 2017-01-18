import {transient} from 'aurelia-dependency-injection';

@transient()
export class Drag {
  private item: any;
  private element: Element | null;
  private clone: HTMLElement | null;
  private startLeft = 0;
  private startTop = 0;
  private rect = { left: 0, top: 0, width: 0, height: 0 };
  private offsetX = 0;
  private offsetY = 0;
  private dragZIndex = 1;
  private sortingClass = 'oa-sorting';

  public pin() {
    this.item.sortingClass = this.sortingClass;
    this.clone = (this.element as Element).cloneNode(true) as HTMLElement;
    this.clone.style.position = 'absolute';
    this.clone.style.width = this.rect.width + 'px';
    this.clone.style.height = this.rect.height + 'px';
    this.clone.style.pointerEvents = 'none';
    this.clone.style.margin = 0 + '';
    this.clone.style.zIndex = this.dragZIndex + '';
    document.body.appendChild(this.clone);
  }
  public unpin() {
    this.item.sortingClass = '';
    document.body.removeChild(this.clone as HTMLElement);
    this.clone = null;
  }
  public getCenterX() {
    return this.rect.left + this.rect.width / 2;
  }
  public getCenterY() {
    return this.rect.top + this.rect.height / 2;
  }
  public start(element: Element, item: any, x: number, y: number, viewportScroll: boolean, scrollLeft: number, scrollTop: number, dragZIndex: number, axis: string, sortingClass: string, minPosX: number, maxPosX: number, minPosY: number, maxPosY: number) {
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
  public update(x: number, y: number, viewportScroll: boolean, scrollLeft: number, scrollTop: number, axis: string, minPosX: number, maxPosX: number, minPosY: number, maxPosY: number) {
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
    case 'x':
      y = this.startTop;
      break;
    case 'y':
      x = this.startLeft;
      break;
    default: {}
    }

    (this.clone as HTMLElement).style.left = x + 'px';
    (this.clone as HTMLElement).style.top = y + 'px';
  }
  public end() {
    if (this.element === null) {
      return;
    }
    this.unpin();
    this.element = null;
    this.item = null;
  }
}
