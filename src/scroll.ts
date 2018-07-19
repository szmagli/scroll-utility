import { Animation as ScrollAnimation, AnimationApi } from "./animation";

export { Scroll, AnimationApi as AnimationScroll, IOptions, IToElementOptions };

interface IToElementOptions extends IOptions {
  center?: number;
}

interface IOptions {
  duration?: number;
  horizontal?: boolean;
}

interface Point {
  x: number;
  y: number;
}

class Scroll {
  private scrollAnimation: {
    vertical: ScrollAnimation[];
    horizontal: ScrollAnimation[];
  } = {
    vertical: [],
    horizontal: [],
  };
  private lastPosition: {
    horizontal: number;
    vertical: number;
  } = {
    horizontal: 0,
    vertical: 0,
  };
  private scrollChanged: {
    horizontal: number;
    vertical: number;
  } = {
    horizontal: 0,
    vertical: 0,
  };
  private animations: number = 0;
  constructor(private element?: HTMLElement) {
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
  }
  public scroll = {
    toElement: (element: HTMLElement, options: IToElementOptions) => {
      return this.scrollToElement(element, options);
    },
    toPercent: (percent: number, options: IOptions) => {
      return this.scrollToPercent(percent, options);
    },
    toPosition: (position: number, options: IOptions) => {
      return this.scrollToPosition(position, options);
    },
    offset: (amount: number, options: IOptions) => {
      return this.doScroll(amount, options);
    },
  };
  public stopAllAnimations() {
    this.animations = 0;
    this.scrollAnimation = {
      vertical: [],
      horizontal: [],
    };
  }
  private scrollToElement(
    element: HTMLElement,
    options: IToElementOptions,
  ) {
    const center = options.center || 0;
    const duration = options.duration || 0;
    const horizontal = !!options.horizontal;
    const screenOffset =
      ((this.size(horizontal) - element.getBoundingClientRect()[horizontal ? "width" : "height"]) *
       center) /
      100;
    const distToElement =
      element.getBoundingClientRect()[horizontal ? "left" : "top"] -
      this.offset(horizontal) -
      screenOffset;
    return this.createScrollAnimation({
      distToScroll: () => distToElement,
      duration,
      horizontal,
    });
  }
  private scrollToPercent(percent: number, options: IOptions) {
    const duration = options.duration || 0;
    const horizontal = !!options.horizontal;
    const dist =
      ((this.scrollSize(horizontal) - this.size(horizontal)) * percent) / 100 -
      this.position(horizontal);
    return this.createScrollAnimation({
      distToScroll: () => dist,
      duration,
      horizontal,
    });
  }
  private scrollToPosition(position: number, options: IOptions) {
    const duration = options.duration || 0;
    const horizontal = !!options.horizontal;
    const dist = position - this.position(horizontal);
    return this.createScrollAnimation({
      distToScroll: () => dist,
      duration,
      horizontal,
    });
  }
  private doScroll(amount: number, options: IOptions) {
    const duration = options.duration || 0;
    const horizontal = !!options.horizontal;
    return this.createScrollAnimation({
      distToScroll: () => amount,
      duration,
      horizontal,
    });
  }
  private get isWindow(): boolean {
    return !this.element;
  }
  private scrollSize(horizontal: boolean) {
    return horizontal
      ? this.isWindow
      ? document.body.clientWidth
      : this.element!.scrollWidth
    : this.isWindow
      ? document.body.clientHeight
      : this.element!.scrollHeight;
  }
  private size(horizontal: boolean) {
    return horizontal
      ? this.isWindow
      ? window.innerWidth
      : this.element!.clientWidth
    : this.isWindow
      ? window.innerHeight
      : this.element!.clientHeight;
  }
  private position(horizontal: boolean) {
    return horizontal
      ? this.isWindow
      ? window.pageXOffset
      : this.element!.scrollLeft
    : this.isWindow
      ? window.pageYOffset
      : this.element!.scrollTop;
  }
  private offset(horizontal: boolean) {
    return horizontal
      ? this.isWindow
      ? 0
      : this.element!.getBoundingClientRect().left
    : this.isWindow
      ? 0
      : this.element!.getBoundingClientRect().top;
  }
  private createScrollAnimation(options: {
    distToScroll: () => number;
    duration: number;
    horizontal: boolean;
  }) {
    const duration = !!options.duration ? options.duration : 1;
    this.animations++;
    const direction = options.horizontal ? "horizontal" : "vertical";
    const index = this.scrollAnimation[direction].length;
    const animation = new ScrollAnimation({
      distToScroll: options.distToScroll,
      duration,
      stop: () => {
        this.scrollChanged[direction] -= this.scrollAnimation[direction][index].distance;
        this.animations--;
        delete this.scrollAnimation[direction][index];
      },
    });
    this.scrollAnimation[direction].push(animation);
    if (this.animations === 1) {
      window.requestAnimationFrame(this.onAnimationFrame);
    }
    return animation.api;
  }
  private onAnimationFrame() {
    if (this.animations === 0) {
      this.scrollChanged = {
        horizontal: 0,
        vertical: 0,
      };
    } else {
      const distToScroll = this.distToScroll;
      this.scrollTo(distToScroll.x, distToScroll.y);
      this.scrollChanged.horizontal += this.position(true) - this.lastPosition.horizontal;
      this.scrollChanged.vertical += this.position(false) - this.lastPosition.vertical;
      window.requestAnimationFrame(this.onAnimationFrame);
    }
  }
  private scrollTo(x: number, y: number) {
    this.isWindow ? window.scroll(x, y) : this.element!.scroll(x, y);
  }
  private get distToScroll(): Point {
    return {
      x: this.getDistToScroll(true),
      y: this.getDistToScroll(false),
    };
  }
  private getDistToScroll(horizontal: boolean): number {
    let distToScroll = 0;
    const direction = horizontal ? "horizontal" : "vertical";
    this.lastPosition[direction] = this.position(horizontal);
    const initial = this.position(horizontal) - this.scrollChanged[direction];
    this.scrollAnimation[direction].forEach((animation, index) => {
      distToScroll += animation.distance;
    });
    distToScroll += initial;
    return distToScroll;
  }
}
