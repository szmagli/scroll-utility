import ScrollUtility = require("scroll-utility")

new ScrollUtility({} as {
  container?: string | Element | Window
  horizontal?: boolean
  duration?: number
  easing?: string | (() => number)
  onScroll?: ((external?: boolean, last?: boolean) => void) | null
  onStop?: (() => void) | null
  force?: boolean
})
