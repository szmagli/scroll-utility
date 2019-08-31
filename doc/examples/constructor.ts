import ScrollUtility = require("scroll-utility")

const options: {
  container?: string | Element | Window
  horizontal?: boolean
  duration?: number
  easing?: string
  onScroll?: ((external?: boolean) => void) | null
  force?: boolean
} = {}

ScrollUtility.new(options)
