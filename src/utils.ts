import { matchesSelector } from 'oribella-framework';

const SORTABLE_ITEM = 'oa-sortable-item';

export class Utils {
  public hide(element: HTMLElement) {
    const display = element.style.display;
    element.style.display = 'none';
    return () => {
      element.style.display = display;
    };
  }
  public closest(node: Node | null, selector: string, rootNode: Node) {
    let valid = false;
    while (!valid && node !== null && node !== rootNode &&
      node !== document) {
      valid = matchesSelector(node, selector);
      if (valid) {
        break;
      }
      node = node.parentNode;
    }
    return valid ? node : null;
  }
  public getItemViewModel(element: Element) {
    return (element as any).au[SORTABLE_ITEM].viewModel;
  }
  public moveSortingItem(items: any[], item: any, toIx: number) {
    const fromIx = items.indexOf(item);
    this.move(items, fromIx, toIx);
  }
  public move(items: any[], fromIx: number, toIx: number) {
    if (fromIx !== -1 && toIx !== -1 && fromIx !== toIx) {
      items.splice(toIx, 0, items.splice(fromIx, 1)[0]);
    }
  }
  public pointInside(x: number, y: number, rect: { top: number, right: number, bottom: number, left: number }) {
    return x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom;
  }
  public elementFromPoint(x: number, y: number, selector: string, sortableElement: Element) {
    let element = document.elementFromPoint(x, y);
    if (!element) {
      return null;
    }
    element = this.closest(element, selector, sortableElement) as Element;
    if (!element) {
      return null;
    }
    return element;
  }
  public canThrottle(lastElementFromPointRect: ClientRect, x: number, y: number, offsetX: number, offsetY: number) {
    return lastElementFromPointRect &&
      this.pointInside(x + offsetX, y + offsetY, lastElementFromPointRect);
  }
};
