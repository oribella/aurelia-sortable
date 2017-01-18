import { DOM } from 'aurelia-pal';
import { customAttribute, bindable } from 'aurelia-templating';
import { inject, transient } from 'aurelia-dependency-injection';
import { oribella, Swipe, matchesSelector } from 'oribella';

@customAttribute('oa-sortable')
@inject(DOM.Element)
@transient()
export class Sortable {
  @bindable public items: any = [];
  @bindable public scroll = null;
  @bindable public scrollSpeed = 10;
  @bindable public scrollSensitivity = 10;
  @bindable public sortingClass = 'oa-sorting';
  @bindable public draggingClass = 'oa-dragging';
  @bindable public axis = '';
  @bindable public moved = () => { };
  @bindable public dragZIndex = 1;
  @bindable public disallowedDragSelectors = ['INPUT', 'SELECT', 'TEXTAREA'];
  @bindable public allowedDragSelectors = [];
  @bindable public allowDrag = (args: { event: Event }) => {
    const target = (args.event.target as HTMLElement);
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

  constructor(private element: Element) { }

  public activate() {
    this.removeListener = oribella.on(Swipe, this.element, this as any);
  }
  public down() { }
  public start() { }
  public update() { }
  public end() { }
  public cancel() { }
  public stop() { }
}
