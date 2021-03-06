// tslint:disable
export type EasingFunction = (
  currentStep: number,
  offsetValue: number,
  distance: number,
  totalSteps: number,
) => number

export const defaultEasingFunction: EasingFunction = (
  currentStep: number,
  offsetValue: number,
  distance: number,
  totalSteps: number,
) => {
  currentStep /= totalSteps / 2
  if (currentStep < 1) return (distance / 2) * currentStep * currentStep + offsetValue
  currentStep--
  return (-distance / 2) * (currentStep * (currentStep - 2) - 1) + offsetValue
}
