import { Point, PointerData } from 'oribella-framework';

export function dispatchMouseEvent(
  document: Document,
  target: Element,
  type: string = 'mousedown',
  pageX: number = 100,
  pageY: number = 100,
  clientX: number = 100,
  clientY: number = 100,
  button: number = 1) {
  const evt = document.createEvent('MouseEvents');
  (evt as any).pageX = pageX;
  (evt as any).pageY = pageY;
  evt.initMouseEvent(type,
    true, true, document.defaultView, 0, 0, 0, clientX, clientY, false, false, false, false, button, null);
  target.dispatchEvent(evt);
  return evt;
}

export function dispatchTouchEvent(
  document: Document,
  target: Element,
  type: string = 'touchstart',
  touches: Array<PointerData & { identifier: number }> = [{ page: new Point(100, 100), client: new Point(100, 100), identifier: 1 }],
  changedTouches: Array<PointerData & { identifier: number }> = []) {
  const evt = document.createEvent('UIEvent') as any;
  evt.initUIEvent(type, true, true, window, 0);
  evt.altKey = false;
  evt.ctrlKey = false;
  evt.shiftKey = false;
  evt.metaKey = false;
  evt.changedTouches = changedTouches.map((p) => {
    return {
      pageX: p.page.x,
      pageY: p.page.y,
      clientX: p.client.x,
      clientY: p.client.y,
      identifier: p.identifier
    };
  });
  evt.touches = touches.map((p) => {
    return {
      pageX: p.page.x,
      pageY: p.page.y,
      clientX: p.client.x,
      clientY: p.client.y,
      identifier: p.identifier
    };
  });
  target.dispatchEvent(evt);
  return evt;
}
