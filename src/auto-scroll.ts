import {transient} from 'aurelia-dependency-injection';

@transient()
export class AutoScroll {
  private rAFId: number = -1;
  private speed: number = 10;
  private active = false;

  public start(speed: number = 10) {
    this.speed = speed;
  }
  public update(element: Element, dirX: number, dirY: number, frameCntX: number, frameCntY: number) {
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

      if ( !this.active ) {
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
  public end(cAF: (id: number) => void) {
    cAF(this.rAFId);
    this.active = false;
  }
}
