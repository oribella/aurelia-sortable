import { DOM } from 'aurelia-pal';
import { customAttribute, bindable } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { oribella, Swipe, Data, matchesSelector, RETURN_FLAG, Point } from 'oribella';
import { OptionalParent } from './optional-parent';
import { utils, SortableItemElement, Clone } from './utils';

const SORTABLE = 'oa-sortable';
const SORTABLE_ATTR = `[${SORTABLE}]`;
const SORTABLE_ITEM = 'oa-sortable-item';
const SORTABLE_ITEM_ATTR = `[${SORTABLE_ITEM}]`;

@customAttribute(SORTABLE)
@inject(DOM.Element, OptionalParent.of(Sortable))
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
  @bindable public allowMove = () => { return true; };

  private removeListener: () => void;
  private downClientPoint: Point = new Point(0, 0);
  private currentClientPoint: Point = new Point(0, 0);
  private clone: Clone = {
    parent: window.document.body,
    viewModel: null,
    element: null,
    offset: new Point(0, 0),
    position: new Point(0, 0)
  };
  public selector: string = SORTABLE_ITEM_ATTR;

  constructor(public element: Element, public parentList: Sortable) {
    this.parentList = parentList || this;
  }

  public activate() {
    this.removeListener = oribella.on(Swipe, this.element, this as any);
    this.scroll = utils.ensureScroll(this.scroll, this.element);
    this.scroll.addEventListener('scroll', this as any, false);
  }
  public deactivate() {
    if (typeof this.removeListener === 'function') {
      this.removeListener();
    }
    (this.scroll as Element).removeEventListener('scroll', this as any, false);
  }
  public handleEvent() {
    utils.updateClone(this.clone, this.currentClientPoint, this.scroll as Element);
  }
  public attached() {
    this.activate();
  }
  public detached() {
    this.deactivate();
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
      return RETURN_FLAG.IDLE;
    }
    return RETURN_FLAG.REMOVE;
  }
  public start(_: Event, { pointers: [{}]}: Data, target: HTMLElement) {
    utils.addClone(this.clone, target, this.downClientPoint, this.dragZIndex, this.scroll as Element);
  }
  public update(_: Event, { pointers: [{ client }]}: Data, __: Element) {
    this.currentClientPoint = client;
    utils.updateClone(this.clone, this.currentClientPoint, this.scroll as Element);
  }
  public end() {
    this.stop();
  }
  public cancel() {
    this.stop();
  }
  public stop() {
    utils.removeClone(this.clone);
  }
}

@customAttribute(SORTABLE_ITEM)
@inject(OptionalParent.of(Sortable))
export class SortableItem {
  @bindable public item: any = null;

  constructor(public parentList: Sortable) { }
}
