import ScrollUtility = require("scroll-utility")

const options: {
  container?: Window | Element | HTMLElement | string
  horizontal?: boolean
  duration?: number
  easing?: string
  onScroll?: ((external?: boolean) => void) | null
} = {}

new ScrollUtility(options)
