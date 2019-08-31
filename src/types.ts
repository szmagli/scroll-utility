// import { Easings } from "./easings"

export type EasingOrFunction = EasingFunction | string // keyof typeof Easings

export type EasingFunction = (
  currentStep: number,
  offsetValue: number,
  distance: number,
  totalSteps: number,
) => number

export type ScrollElement = Window | Element
export type ElementOrQuery = ScrollElement | string

export interface IScrollOptions {
  container?: ElementOrQuery
  horizontal?: boolean
  duration?: number
  easing?: EasingOrFunction
  onScroll?: ((external?: boolean) => void) | null
  force?: boolean
}

export interface IScrollPropertyOptions extends Pick<IScrollOptions, "container" | "horizontal"> {}

export interface IScroll extends Required<IScrollOptions> {
  container: ScrollElement
}
