import { ScrollUtility } from "./scroll"

export = Object.assign(new ScrollUtility(), {
  new: (options?: {
    container?: Window | Element | string
    horizontal?: boolean
    duration?: number
    easing?: string
    onScroll?: ((external?: boolean) => void) | null
    force?: boolean
  }) => new ScrollUtility(options),
})
