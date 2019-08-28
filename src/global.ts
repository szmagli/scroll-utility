// import { Easings } from "./easings"

export type EasingOrFunction = EasingFunction | string // keyof typeof Easings

export type EasingFunction = (
  currentStep: number,
  offsetValue: number,
  distance: number,
  totalSteps: number,
) => number

export type ElementOrQuery = Window | Element | string

export interface IScrollOptions {
  horizontal?: boolean
  duration?: number
  easing?: EasingOrFunction
  onScroll?: ((external?: boolean) => void) | null
}
