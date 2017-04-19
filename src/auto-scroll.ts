import { transient } from 'aurelia-dependency-injection';
import { ScrollData } from './utils';

@transient()
export class AutoScroll {
  private rAFId: number = -1;
  private active = false;

  public activate({ scrollElement, scrollDirection, scrollFrames, scrollSpeed }: ScrollData) {
    if (this.active) {
      if (scrollDirection.x === 0 && scrollDirection.y === 0) {
        window.cancelAnimationFrame(this.rAFId);
        this.active = false;
      }
      return;
    }
    if (scrollDirection.x === 0 && scrollDirection.y === 0) {
      return;
    }

    if (scrollFrames.x === 0 && scrollFrames.y === 0) {
      return;
    }

    const scrollDeltaX = scrollDirection.x * scrollSpeed;
    const scrollDeltaY = scrollDirection.y * scrollSpeed;

    const autoScroll = () => {

      if (!this.active) {
        return;
      }
      if (Math.abs(scrollFrames.x) > 0) {
        scrollElement.scrollLeft += scrollDeltaX;
      }
      if (Math.abs(scrollFrames.y) > 0) {
        scrollElement.scrollTop += scrollDeltaY;
      }

      --scrollFrames.x;
      --scrollFrames.y;
      if (scrollFrames.x <= 0 && scrollFrames.y <= 0) {
        this.active = false;
        return;
      }

      this.rAFId = window.requestAnimationFrame(autoScroll);
    };

    this.active = true;
    autoScroll();
  }
  public deactivate() {
    window.cancelAnimationFrame(this.rAFId);
    this.active = false;
  }
}
