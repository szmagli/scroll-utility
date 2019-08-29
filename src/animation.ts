import { easingFromFunction } from "./easings"
import { IScrollOptions } from "./types"

type DOMHighResTimeStamp = number

export type ScrollAnimationPosition = (() => number) | number

function getValue(value: ScrollAnimationPosition): number {
  return typeof value === "number" ? value : value()
}

class Animation {
  private initialTime: DOMHighResTimeStamp
  public distance: number = 0
  public get from() {
    return getValue(this._from)
  }
  public get to() {
    return getValue(this._to)
  }
  public get value() {
    return this.to - this.from
  }
  constructor(
    private _from: ScrollAnimationPosition,
    private _to: ScrollAnimationPosition,
    public options: Required<IScrollOptions>,
  ) {
    this.initialTime = performance.now()
  }
  public updateDistance(): number {
    this.distance = this.isPastAnimation()
      ? this.value
      : easingFromFunction(this.options.easing)(
          this.currentDuration,
          0,
          this.value,
          this.options.duration,
        )
    return this.distance
  }
  public isPastAnimation(): boolean {
    return this.currentDuration >= this.options.duration
  }
  private get currentDuration() {
    return performance.now() - this.initialTime
  }
}

export { Animation as ScrollAnimation }
