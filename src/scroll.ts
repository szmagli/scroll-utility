import { Misc, getElementFromQuery } from "./misc"
import { ScrollAnimation, ScrollAnimationPosition } from "./animation"
import { ElementOrQuery, IScrollOptions, ScrollElement, EasingFunction } from "./types"
import { Easings } from "./easings"

const getValue = (funct: number | (() => number)) => {
  return typeof funct === "number" ? funct : funct()
}

function maxMin(value: number, max: number) {
  return Math.max(Math.min(value, max), 0)
}

export class ScrollUtility {
  private _scrollAnimations: ScrollAnimation[] = []
  private _to: number | (() => number) = 0
  private _virtualPosition = 0
  private _container: ScrollElement

  private _horizontal: boolean

  duration: number
  onScroll: ((external?: boolean) => void) | null
  easing: Required<IScrollOptions>["easing"] | string
  force: boolean
  get size() {
    return Math.floor(Misc.getSize(this._container, this._horizontal))
  }
  get scrollSize() {
    return Math.floor(Misc.getScrollSize(this._container, this._horizontal)) - this.size
  }
  get scrollPosition() {
    return Math.floor(Misc.getScrollPosition(this._container, this._horizontal))
  }
  constructor(
    options: {
      container?: ElementOrQuery
      horizontal?: boolean
      onScroll?: ((external?: boolean) => void) | null
      duration?: number
      easing?: string | (() => number)
      force?: boolean
    } = {},
  ) {
    this._container = getElementFromQuery(options.container || window)
    this._horizontal = !!options.horizontal
    this.duration = options.duration === undefined ? 1000 : options.duration
    this.onScroll = options.onScroll === undefined ? null : options.onScroll
    this.easing = options.easing === undefined ? "easeInOutQuad" : options.easing
    this.force = !!options.force
    const onscroll = () => this._onScroll()
    this._container.addEventListener("scroll", onscroll)
  }
  relativePosition(element: ElementOrQuery): number {
    return Misc.getRelativeElementPosition(
      this._container,
      getElementFromQuery(element),
      this._horizontal,
    )
  }
  distToElement(element: ElementOrQuery, value = 0): number {
    return Misc.getDistToCenterElement(
      this._container,
      getElementFromQuery(element),
      this._horizontal,
      value,
    )
  }
  elementSize(element: ElementOrQuery, value = 1): number {
    return Misc.getSize(getElementFromQuery(element), this._horizontal) * value
  }
  stop() {
    this._scrollAnimations = []
    this._to = this.scrollPosition
  }
  scrollTo(value: number, options?: IScrollOptions): this
  scrollTo(element: ElementOrQuery, value?: number, options?: IScrollOptions): this
  scrollTo(...args: any[]) {
    const element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
    const value = typeof args[0] === "number" ? args[0] : args[1]
    const options = this._getOptions(typeof args[0] === "number" ? args[1] : args[2])
    element === null
      ? this._scrollToValue(maxMin(value, this.scrollSize), options)
      : this._scrollToElement(element, value, options)
    return this
  }
  offset(value: number, options?: IScrollOptions): this
  offset(element: ElementOrQuery, value?: number, options?: IScrollOptions): this
  offset(...args: any[]) {
    const element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
    const value = typeof args[0] === "number" ? args[0] : args[1]
    const options = this._getOptions(typeof args[0] === "number" ? args[1] : args[2])
    element === null
      ? this._offsetValue(value, options)
      : this._offsetElement(element, value, options)
    return this
  }
  private _createScrollAnimation(
    from: ScrollAnimationPosition,
    to: ScrollAnimationPosition,
    options: {
      easing: EasingFunction
      duration: number
      force: boolean
    },
  ) {
    this._scrollAnimations.push(new ScrollAnimation(from, to, options))
    if (this._scrollAnimations.length === 1) {
      this._update()
    }
  }
  private _onScroll() {
    const external =
      this.scrollPosition !== Math.floor(maxMin(this._virtualPosition, this.scrollSize))
    if (external) {
      this._virtualPosition = this.scrollPosition
      this._to = this.scrollPosition
    }
    this.onScroll && this.onScroll(external)
  }
  private _update() {
    const previousPosition = this.scrollPosition
    this._scrollAnimations = this._scrollAnimations.filter(animation => {
      this._virtualPosition =
        (animation.options.force ? animation.from : this._virtualPosition - animation.distance) +
        animation.updateDistance()
      return !animation.isPastAnimation()
    })
    Misc.scrollBy(
      this._container,
      this._horizontal,
      Math.floor(this._virtualPosition) - previousPosition,
    )
    this._scrollAnimations.length > 0 ? requestAnimationFrame(() => this._update()) : this.stop()
  }
  private _getOptions(options: Partial<IScrollOptions> = {}) {
    const easing = options.easing || this.easing || "easeInOutQuad"
    return {
      easing: typeof easing === "string" ? Easings[easing] : easing,
      duration: options.duration === undefined ? this.duration : options.duration,
      force: options.force === undefined ? this.force : options.force,
    }
  }
  private _offsetElement(element: ElementOrQuery, value: number = 1, options: IScrollOptions) {
    const from = getValue(this._to)
    const to = () => this.elementSize(getElementFromQuery(element), value) + getValue(from)
    this._offsetValue(to, options)
  }
  private _offsetValue(value: number | (() => number), options: IScrollOptions) {
    const from = getValue(this._to)
    const to = () => getValue(value) + getValue(from)
    this._to = options.force ? to : getValue(to)
    this._createScrollAnimation(from, this._to, options)
  }
  private _scrollToValue(value: number | (() => number), options: IScrollOptions) {
    const from = options.force ? this.scrollPosition : getValue(this._to)
    const to = () => getValue(value)
    this._to = options.force ? to : getValue(to)
    this._createScrollAnimation(from, this._to, options)
  }
  private _scrollToElement(element: ElementOrQuery, value: number = 0, options: IScrollOptions) {
    const to = () => this.distToElement(getElementFromQuery(element), value) + this.scrollPosition
    this._scrollToValue(to, options)
  }
}
