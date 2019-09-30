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
