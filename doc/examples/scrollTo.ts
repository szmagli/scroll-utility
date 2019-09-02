import ScrollUtility = require("scroll-utility")

const scrollManager = new ScrollUtility()

const options: {
  duration?: number
  easing?: (() => number) | string
  force?: boolean
} = {}

scrollManager.scrollTo(0, options) // start
scrollManager.scrollTo("#some-element", 0, options) // scroll to element
