import { Point, matchesSelector } from 'oribella-framework';
import { Sortable, SortableItem } from './sortable';

export type SortableItemElement = HTMLElement & { au: { [index: string]: { viewModel: SortableItem } } };
export type SortableElement = HTMLElement & { au: { [index: string]: { viewModel: Sortable } } };
const SORTABLE_ITEM = 'oa-sortable-item';

export enum AxisFlag {
  x = 1,
  y = 2,
  xy = 3
}
export interface WindowDimension {
  innerWidth: number;
  innerHeight: number;
}
export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface ScrollOffset {
  scrollLeft: number;
  scrollTop: number;
}
export interface ScrollRect {
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  scrollHeight: number;
}
export interface ScrollDirection {
  x: number;
  y: number;
}
export interface ScrollDimension {
  scrollWidth: number;
  scrollHeight: number;
}
export interface ScrollFrames {
  x: number;
  y: number;
}
export interface ScrollData {
  scrollElement: Element;
  scrollDirection: ScrollDirection;
  scrollFrames: ScrollFrames;
  scrollSpeed: number;
}

export interface Clone {
  parent: HTMLElement;
  viewModel: SortableItem | null;
  element: HTMLElement | null;
  offset: Point;
  position: Point;
  width: number;
  height: number;
  display: string | null;
  currentSortable: Sortable;
};

export const utils = {
  hideClone(clone: Clone) {
    const element = clone.element as HTMLElement;
    clone.display = element.style.display;
    element.style.display = 'none';
  },
  showClone(clone: Clone) {
    const element = clone.element as HTMLElement;
    element.style.display = clone.display;
  },
  closest(node: Node | null, selector: string, rootNode: Node) {
    while (node && node !== rootNode && node !== document) {
      if (matchesSelector(node, selector)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  },
  getViewModel(element: SortableItemElement): SortableItem {
    return element.au[SORTABLE_ITEM].viewModel;
  },
  moveItem(clone: Clone, toVM: SortableItem): boolean {
    const fromSortable = clone.currentSortable;
    let toSortable = toVM.parentSortable;
    const fromVM = clone.viewModel;
    if (!fromVM) {
      return false;
    }
    const fromItem = fromVM.item;
    const toItem = toVM.item;
    if ((fromVM.typeFlag & toVM.typeFlag) === 0) {
      return false;
    }
    if (fromSortable.sortableDepth !== toSortable.sortableDepth) {
      if (fromSortable.sortableDepth !== toVM.childSortable.sortableDepth) {
        return false;
      }
      toSortable = toVM.childSortable;
    }
    const fromItems = fromSortable.items;
    const fromIx = fromItems.indexOf(fromItem);
    const toItems = toSortable.items;
    let toIx = toItems.indexOf(toItem);
    if (toIx === -1) {
      toIx = 0;
    }
    const removedFromItem = fromItems.splice(fromIx, 1)[0];
    toItems.splice(toIx, 0, removedFromItem);
    if (fromItems.indexOf(fromItem) === -1) {
      clone.currentSortable = toSortable;
    }
    return true;
  },
  pointInside({ top, right, bottom, left }: Rect, {x, y }: Point) {
    return x >= left &&
      x <= right &&
      y >= top &&
      y <= bottom;
  },
  elementFromPoint({ x, y }: Point, selector: string, sortableElement: Element) {
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
  canThrottle(lastElementFromPointRect: Rect, { x, y }: Point, { scrollLeft, scrollTop }: ScrollOffset) {
    return lastElementFromPointRect &&
      utils.pointInside(lastElementFromPointRect, { x: x + scrollLeft, y: y + scrollTop } as Point);
  },
  addClone(clone: Clone, target: HTMLElement, client: Point, dragZIndex: number, { scrollLeft, scrollTop }: ScrollOffset) {
    const targetRect = target.getBoundingClientRect();
    clone.width = targetRect.width;
    clone.height = targetRect.height;
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
  updateClone(clone: Clone, currentClientPoint: Point, { scrollLeft, scrollTop, scrollWidth, scrollHeight }: ScrollRect, axisBitFlag: number) {
    if (!clone.element) {
      return;
    }
    if (axisBitFlag & AxisFlag.x) {
      clone.position.x = currentClientPoint.x + clone.offset.x + scrollLeft;
    }
    if (axisBitFlag & AxisFlag.y) {
      clone.position.y = currentClientPoint.y + clone.offset.y + scrollTop;
    }

    utils.ensureCloneBoundaries(clone, { scrollWidth, scrollHeight });
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
  ensureCloneBoundaries(clone: Clone, { scrollWidth, scrollHeight}: ScrollDimension) {
    if (clone.position.x <= 0) {
      clone.position.x = 0;
    }
    if (clone.position.x + clone.width >= scrollWidth) {
      clone.position.x = scrollWidth - clone.width;
    }
    if (clone.position.y <= 0) {
      clone.position.y = 0;
    }
    if (clone.position.y + clone.height >= scrollHeight) {
      clone.position.y = scrollHeight - clone.height;
    }
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
  getBoundaryRect(/*sortableRect: Rect*/): Rect {
    return {
      left: 0, // Math.max(0, sortableRect.left),
      top: 0, // Math.max(0, sortableRect.top),
      right: window.innerWidth, // Math.min(window.innerWidth, sortableRect.right),
      bottom: window.innerHeight, // Math.min(window.innerHeight, sortableRect.bottom),
      get width() {
        return this.right - this.left;
      },
      get height() {
        return this.bottom - this.top;
      }
    };
  },
  getScrollDirection(axisBitFlag: number, scrollSensitivity: number, { x, y }: Point, { left, top, right, bottom }: Rect): ScrollDirection {
    const direction: ScrollDirection = { x: 0, y: 0 };
    if (x >= right - scrollSensitivity) {
      direction.x = 1;
    } else if (x <= left - scrollSensitivity) {
      direction.x = -1;
    }
    if (y >= bottom - scrollSensitivity) {
      direction.y = 1;
    } else if (y <= top - scrollSensitivity) {
      direction.y = -1;
    }
    if ((axisBitFlag & AxisFlag.xy) === 0 && axisBitFlag & AxisFlag.x) {
      direction.y = 0;
    }
    if ((axisBitFlag & AxisFlag.xy) === 0 && axisBitFlag & AxisFlag.y) {
      direction.x = 0;
    }
    return direction;
  },
  getScrollMaxPos(sortableElement: Element, sortableRect: Rect, scrollElement: Element, { scrollLeft, scrollTop, scrollWidth, scrollHeight }: ScrollRect, scrollRect: Rect, { innerWidth, innerHeight }: WindowDimension): Point {
    if (sortableElement.contains(scrollElement)) {
      return new Point(scrollWidth - scrollRect.width, scrollHeight - scrollRect.height);
    } else {
      return new Point(sortableRect.right + scrollLeft - innerWidth, sortableRect.bottom + scrollTop - innerHeight);
    }
  },
  getScrollFrames(direction: ScrollDirection, maxPos: Point, { scrollLeft, scrollTop }: ScrollOffset, scrollSpeed: number): ScrollFrames {
    let x = Math.max(0, Math.ceil(Math.abs(maxPos.x - scrollLeft) / scrollSpeed));
    let y = Math.max(0, Math.ceil(Math.abs(maxPos.y - scrollTop) / scrollSpeed));
    if (direction.x === 1 && scrollLeft >= maxPos.x ||
      direction.x === -1 && scrollLeft === 0) {
      x = 0;
    }
    if (direction.y === 1 && scrollTop >= maxPos.y ||
      direction.y === -1 && scrollTop === 0) {
      y = 0;
    }
    return new Point(x, y);
  },
  ensureAxisFlag(axis: string): AxisFlag {
    switch (axis) {
      case 'x':
        return AxisFlag.x;
      case 'y':
        return AxisFlag.y;
      default:
        return AxisFlag.xy;
    }
  },
  getSortableDepth(sortable: Sortable) {
    let depth = 0;
    while (sortable.parentSortable) {
      ++depth;
      sortable = sortable.parentSortable;
    }
    return depth;
  }
};
