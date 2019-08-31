import { Misc, getElementFromQuery } from "./misc"
import { ScrollAnimation, ScrollAnimationPosition } from "./animation"
import { ElementOrQuery, IScrollOptions, IScrollPropertyOptions } from "./types"

function maxMin(value: number, max: number) {
  return Math.max(Math.min(value, max), 0)
}

export class ScrollUtility implements Required<IScrollOptions> {
  private _scrollElements: (Element | Window)[] = [window]
  private _scrollElementsX = [0]
  private _scrollElementsY = [0]
  private _scrollAnimations: ScrollAnimation[] = []

  container: Required<IScrollOptions>["container"] = window
  horizontal = false
  duration = 1000
  onScroll: ((external?: boolean) => void) | null = null
  easing: Required<IScrollOptions>["easing"] = "easeInOutQuad"
  force = false
  constructor(options: IScrollOptions = {}) {
    this.updateOptions(options)
  }
  getSize(options: IScrollPropertyOptions = {}) {
    const realOptions = this._getOptions(options)
    return Math.floor(Misc.getSize(realOptions.container, realOptions.horizontal))
  }
  getScrollSize(options: IScrollPropertyOptions = {}) {
    const realOptions = this._getOptions(options)
    return (
      Math.floor(Misc.getScrollSize(realOptions.container, realOptions.horizontal)) -
      this.getSize(realOptions)
    )
  }
  getScrollPosition(options: IScrollPropertyOptions = {}) {
    const realOptions = this._getOptions(options)
    return Math.floor(Misc.getScrollPosition(realOptions.container, realOptions.horizontal))
  }
  updateOptions(options: IScrollOptions = {}) {
    const realOptions = this._getOptions(options)
    this.container = realOptions.container
    this.horizontal = realOptions.horizontal
    this.onScroll = realOptions.onScroll
    this.duration = realOptions.duration
    this.easing = realOptions.easing
  }
  relativePosition(options: { element: ElementOrQuery } & IScrollPropertyOptions): number {
    const realOptions = this._getOptions(options)
    const element = getElementFromQuery(options.element)
    return Misc.getRelativeElementPosition(realOptions.container, element, realOptions.horizontal)
  }
  stop() {
    this._scrollAnimations = []
    this._scrollElements = []
    this._scrollElementsX = []
    this._scrollElementsY = []
  }
  scrollTo(value: number, options?: IScrollOptions): this
  scrollTo(element: ElementOrQuery, value?: number, options?: IScrollOptions): this
  scrollTo(...args: any[]) {
    const element: ElementOrQuery | null = typeof args[0] === "number" ? null : args[0]
    const value: number = typeof args[0] === "number" ? args[0] : args[1]
    const options = this._getOptions(typeof args[0] === "number" ? args[1] : args[2])
    const from = this.getScrollPosition(options)
    const to = !!element
      ? Misc.getDistToCenterElement(
          options.container,
          getElementFromQuery(element),
          options.horizontal,
          value,
        ) + from
      : maxMin(value, this.getScrollSize(options))
    this._createScrollAnimation(from, to, options)
    return this
  }
  offset(value: number, options?: IScrollOptions) {
    const realOptions = this._getOptions(options)
    const from = this.getScrollPosition(realOptions)
    const to = from + value
    this._createScrollAnimation(from, to, realOptions)
    return this
  }

  private _createScrollAnimation(
    from: ScrollAnimationPosition,
    to: ScrollAnimationPosition,
    options: Required<IScrollOptions>,
  ) {
    this._scrollAnimations.push(new ScrollAnimation(from, to, options))
    this._update()
  }
  private _update() {
    const modified: boolean[] = []
    const external: boolean[] = []

    this._scrollElements.forEach((element, index) => {
      const scrollX = Math.floor(Misc.getScrollPosition(element, true))
      const scrollY = Math.floor(Misc.getScrollPosition(element, false))
      const width = Math.floor(Misc.getScrollSize(element, true))
      const height = Math.floor(Misc.getScrollSize(element, false))
      const externalX = scrollX !== maxMin(Math.floor(this._scrollElementsX[index]), width)
      const externalY = scrollY !== maxMin(Math.floor(this._scrollElementsY[index]), height)
      if (externalX) {
        this._scrollElementsX[index] = scrollX
      }
      if (externalY) {
        this._scrollElementsY[index] = scrollY
      }
      external[index] = externalY || externalX
    })

    this._scrollAnimations = this._scrollAnimations.filter(animation => {
      const element = getElementFromQuery(animation.options.container)
      let index = this._scrollElements.findIndex(el => el === element)
      if (index === -1) {
        index = this._scrollElements.length
        this._scrollElements[index] = element
        this._scrollElementsX[index] = this.getScrollPosition({
          ...animation.options,
          horizontal: true,
        })
        this._scrollElementsY[index] = this.getScrollPosition({
          ...animation.options,
          horizontal: false,
        })
      }
      modified[index] = true
      const value = -animation.distance + animation.updateDistance()
      this._scrollElementsX[index] += animation.options.horizontal ? value : 0
      this._scrollElementsY[index] += !animation.options.horizontal ? value : 0
      return !animation.isPastAnimation()
    })

    this._scrollElements.filter((element, index) => {
      Misc.scrollTo(
        element,
        Math.floor(this._scrollElementsX[index]),
        Math.floor(this._scrollElementsY[index]),
      )
      return modified[index]
    })

    this._scrollAnimations.length > 0 ? requestAnimationFrame(() => this._update()) : this.stop()
  }
  private _getOptions(options: IScrollOptions = {}) {
    return {
      container: getElementFromQuery(options.container || this.container),
      horizontal: options.horizontal === undefined ? this.horizontal : options.horizontal,
      easing: options.easing || this.easing,
      onScroll: options.onScroll || this.onScroll,
      duration: options.duration === undefined ? this.duration : options.duration,
      force: options.force === undefined ? this.force : options.force,
    }
  }
}
