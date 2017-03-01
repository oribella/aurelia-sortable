import { DOM } from 'aurelia-pal';
import { customAttribute, bindable } from 'aurelia-templating';
import { Repeat } from 'aurelia-templating-resources';
import { inject } from 'aurelia-dependency-injection';
import { oribella, Swipe, matchesSelector, RETURN_FLAG, Point, DefaultListenerArgs } from 'oribella';
import { OptionalParent } from './optional-parent';
import { utils, SortableItemElement, SortableElement, DragClone, Rect, PageScrollOffset, AxisFlag, LockedFlag, MoveFlag } from './utils';
import { AutoScroll } from './auto-scroll';

export const SORTABLE = 'oa-sortable';
export const SORTABLE_ATTR = `[${SORTABLE}]`;
export const SORTABLE_ITEM = 'oa-sortable-item';
export const SORTABLE_ITEM_ATTR = `[${SORTABLE_ITEM}]`;

declare module 'aurelia-templating-resources' {
  export interface Repeat {
    viewFactory: {
      isCaching: boolean;
      setCacheSize: (first: number | string, second: boolean) => void;
    };
  }
}

@customAttribute(SORTABLE)
@inject(DOM.Element, OptionalParent.of(Sortable), AutoScroll)
export class Sortable {
  @bindable public items: any = [];
  @bindable public scroll: string | Element = 'document';
  @bindable public scrollSpeed: number = 10;
  @bindable public scrollSensitivity: number = 10;
  @bindable public axis: string = AxisFlag.XY;
  @bindable public moved: () => void = () => { };
  @bindable public dragClass: string = 'oa-drag';
  @bindable public dragZIndex: number = 1;
  @bindable public disallowedDragSelectors: string[] = ['INPUT', 'SELECT', 'TEXTAREA'];
  @bindable public allowedDragSelector: string = '';
  @bindable public allowedDragSelectors: string[] = [];
  @bindable public allowDrag = ({ evt }: { evt: Event, item: SortableItem }) => {
    const target = (evt.target as HTMLElement);
    if (this.allowedDragSelector &&
      !matchesSelector(target, this.allowedDragSelector)) {
      return false;
    }
    if (this.allowedDragSelectors.length &&
      this.allowedDragSelectors.filter((selector) => matchesSelector(target, selector)).length === 0) {
      return false;
    }
    if (this.disallowedDragSelectors.filter((selector) => matchesSelector(target, selector)).length !== 0) {
      return false;
    }
    if (target.isContentEditable) {
      return false;
    }
    return true;
  }
  @bindable public typeFlag: number = 1;

  public dragClone: DragClone = {
    parent: window.document.body,
    viewModel: null,
    element: null,
    offset: new Point(0, 0),
    position: new Point(0, 0),
    width: 0,
    height: 0,
    display: null
  };
  public sortableDepth: number = -1;
  public isDisabled: boolean = false;
  public selector: string = SORTABLE_ITEM_ATTR;

  private scrollListener: Element | Document;
  private removeListener: () => void;
  private downClientPoint: Point = new Point(0, 0);
  private currentClientPoint: Point = new Point(0, 0);
  private boundaryRect: Rect;
  private scrollRect: Rect;
  private rootSortable: Sortable;
  private rootSortableRect: Rect;
  private childSortables: Sortable[] = [];
  private lastElementFromPointRect: Rect;

  constructor(public element: Element, public parentSortable: Sortable, private autoScroll: AutoScroll) {
    this.sortableDepth = utils.getSortableDepth(this);
  }

  public activate() {
    this.removeListener = oribella.on(Swipe, this.element, this as any);
    const { scrollElement, scrollListener } = utils.ensureScroll(this.scroll, this.element);
    this.scroll = scrollElement;
    this.scrollListener = scrollListener;
    this.scrollListener.addEventListener('scroll', this as any, false);
  }
  public deactivate() {
    this.removeListener();
    this.scrollListener.removeEventListener('scroll', this as any, false);
  }
  public handleEvent() {
    utils.updateDragClone(this.dragClone, this.currentClientPoint, window, this.axis);
    this.tryMove(this.currentClientPoint, window);
  }
  public attached() {
    this.activate();
  }
  public detached() {
    this.deactivate();
  }
  private tryScroll(client: Point) {
    const scrollElement = this.scroll as Element;
    const { scrollLeft, scrollTop, scrollWidth, scrollHeight } = scrollElement;
    const scrollSpeed = this.scrollSpeed;
    const scrollMaxPos = utils.getScrollMaxPos(this.element, this.rootSortableRect, scrollElement, { scrollLeft, scrollTop, scrollWidth, scrollHeight }, this.scrollRect, window);
    const scrollDirection = utils.getScrollDirection(this.axis, this.scrollSensitivity, client, this.boundaryRect);
    scrollMaxPos.x = scrollDirection.x === -1 ? 0 : scrollMaxPos.x;
    scrollMaxPos.y = scrollDirection.y === -1 ? 0 : scrollMaxPos.y;
    const scrollFrames = utils.getScrollFrames(scrollDirection, scrollMaxPos, { scrollLeft, scrollTop }, scrollSpeed);
    this.autoScroll.activate({ scrollElement, scrollDirection, scrollFrames, scrollSpeed });
  }
  private tryMove(point: Point, scrollOffset: PageScrollOffset) {
    if (utils.canThrottle(this.lastElementFromPointRect, point, scrollOffset)) {
      return;
    }
    const element = utils.elementFromPoint(point, this.selector, this.element, this.dragClone, this.axis);
    if (!element) {
      return;
    }
    const vm = utils.getViewModel(element as SortableItemElement);
    const moveFlag = utils.move(this.dragClone, vm);
    if (moveFlag === MoveFlag.Valid) {
      this.lastElementFromPointRect = element.getBoundingClientRect();
    }
    if (moveFlag === MoveFlag.ValidNewList) {
      this.lastElementFromPointRect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }
  }
  private trySort(point: Point, scrollOffset: PageScrollOffset) {
    utils.hideDragClone(this.dragClone);
    this.tryMove(point, scrollOffset);
    utils.showDragClone(this.dragClone);
  }
  private isLockedFrom(fromVM: SortableItem): boolean {
    return typeof fromVM.lockedFlag === 'number' && (fromVM.lockedFlag & LockedFlag.From) !== 0;
  }
  private isClosestSortable(target: Node): boolean {
    const closest = utils.closest(target, SORTABLE_ATTR, window.document);
    return closest === this.element;
  }
  private initDragState(client: Point, element: Element, fromVM: SortableItem) {
    this.downClientPoint = client;
    this.scrollRect = (this.scroll as Element).getBoundingClientRect();
    this.rootSortable = utils.getRootSortable(this);
    this.rootSortableRect = this.rootSortable.element.getBoundingClientRect();
    this.childSortables = utils.getChildSortables(this.rootSortable);
    this.childSortables.forEach((s) => s.isDisabled = (this.sortableDepth !== s.sortableDepth || (fromVM.typeFlag & s.typeFlag) === 0));
    this.boundaryRect = utils.getBoundaryRect(this.rootSortableRect, window);
    this.lastElementFromPointRect = element.getBoundingClientRect();
  }
  public down({ evt, data: { pointers: [{ client }] }, target }: DefaultListenerArgs) {
    if (!this.isClosestSortable(evt.target as Node)) {
      return RETURN_FLAG.REMOVE;
    }
    const fromVM = utils.getViewModel(target as SortableItemElement);
    const item = fromVM.item;
    if (!this.isLockedFrom(fromVM) && this.allowDrag({ evt, item })) {
      evt.preventDefault();
      this.initDragState(client, target, fromVM);
      return RETURN_FLAG.IDLE;
    }
    return RETURN_FLAG.REMOVE;
  }
  public start({ data: { pointers: [{ client }] }, target }: DefaultListenerArgs) {
    utils.addDragClone(this.dragClone, this.element as HTMLElement, this.scroll as Element, target as HTMLElement, this.downClientPoint, this.dragZIndex, this.dragClass, window);
    this.tryScroll(client);
  }
  public update({ data: { pointers: [{ client }] } }: DefaultListenerArgs) {
    this.currentClientPoint = client;
    utils.updateDragClone(this.dragClone, client, window, this.axis);
    this.trySort(client, window);
    this.tryScroll(client);
  }
  public stop() {
    utils.removeDragClone(this.dragClone);
    this.autoScroll.deactivate();
    this.childSortables.forEach((s) => s.isDisabled = false);
  }
}

@customAttribute(SORTABLE_ITEM)
@inject(DOM.Element, Repeat)
export class SortableItem {
  @bindable public item: any = null;
  @bindable public typeFlag: number = 1;
  @bindable public lockedFlag: number = 0;
  public parentSortable: Sortable | null;
  public childSortable: Sortable | null;

  constructor(public element: Element, repeat: Repeat) {
    if (!repeat.viewFactory.isCaching) {
      repeat.viewFactory.setCacheSize('*', true);
    }
  }
  private getParentSortable(): Sortable | null {
    const parent = utils.closest((this.element as Node).parentNode, SORTABLE_ATTR, window.document);
    return parent && (parent as SortableElement).au[SORTABLE].viewModel;
  }
  private getChildSortable(): Sortable | null {
    const child = this.element.querySelector(SORTABLE_ATTR);
    return child && (child as SortableElement).au[SORTABLE].viewModel;
  }
  public attached() {
    this.parentSortable = this.getParentSortable();
    this.childSortable = this.getChildSortable();
  }
  get lockedFrom() {
    return (this.lockedFlag & LockedFlag.From) !== 0;
  }
  get lockedTo() {
    return (this.lockedFlag & LockedFlag.To) !== 0;
  }
}
