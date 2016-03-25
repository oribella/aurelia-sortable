var _dec, _class;

import { transient } from "aurelia-dependency-injection";

export let AutoScroll = (_dec = transient(), _dec(_class = class AutoScroll {
  constructor() {
    this.rAFId = -1;
    this.speed = 10;
    this.active = false;
  }

  start(speed = 10) {
    this.speed = speed;
  }
  update(element, dirX, dirY, frameCntX, frameCntY) {
    if (this.active) {
      if (dirX === 0 && dirY === 0) {
        cancelAnimationFrame(this.rAFId);
        this.active = false;
      }
      return;
    }
    if (dirX === 0 && dirY === 0) {
      return;
    }

    if (frameCntX === 0 && frameCntY === 0) {
      return;
    }

    const scrollDeltaX = dirX * this.speed;
    const scrollDeltaY = dirY * this.speed;

    const autoScroll = () => {

      if (!this.active) {
        return;
      }
      if (frameCntX > 0) {
        element.scrollLeft += scrollDeltaX;
      }
      if (frameCntY > 0) {
        element.scrollTop += scrollDeltaY;
      }

      --frameCntX;
      --frameCntY;
      if (frameCntX <= 0 && frameCntY <= 0) {
        this.active = false;
        return;
      }

      this.rAFId = requestAnimationFrame(autoScroll);
    };

    this.active = true;
    autoScroll();
  }
  end(cAF = cancelAnimationFrame) {
    cAF(this.rAFId);
    this.active = false;
  }
}) || _class);
//# sourceMappingURL=auto-scroll.js.map