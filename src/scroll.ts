import { EasingOrFunction } from "./easings"
import { ElementOrQuery, Misc, getElementFromQuery } from "./misc"
import { ScrollAnimation, ScrollAnimationPosition } from "./animation"

const THRESHOLD = 1.5

export interface IScrollOptions {
  horizontal?: boolean
  duration?: number
  easing?: EasingOrFunction
  onScroll?: ((external?: boolean) => void) | null
}

export class Scroll implements Required<IScrollOptions> {
  private _scrollAnimations: ScrollAnimation[] = []
  private _element: Element | Window = window
  private _external = false
  private _virtualX: number = 0
  private _virtualY: number = 0

  horizontal = false
  duration = 1000
  onScroll: ((external?: boolean) => void) | null = null
  easing: EasingOrFunction = "easeInOutQuad"

  constructor(container: ElementOrQuery = window, options: IScrollOptions = {}) {
    const element = getElementFromQuery(container)
    this._element = element === document.documentElement ? window : element
    this.updateOptions(options)
    this._element.addEventListener("scroll", () => {
      const scrollX = Misc.getScrollPosition(this._element, true)
      const scrollY = Misc.getScrollPosition(this._element, false)
      this._external =
        (!(this._virtualX < 0 && scrollX === 0) &&
          Math.abs(scrollX - this._virtualX) >= THRESHOLD) ||
        (!(this._virtualY < 0 && scrollY === 0) && Math.abs(scrollY - this._virtualY) >= THRESHOLD)
      if (this._external) {
        this._virtualX = scrollX
        this._virtualY = scrollY
      }
      this.onScroll && this.onScroll(this._external)
    })
  }

  private _createScrollAnimation(
    from: ScrollAnimationPosition,
    to: ScrollAnimationPosition,
    options: Required<IScrollOptions>,
  ) {
    this._scrollAnimations.push(new ScrollAnimation(from, to, options))
    this._update()
  }
  private _checkBorder() {
    const scrollX = Misc.getScrollSize(this._element, true)
    const scrollY = Misc.getScrollSize(this._element, false)
    this._virtualX = Math.max(0, Math.min(this._virtualX, scrollX))
    this._virtualY = Math.max(0, Math.min(this._virtualY, scrollY))
  }
  private _update() {
    this._scrollAnimations = this._scrollAnimations.filter(animation => {
      const value = -animation.distance + animation.updateDistance()
      if (animation.options.horizontal) {
        this._virtualX += value
      } else {
        this._virtualY += value
      }
      return !animation.isPastAnimation()
    })

    Misc.scrollTo(this._element, this._virtualX, this._virtualY)
    if (this._scrollAnimations.length > 0) {
      requestAnimationFrame(() => this._update())
    } else {
      this._checkBorder()
    }
  }

  updateOptions(options: IScrollOptions = {}) {
    const realOptions = this.getOptions(options)
    this.horizontal = realOptions.horizontal
    this.onScroll = realOptions.onScroll
    this.duration = realOptions.duration
    this.easing = realOptions.easing
  }
  getOptions(options: IScrollOptions = {}): Required<IScrollOptions> {
    return {
      horizontal: options.horizontal || this.horizontal,
      easing: options.easing || this.easing,
      onScroll: options.onScroll || this.onScroll,
      duration: options.duration !== undefined ? options.duration : this.duration,
    }
  }
  get size() {
    return Misc.getSize(this._element, this.horizontal)
  }
  get scrollSize() {
    return Misc.getScrollSize(this._element, this.horizontal) - this.size
  }
  get scrollPosition() {
    return Misc.getScrollPosition(this._element, this.horizontal)
  }
  relativePosition(elementOrQuery: ElementOrQuery): number {
    return Misc.getRelativeElementPosition(this._element, elementOrQuery, this.horizontal)
  }
  stop() {
    this._scrollAnimations = []
  }
  scrollTo(value: number, options?: IScrollOptions): this
  scrollTo(element: ElementOrQuery, value?: number, options?: IScrollOptions): this
  scrollTo(...args: any[]) {
    const element = typeof args[0] === "number" ? null : args[0]
    const value = typeof args[0] === "number" ? args[0] : args[1]
    const options = this.getOptions(typeof args[0] === "number" ? args[1] : args[2])
    const from = Misc.getScrollPosition(this._element, options.horizontal)
    const to = !!element
      ? Misc.getDistToCenterElement(this._element, element, options.horizontal, value) + from
      : value
    this._createScrollAnimation(from, to, options)
    return this
  }
  offset(value: number, options?: IScrollOptions) {
    const realOptions = this.getOptions(options)
    const from = Misc.getScrollPosition(this._element, realOptions.horizontal)
    const to = from + value
    this._createScrollAnimation(from, to, realOptions)
    return this
  }
}
