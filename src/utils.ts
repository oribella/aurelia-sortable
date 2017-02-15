import { Point, matchesSelector } from 'oribella-framework';
import { Sortable, SortableItem, SORTABLE, SORTABLE_ITEM, SORTABLE_ATTR } from './sortable';

export type SortableItemElement = HTMLElement & { au: { [index: string]: { viewModel: SortableItem } } };
export type SortableElement = HTMLElement & { au: { [index: string]: { viewModel: Sortable } } };

// tslint:disable-next-line:no-empty-interface
export interface AxisFlag {
}
export const AxisFlag = {
  X: 'x' as 'x',
  Y: 'y' as 'y',
  XY: '' as ''
};

export enum LockedFlag {
  From = 1,
  To = 2,
  FromTo = 3
}

export enum MoveFlag {
  Invalid = 0,
  Valid = 1,
  ValidNewList = 2
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

export interface PageScrollOffset {
  pageXOffset: number;
  pageYOffset: number;
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

export interface DragClone {
  parent: HTMLElement;
  viewModel: SortableItem | null;
  element: HTMLElement | null;
  offset: Point;
  position: Point;
  width: number;
  height: number;
  display: string | null;
};

export const utils = {
  hideDragClone(dragClone: DragClone) {
    const element = dragClone.element as HTMLElement;
    dragClone.display = element.style.display;
    element.style.display = 'none';
  },
  showDragClone(dragClone: DragClone) {
    const element = dragClone.element as HTMLElement;
    element.style.display = dragClone.display;
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
  move(dragClone: DragClone, toVM: SortableItem): number {
    let changedToSortable = false;
    const fromVM = dragClone.viewModel;
    if (!fromVM) {
      return MoveFlag.Invalid;
    }
    if (typeof toVM.lockedFlag === 'number' && (toVM.lockedFlag & LockedFlag.To) !== 0) {
      return MoveFlag.Invalid;
    }
    const fromSortable = fromVM.parentSortable;
    if (!fromSortable) {
      return MoveFlag.Invalid;
    }
    let toSortable = toVM.parentSortable;
    if (!toSortable) {
      return MoveFlag.Invalid;
    }
    const fromItem = fromVM.item;
    const toItem = toVM.item;
    if (toVM.childSortable && fromSortable.sortableDepth !== toSortable.sortableDepth) {
      if (fromSortable.sortableDepth !== toVM.childSortable.sortableDepth) {
        return MoveFlag.Invalid;
      }
      toSortable = toVM.childSortable;
      changedToSortable = true;
    }
    if (fromVM.parentSortable !== toSortable && (fromVM.typeFlag & toSortable.typeFlag) === 0) {
      return MoveFlag.Invalid;
    }
    if (fromSortable.sortableDepth !== toSortable.sortableDepth) {
      return MoveFlag.Invalid;
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
    if (changedToSortable) {
      fromVM.parentSortable = toSortable;
      return MoveFlag.ValidNewList;
    }
    return MoveFlag.Valid;
  },
  pointInside({ top, right, bottom, left }: Rect, { x, y }: Point) {
    return x >= left &&
      x <= right &&
      y >= top &&
      y <= bottom;
  },
  elementFromPoint({ x, y }: Point, selector: string, sortableElement: Element, dragClone: DragClone, axisFlag: AxisFlag) {
    if (axisFlag === AxisFlag.X) {
      y = dragClone.position.y + dragClone.height / 2;
    }
    if (axisFlag === AxisFlag.Y) {
      x = dragClone.position.x + dragClone.width / 2;
    }
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
  canThrottle(lastElementFromPointRect: Rect, { x, y }: Point, { pageXOffset, pageYOffset }: PageScrollOffset) {
    return lastElementFromPointRect &&
      utils.pointInside(lastElementFromPointRect, { x: x + pageXOffset, y: y + pageYOffset } as Point);
  },
  addDragClone(dragClone: DragClone, sortableElement: HTMLElement, scrollElement: Element, target: HTMLElement, client: Point, dragZIndex: number, { pageXOffset, pageYOffset }: PageScrollOffset) {
    const targetRect = target.getBoundingClientRect();
    const offset = { left: 0, top: 0 };
    if (sortableElement.contains(scrollElement)) {
      while (sortableElement.offsetParent) {
        const offsetParentRect = sortableElement.offsetParent.getBoundingClientRect();
        offset.left += offsetParentRect.left;
        offset.top += offsetParentRect.top;
        sortableElement = sortableElement.offsetParent as HTMLElement;
      }
    }
    dragClone.width = targetRect.width;
    dragClone.height = targetRect.height;
    dragClone.viewModel = utils.getViewModel(target as SortableItemElement);
    dragClone.element = target.cloneNode(true) as HTMLElement;
    dragClone.element.style.position = 'absolute';
    dragClone.element.style.width = targetRect.width + 'px';
    dragClone.element.style.height = targetRect.height + 'px';
    dragClone.element.style.pointerEvents = 'none';
    dragClone.element.style.margin = 0 + '';
    dragClone.element.style.zIndex = dragZIndex + '';
    dragClone.position.x = targetRect.left + pageXOffset - offset.left;
    dragClone.position.y = targetRect.top + pageYOffset - offset.top;
    dragClone.offset.x = dragClone.position.x - client.x - pageXOffset;
    dragClone.offset.y = dragClone.position.y - client.y - pageYOffset;
    dragClone.element.style.left = dragClone.position.x + 'px';
    dragClone.element.style.top = dragClone.position.y + 'px';
    dragClone.parent.appendChild(dragClone.element);
  },
  updateDragClone(dragClone: DragClone, currentClientPoint: Point, { pageXOffset, pageYOffset }: PageScrollOffset, axisFlag: string) {
    if (!dragClone.element) {
      return;
    }
    if (axisFlag === AxisFlag.X || axisFlag === AxisFlag.XY) {
      dragClone.position.x = currentClientPoint.x + dragClone.offset.x + pageXOffset;
    }
    if (axisFlag === AxisFlag.Y || axisFlag === AxisFlag.XY) {
      dragClone.position.y = currentClientPoint.y + dragClone.offset.y + pageYOffset;
    }

    dragClone.element.style.left = dragClone.position.x + 'px';
    dragClone.element.style.top = dragClone.position.y + 'px';
  },
  removeDragClone(dragClone: DragClone) {
    if (!dragClone.element) {
      return;
    }
    dragClone.parent.removeChild(dragClone.element);
    dragClone.element = null;
    dragClone.viewModel = null;
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
  getBoundaryRect({ left, top, right, bottom }: Rect, { innerWidth, innerHeight }: WindowDimension): Rect {
    return {
      left: Math.max(0, left),
      top: Math.max(0, top),
      right: Math.min(innerWidth, right),
      bottom: Math.min(innerHeight, bottom),
      get width() {
        return this.right - this.left;
      },
      get height() {
        return this.bottom - this.top;
      }
    };
  },
  getScrollDirection(axisFlag: string, scrollSensitivity: number, { x, y }: Point, { left, top, right, bottom }: Rect): ScrollDirection {
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
    if (axisFlag === AxisFlag.X) {
      direction.y = 0;
    }
    if (axisFlag === AxisFlag.Y) {
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
  getSortableDepth(sortable: Sortable) {
    let depth = 0;
    while (sortable.parentSortable) {
      ++depth;
      sortable = sortable.parentSortable;
    }
    return depth;
  },
  getRootSortable(sortable: Sortable) {
    while (sortable.parentSortable) {
      sortable = sortable.parentSortable;
    }
    return sortable;
  },
  getChildSortables(rootSortable: Sortable) {
    const elements = rootSortable.element.querySelectorAll(`${SORTABLE_ATTR}`);
    return Array.from(elements).map((e) => (e as SortableElement).au[SORTABLE].viewModel);
  }
};
