import { transient } from 'aurelia-dependency-injection';
import { ScrollData } from './utils';

@transient()
export class AutoScroll {
  private rAFId: number = -1;
  private active = false;

  public activate({ element, direction, frames, speed }: ScrollData) {
    if (this.active) {
      if (direction.x === 0 && direction.y === 0) {
        window.cancelAnimationFrame(this.rAFId);
        this.active = false;
      }
      return;
    }
    if (direction.x === 0 && direction.y === 0) {
      return;
    }

    if (frames.x === 0 && frames.y === 0) {
      return;
    }

    const scrollDeltaX = direction.x * speed;
    const scrollDeltaY = direction.y * speed;

    const autoScroll = () => {

      if (!this.active) {
        return;
      }
      if (frames.x > 0) {
        element.scrollLeft += scrollDeltaX;
      }
      if (frames.y > 0) {
        element.scrollTop += scrollDeltaY;
      }

      --frames.x;
      --frames.y;
      if (frames.x <= 0 && frames.y <= 0) {
        this.active = false;
        return;
      }

      this.rAFId = window.requestAnimationFrame(autoScroll);
    };

    this.active = true;
    autoScroll();
  }
  public end() {
    window.cancelAnimationFrame(this.rAFId);
    this.active = false;
  }
}
