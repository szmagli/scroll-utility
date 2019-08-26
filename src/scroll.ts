import { AnimationManager } from "./animation-manager"
import { EasingOrFunction } from "./easings"
import { ElementOrQuery, Misc } from "./misc"

const THRESHOLD = 1.5

function getElementFromQuery(elementOrQuery: ElementOrQuery): Element | Window {
  if (typeof elementOrQuery === "string") {
    return document.querySelector(elementOrQuery) as Element
  }
  return elementOrQuery
}

export type Direction = "vertical" | "horizontal"

function horizontal(direction: Direction): boolean {
  return direction === "horizontal"
}

export interface IScrollOptions {
  direction?: Direction
  duration?: number
  easing?: EasingOrFunction
  onScroll?: ((external?: boolean) => void) | null
  dontForce?: boolean
}

// type Required<T> = { [K in keyof T]-?: T[K] }

export class ScrollUtility implements Required<IScrollOptions> {
  private _animationManager: AnimationManager
  private _element: Element | Window = window
  direction: Direction = "vertical"
  duration: number = 1000
  onScroll: ((external?: boolean) => void) | null = null
  easing: EasingOrFunction = "easeInOutQuad"
  dontForce: boolean = false
  constructor(container: ElementOrQuery = window, options: IScrollOptions = {}) {
    const element = getElementFromQuery(container)
    this._element = element === document.documentElement ? window : element
    this.updateOptions(options)
    let changed = false
    this._element.addEventListener("scroll", () => {
      const diff = Math.abs(this.scrollPosition - this._animationManager.position)
      changed = diff >= THRESHOLD
      if (changed) {
        // this.externalScroll = true
        this._animationManager.position = this.scrollPosition
      }
      this.onScroll && this.onScroll(changed)
    })
    this._animationManager = new AnimationManager(
      this.scrollPosition,
      value => ScrollUtility.Misc.scrollTo(this._element, value, horizontal(this.direction)),
      () => this.scrollSize,
    )
  }
  static Misc = Misc
  updateOptions(options: IScrollOptions = {}) {
    const realOptions = this.getOptions(options)
    this.direction = realOptions.direction
    this.onScroll = realOptions.onScroll
    this.duration = realOptions.duration
    this.easing = realOptions.easing
    this.dontForce = realOptions.dontForce
  }
  getOptions(options: IScrollOptions = {}): Required<IScrollOptions> {
    return {
      direction: options.direction || this.direction,
      easing: options.easing || this.easing,
      onScroll: options.onScroll || this.onScroll,
      dontForce: options.dontForce || this.dontForce,
      duration: options.duration !== undefined ? options.duration : this.duration,
    }
  }
  get size() {
    return ScrollUtility.Misc.getSize(this._element, horizontal(this.direction))
  }
  get scrollSize() {
    return ScrollUtility.Misc.getScrollSize(this._element, horizontal(this.direction)) - this.size
  }
  get scrollPosition() {
    return ScrollUtility.Misc.getScrollPosition(this._element, horizontal(this.direction))
  }
  relativePosition(elementOrQuery: ElementOrQuery): number {
    return ScrollUtility.Misc.getRelativeElementPosition(
      this._element,
      elementOrQuery,
      horizontal(this.direction),
    )
  }
  stop() {
    this._animationManager.stopAllAnimations()
  }
  scroll(value: number, options?: IScrollOptions): this
  scroll(element: ElementOrQuery, value?: number, options?: IScrollOptions): this
  scroll(...args: any[]) {
    const element = typeof args[0] === "number" ? null : args[0]
    const value = typeof args[0] === "number" ? args[0] : args[1]
    const options = this.getOptions(typeof args[0] === "number" ? args[1] : args[2])
    this.offset(
      !!element
        ? ScrollUtility.Misc.getDistToCenterElement(
            this._element,
            element,
            horizontal(options.direction),
            value,
          )
        : value - this.scrollPosition,
      options,
    )
    return this
  }
  offset(value: number, options: IScrollOptions = {}) {
    const realOptions = this.getOptions(options)
    this._animationManager.createScrollAnimation({
      distToScroll: value,
      duration: realOptions.duration,
      easing: realOptions.easing,
    })
    return this
  }
}
