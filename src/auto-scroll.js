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
  update(element, x, y, { left = 0, top = 0, width = 0, height = 0, right = 0, bottom = 0 } = {}, rAF = requestAnimationFrame, cAF = cancelAnimationFrame) {
    let d = this.getScrollDirection(x, y, top, bottom, left, right);
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

    this.ticks = this.getTicks(d, element.scrollLeft, element.scrollTop, element.scrollWidth, element.scrollHeight, width, height);
    if(this.ticks[0] <= 0 && this.ticks[1] <= 0) {
      return;
    }

    let scrollDeltaX = d[0] * this.speed;
    let scrollDeltaY = d[1] * this.speed;

    let autoScroll = () => {

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
  stop(cAF = cancelAnimationFrame) {
    cAF(this.rAFId);
    this.ticks = [0, 0];
  }
  getTicks(d, scrollLeft, scrollTop, scrollWidth, scrollHeight, width, height) {
    let ticks = [];

    ticks[0] = d[0] > 0 ?
      Math.ceil((scrollWidth - width - scrollLeft) / this.speed) :
      d[0] < 0 ? scrollLeft / this.speed : 0;

    ticks[1] = d[1] > 0 ?
      Math.ceil((scrollHeight - height - scrollTop) / this.speed) :
      d[1] < 0 ? scrollTop / this.speed : 0;

    return ticks;
  }
  getScrollDirection(x, y, top, bottom, left, right) {
    let d = [0, 0];

    d[0] = this.axis === "y" ? 0 :
      (x >= right - this.sensitivity) ? 1 :
        (x <= left + this.sensitivity) ? -1 : 0;

    d[1] = this.axis === "x" ? 0 :
      (y >= bottom - this.sensitivity) ? 1 :
        (y <= top + this.sensitivity) ? -1 : 0;

    return d;
  }
}
