import { DOM } from 'aurelia-pal';
import { customAttribute, bindable } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { oribella, Swipe, Data, matchesSelector, RETURN_FLAG, Point } from 'oribella';
import { OptionalParent } from './optional-parent';
import { utils, SortableItemElement, SortableElement, Clone, Rect, ScrollOffset } from './utils';
import { AutoScroll } from './auto-scroll';

export const SORTABLE = 'oa-sortable';
export const SORTABLE_ATTR = `[${SORTABLE}]`;
export const SORTABLE_ITEM = 'oa-sortable-item';
export const SORTABLE_ITEM_ATTR = `[${SORTABLE_ITEM}]`;

@customAttribute(SORTABLE)
@inject(DOM.Element, OptionalParent.of(Sortable), AutoScroll)
export class Sortable {
  @bindable public items: any = [];
  @bindable public scroll: string | Element = 'document';
  @bindable public scrollSpeed = 10;
  @bindable public scrollSensitivity = 10;
  @bindable public sortingClass = 'oa-sorting';
  @bindable public draggingClass = 'oa-dragging';
  @bindable public dragZIndex = 1;
  @bindable public axis = '';
  @bindable public moved = () => { };
  @bindable public disallowedDragSelectors = ['INPUT', 'SELECT', 'TEXTAREA'];
  @bindable public allowedDragSelectors = [];
  @bindable public allowDrag = ({ event }: { event: Event, item: SortableItem }) => {
    const target = (event.target as HTMLElement);
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
  @bindable public allowMove = (_: { item: SortableItemElement }) => { return true; };

  private scrollListener: Element | Document;
  private removeListener: () => void;
  private downClientPoint: Point = new Point(0, 0);
  private currentClientPoint: Point = new Point(0, 0);
  public clone: Clone = {
    parent: window.document.body,
    viewModel: null,
    element: null,
    offset: new Point(0, 0),
    position: new Point(0, 0),
    width: 0,
    height: 0,
    display: null,
    currentSortable: this
  };
  private boundaryRect: Rect;
  private sortableRect: Rect;
  private scrollRect: Rect;
  private axisFlag: number = 0;
  private lastElementFromPointRect: Rect;
  public sortableDepth: number = -1;
  public selector: string = SORTABLE_ITEM_ATTR;

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
    utils.updateClone(this.clone, this.currentClientPoint, this.scroll as Element, this.axisFlag);
    this.tryMove(this.currentClientPoint, this.scroll as Element);
  }
  public attached() {
    this.activate();
  }
  public detached() {
    this.deactivate();
  }
  public bind() {
    this.axisFlag = utils.ensureAxisFlag(this.axis);
  }
  private tryScroll(client: Point) {
    const scrollElement = this.scroll as Element;
    const { scrollLeft, scrollTop, scrollWidth, scrollHeight } = scrollElement;
    const scrollSpeed = this.scrollSpeed;
    const scrollMaxPos = utils.getScrollMaxPos(this.element, this.sortableRect, scrollElement, { scrollLeft, scrollTop, scrollWidth, scrollHeight }, this.scrollRect, window);
    const scrollDirection = utils.getScrollDirection(this.axisFlag, this.scrollSensitivity, client, this.boundaryRect);
    const scrollFrames = utils.getScrollFrames(scrollDirection, scrollMaxPos, { scrollLeft, scrollTop }, scrollSpeed);
    this.autoScroll.activate({ scrollElement, scrollDirection, scrollFrames, scrollSpeed });
  }
  private tryMove(point: Point, scrollOffset: ScrollOffset) {
    if (utils.canThrottle(this.lastElementFromPointRect, point, scrollOffset)) {
      return;
    }
    const element = utils.elementFromPoint(point, this.selector, this.element);
    if (!element) {
      return;
    }
    const vm = utils.getViewModel(element as SortableItemElement);
    const item = vm.item;
    if (!this.allowMove({ item })) {
      return;
    }
    if (utils.moveItem(this.clone, vm)) {
      if (this.clone.currentSortable !== this) {
        return;
      }
      this.lastElementFromPointRect = element.getBoundingClientRect();
    }
  }
  private trySort(point: Point, scrollOffset: ScrollOffset) {
    utils.hideClone(this.clone);
    this.tryMove(point, scrollOffset);
    utils.showClone(this.clone);
  }
  public down(event: Event, { pointers: [{ client }]}: Data, element: Element) {
    const target = event.target as Node;
    const closest = utils.closest(target, SORTABLE_ATTR, window.document);
    if (closest !== this.element) {
      return RETURN_FLAG.REMOVE;
    }
    const item = utils.getViewModel(element as SortableItemElement).item;
    if (this.allowDrag({ event, item })) {
      event.preventDefault();
      this.downClientPoint = client;
      this.sortableRect = this.element.getBoundingClientRect();
      this.scrollRect = (this.scroll as Element).getBoundingClientRect();
      this.lastElementFromPointRect = element.getBoundingClientRect();
      return RETURN_FLAG.IDLE;
    }
    return RETURN_FLAG.REMOVE;
  }
  public start(_: Event, { pointers: [{ client }]}: Data, target: HTMLElement) {
    utils.addClone(this.clone, target, this.downClientPoint, this.dragZIndex, this.scroll as Element);
    this.boundaryRect = utils.getBoundaryRect(/*this.sortableRect*/);
    this.tryScroll(client);
  }
  public update(_: Event, { pointers: [{ client }]}: Data, __: Element) {
    this.currentClientPoint = client;
    utils.updateClone(this.clone, client, this.scroll as Element, this.axisFlag);
    this.trySort(client, this.scroll as Element);
    this.tryScroll(client);
  }
  public end() {
    this.stop();
  }
  public cancel() {
    this.stop();
  }
  public stop() {
    utils.removeClone(this.clone);
    this.autoScroll.deactivate();
  }
}

@customAttribute(SORTABLE_ITEM)
@inject(DOM.Element, OptionalParent.of(Sortable))
export class SortableItem {
  @bindable public item: any = null;
  @bindable public typeFlag: number = 1;
  public childSortable: Sortable;
  constructor(public element: Element, public parentSortable: Sortable) { }
  public attached() {
    const child = this.element.querySelector(SORTABLE_ATTR);
    if (child) {
      this.childSortable = (child as SortableElement).au[SORTABLE].viewModel;
    }
  }
}
