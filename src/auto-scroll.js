import {transient} from "aurelia-dependency-injection";

@transient()
export class AutoScroll {
  ticks = [0, 0];
  rAFId = -1;
  axis = "";
  speed = 10;
  sensitivity = 10;
  active = false;

  start(axis = "", speed = 10, sensitivity = 10) {
    this.axis = axis;
    this.speed = speed;
    this.sensitivity = sensitivity;
  }
  update(element, x, y, scrollWidth, scrollHeight, scrollRect, rAF = requestAnimationFrame, cAF = cancelAnimationFrame) {
    const d = this.getScrollDirection(x, y, scrollRect);
    if(this.active) {
      if(d[0] === 0 && d[1] === 0) {
        cAF(this.rAFId);
        this.active = false;
      }
      return;
    }
    if(d[0] === 0 && d[1] === 0) {
      return;
    }

    this.ticks = this.getTicks(d, element.scrollLeft, element.scrollTop, scrollWidth, scrollHeight, scrollRect.width, scrollRect.height);
    if(this.ticks[0] <= 0 && this.ticks[1] <= 0) {
      return;
    }

    const scrollDeltaX = d[0] * this.speed;
    const scrollDeltaY = d[1] * this.speed;

    const autoScroll = () => {

      if(this.ticks[0] > 0) {
        element.scrollLeft += scrollDeltaX;
      }
      if(this.ticks[1] > 0) {
        element.scrollTop += scrollDeltaY;
      }

      --this.ticks[0];
      --this.ticks[1];
      if (this.ticks[0] <= 0 && this.ticks[1] <= 0) {
        this.active = false;
        return;
      }

      this.rAFId = rAF(autoScroll);
    };

    this.active = true;
    autoScroll();
  }
  end(cAF = cancelAnimationFrame) {
    cAF(this.rAFId);
    this.ticks = [0, 0];
  }
  getTicks(d, scrollLeft, scrollTop, scrollWidth, scrollHeight, width, height) {
    const ticks = [];

    ticks[0] = d[0] > 0 ?
      Math.ceil((scrollWidth - width - scrollLeft) / this.speed) :
      d[0] < 0 ? scrollLeft / this.speed : 0;

    ticks[1] = d[1] > 0 ?
      Math.ceil((scrollHeight - height - scrollTop) / this.speed) :
      d[1] < 0 ? scrollTop / this.speed : 0;

    return ticks;
  }
  getScrollDirection(x, y, scrollRect) {
    const { left, top, right, bottom = 0 } = scrollRect;
    const d = [0, 0];

    d[0] = this.axis === "y" ? 0 :
      (x >= right - this.sensitivity) ? 1 :
        (x <= left + this.sensitivity) ? -1 : 0;

    d[1] = this.axis === "x" ? 0 :
      (y >= bottom - this.sensitivity) ? 1 :
        (y <= top + this.sensitivity) ? -1 : 0;

    return d;
  }
}
