import {ScrollInstance} from "./ScrollTo";

export {
  Scroll,
  IOptions,
}

interface IOptions {
  offset?: number;
  duration?: number;
}

class Scroll {
  private isWindow = false;
  constructor(private element?: HTMLElement) {
    this.isWindow = element === undefined || element === null;
  }
  public scrollToElement(element: HTMLElement, options?: IOptions): ScrollInstance {
    return new ScrollInstance({
      distToScroll: () => 0,
      duration: options.duration,
    });
  }
  public scrollToPercent(percent: number = 0, options?: IOptions): ScrollInstance {
    const offset = options.offset || 0;
    const dist = ((this.scrollHeight - this.height) * percent) / 100 - this.y + offset;
    return new ScrollInstance({
      distToScroll: () => dist,
      duration: options.duration,
    });
  }
  public doScroll(options: IOptions): ScrollInstance {
    return new ScrollInstance({
      distToScroll: () => options.offset,
      duration: options.duration,
    });
  }
  private get scrollHeight(): number {
    return this.isWindow ? document.body.clientHeight : this.element.scrollHeight;
  }
  private get scrollWidth(): number {
    return this.isWindow ? document.body.clientWidth : this.element.scrollWidth;
  }
  private get height(): number {
    return this.isWindow ? window.innerHeight : this.element.clientHeight;
  }
  private get width(): number {
    return this.isWindow ? window.innerWidth : this.element.clientWidth;
  }
  private get y(): number {
    return this.isWindow ? window.pageYOffset : this.element.scrollTop;
  }
  private get x(): number {
    return this.isWindow ? window.pageXOffset : this.element.scrollLeft;
  }
}
