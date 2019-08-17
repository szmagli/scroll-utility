import { AnimationManager } from "./animation-manager"
import { EasingOrFunction, Easings } from "./easings"
import * as ScrollElement from "./element"

type ElementOrQuery = Window | Element | string

function getElementFromQuery(elementOrQuery: ElementOrQuery): Element | Window {
  if (typeof elementOrQuery === "string") {
    return document.querySelector(elementOrQuery) as Element
  }
  return elementOrQuery
}

class Scroll {
  private animationManager: AnimationManager
  private element: Element | Window = window
  private horizontal: boolean
  public duration: number
  public onScroll: ((external?: boolean) => void) | null | undefined
  public easing: EasingOrFunction
  constructor(
    element?: ElementOrQuery,
    horizontal?: boolean,
    duration?: number,
    easing?: EasingOrFunction,
    onScroll?: (external?: boolean) => void,
  )
  constructor(options: {
    element?: ElementOrQuery
    horizontal?: boolean
    duration?: number
    easing?: EasingOrFunction
    onScroll?: (external?: boolean) => void
  })
  constructor(...args: any) {
    const options = !!args
      ? !!args[0] &&
        (!!args[0].element ||
          args[0].horizontal !== undefined ||
          !!args[0].duration ||
          !!args[0].easing ||
          !!args[0].onScroll)
        ? args[0]
        : {
            element: args[0],
            horizontal: args[1],
            duration: args[2],
            easing: args[3],
            onScroll: args[4],
          }
      : {}
    const element = getElementFromQuery(options.element || window)
    this.element = element === document.documentElement ? window : element
    this.horizontal = !!options.horizontal
    this.onScroll = options.onScroll
    this.duration = options.duration || 1000
    this.easing = options.easing || Easings.easeInOutQuad
    this.element.addEventListener("scroll", () => {
      const changed = Math.floor(this.animationManager.position) !== Math.floor(this.scrollPosition)
      if (changed) {
        this.animationManager.position = this.scrollPosition
      }
      this.onScroll && this.onScroll(changed)
    })
    this.animationManager = new AnimationManager(
      this.scrollPosition,
      value => ScrollElement.scrollTo(this.element, value, this.horizontal),
      () => this.scrollSize,
    )
  }
  get size() {
    return ScrollElement.getSize(this.element, this.horizontal)
  }
  get scrollSize() {
    return ScrollElement.getScrollSize(this.element, this.horizontal) - this.size
  }
  get scrollPosition() {
    return ScrollElement.getScrollPosition(this.element, this.horizontal)
  }
  getRelativeElementPosition(elementOrQuery: ElementOrQuery): number {
    return ScrollElement.getRelativeElementPosition(this.element, elementOrQuery, this.horizontal)
  }
  stopAllAnimations() {
    this.animationManager.stopAllAnimations()
  }
  scroll(value: number, duration?: number, easing?: EasingOrFunction): this
  scroll(options: { value: number; duration?: number; easing?: EasingOrFunction }): this
  scroll(element: ElementOrQuery, value: number, duration?: number, easing?: EasingOrFunction): this
  scroll(options: {
    element: ElementOrQuery
    value?: number
    duration?: number
    easing?: EasingOrFunction
  }): this
  scroll(...args: any) {
    const valueIndex = typeof args[0] !== "number" ? 1 : 0
    const options = !!args
      ? !!args[0].element || !!args[0].value
        ? args[0]
        : {
            element: !!valueIndex ? args[0] : null,
            value: args[valueIndex],
            duration: args[valueIndex + 1],
            easing: args[valueIndex + 2],
          }
      : {}
    this.offset(
      !!options.element
        ? ScrollElement.getDistToCenterElement(
            this.element,
            options.element,
            this.horizontal,
            options.value,
          )
        : options.value - this.scrollPosition,
      options.duration,
      options.easing,
    )
    return this
  }
  offset(value: number, duration?: number, easing?: EasingOrFunction): this
  offset(options: { value: number; duration?: number; easing?: EasingOrFunction }): this
  offset(...args: any) {
    const options = !!args
      ? !!args[0].value
        ? args[0]
        : {
            value: args[0],
            duration: args[1],
            easing: args[2],
          }
      : {}
    this.animationManager.createScrollAnimation({
      distToScroll: options.value,
      duration: options.duration || this.duration,
      easing: options.easing || this.easing,
    })
    return this
  }
}

export { Scroll }
