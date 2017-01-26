import { Point, matchesSelector } from 'oribella-framework';
import { SortableItem } from './sortable';

export type SortableItemElement = HTMLElement & { au: { [index: string]: { viewModel: SortableItem } } };
const SORTABLE_ITEM = 'oa-sortable-item';

export interface ScrollOffset {
  scrollLeft: number;
  scrollTop: number;
}
export interface ScrollDirection {
  x: number;
  y: number;
}
export interface ScrollFrames {
  x: number;
  y: number;
}
export interface ScrollData {
  element: Element;
  direction: ScrollDirection;
  frames: ScrollFrames;
  speed: number;
};

export interface Clone {
  parent: HTMLElement;
  viewModel: SortableItem | null;
  element: HTMLElement | null;
  offset: Point;
  position: Point;
};

export const utils = {
  hide(element: HTMLElement) {
    const display = element.style.display;
    element.style.display = 'none';
    return () => {
      element.style.display = display;
    };
  },
  closest(node: Node | null, selector: string, rootNode: Node) {
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
  },
  getViewModel(element: SortableItemElement): SortableItem {
    return element.au[SORTABLE_ITEM].viewModel;
  },
  moveSortingItem(items: any[], item: any, toIx: number) {
    const fromIx = items.indexOf(item);
    utils.move(items, fromIx, toIx);
  },
  move(items: any[], fromIx: number, toIx: number) {
    if (fromIx !== -1 && toIx !== -1 && fromIx !== toIx) {
      items.splice(toIx, 0, items.splice(fromIx, 1)[0]);
    }
  },
  pointInside(x: number, y: number, rect: { top: number, right: number, bottom: number, left: number }) {
    return x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom;
  },
  elementFromPoint(x: number, y: number, selector: string, sortableElement: Element) {
    let element = document.elementFromPoint(x, y);
    if (!element) {
      return null;
    }
    element = utils.closest(element, selector, sortableElement) as Element;
    if (!element) {
      return null;
    }
    return element;
  },
  canThrottle(lastElementFromPointRect: ClientRect, x: number, y: number, offsetX: number, offsetY: number) {
    return lastElementFromPointRect &&
      utils.pointInside(x + offsetX, y + offsetY, lastElementFromPointRect);
  },
  addClone(clone: Clone, target: HTMLElement, client: Point, dragZIndex: number, { scrollLeft, scrollTop }: ScrollOffset) {
    const targetRect = target.getBoundingClientRect();
    clone.viewModel = utils.getViewModel(target as SortableItemElement);
    clone.element = target.cloneNode(true) as HTMLElement;
    clone.element.style.position = 'absolute';
    clone.element.style.width = targetRect.width + 'px';
    clone.element.style.height = targetRect.height + 'px';
    clone.element.style.pointerEvents = 'none';
    clone.element.style.margin = 0 + '';
    clone.element.style.zIndex = dragZIndex + '';
    clone.position.x = targetRect.left + scrollLeft;
    clone.position.y = targetRect.top + scrollTop;
    clone.offset.x = clone.position.x - client.x - scrollLeft;
    clone.offset.y = clone.position.y - client.y - scrollTop;
    clone.element.style.left = clone.position.x + 'px';
    clone.element.style.top = clone.position.y + 'px';
    clone.parent.appendChild(clone.element);
  },
  updateClone(clone: Clone, currentClientPoint: Point, { scrollLeft, scrollTop }: ScrollOffset) {
    if (!clone.element) {
      return;
    }
    clone.position.x = currentClientPoint.x + clone.offset.x + scrollLeft;
    clone.position.y = currentClientPoint.y + clone.offset.y + scrollTop;
    clone.element.style.left = clone.position.x + 'px';
    clone.element.style.top = clone.position.y + 'px';
  },
  removeClone(clone: Clone) {
    if (!clone.element) {
      return;
    }
    clone.parent.removeChild(clone.element);
    clone.element = null;
    clone.viewModel = null;
  },
  ensureScroll(scroll: string | Element, sortableElement: Element): { scrollElement: Element, scrollListener: Element | Document } {
    let scrollElement = sortableElement;
    let scrollListener: Element | Document = sortableElement;
    if (typeof scroll === 'string') {
      if (scroll === 'document') {
        scrollElement = document.scrollingElement || document.documentElement || document.body;
        scrollListener = document;
      } else {
        scrollElement = utils.closest(sortableElement, scroll, window.document) as Element;
        scrollListener = scrollElement;
      }
    }
    return { scrollElement, scrollListener };
  },
  getScrollData() {

  }
};
